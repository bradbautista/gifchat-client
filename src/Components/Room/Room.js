import React, { Component } from 'react';
import './Room.css';
import io from 'socket.io-client';
import config from '../../config'
const uuidv4 = require('uuid/v4');

export default class Room extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      messages: [],
      gifs: {
        previews: [],
        fullsize: [],
      },
      room: []
    };

  }

  getMessages = () => {

    // If false, we want the server to reject the request.
    const isConnected = this.state.room.connected;

    // We're using regex to get url components
    const roomRegEx = /([^/]+$)/
    const roomName = roomRegEx.exec(this.props.location.pathname)[0]
    const subdirRegEx = /^(.*[\\\/])/
    const subdir = subdirRegEx.exec(this.props.location.pathname)[0].slice(1)

    const endpoint = config.GIFCHAT_API_ENDPOINT
    const url = `${endpoint}${subdir}${roomName}`

    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'isconnected': JSON.stringify(isConnected)
      }
    }

    return fetch(url, options)
      .then(messages => {
        if (!messages.ok) {
            return messages.json().then(error => {
            throw error
            })
        }
        return messages.json()
      })
      .then(messages => {
        // Trim the chaff from the response and set them in state
        const messageArray = messages[0].messages
        this.setState({ messages: [...messageArray]})
      })
      .catch(error => { console.error(error) })

  }

  reportConnection = () => {

    const roomRegEx = /([^/]+$)/
    const roomName = roomRegEx.exec(this.props.location.pathname)[0]
    const subdirRegEx = /^(.*[\\\/])/
    const subdir = subdirRegEx.exec(this.props.location.pathname)[0].slice(1)
    const endpoint = config.GIFCHAT_API_ENDPOINT
    const url = `${endpoint}${subdir}${roomName}`

    const currentDate = { date: Date.now() }

    const options = {
      method: 'PUT',
      body: JSON.stringify(currentDate),
      headers: {
        'content-type': 'application/json',
      }
    }

    return fetch(url, options)
      .then(res => {
        if (!res.ok) {
            // get the error message from the response,
            return res.json().then(error => {
            // then throw it
            throw error
            })
        }
        return res.json()
      })
      .catch(error => { console.error(error) })

  }
  
  sendMessage = (msg) => {

    this.setState({ gifs: {previews: [], fullsize: []} })
    
    const socket = this.state.room

    socket.emit('chat message', msg)

    this.setState({value: ''})

    this.addToConversation(msg)
  
  }

  addToConversation = (msg) => {

    const roomRegEx = /([^/]+$)/
    const roomName = roomRegEx.exec(this.props.location.pathname)[0]
    const subdirRegEx = /^(.*[\\\/])/
    const subdir = subdirRegEx.exec(this.props.location.pathname)[0].slice(1)
    const endpoint = config.GIFCHAT_API_ENDPOINT
    const url = `${endpoint}${subdir}${roomName}`

    const message = { msg }

    const options = {
      method: 'PATCH',
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json',
      }
    }

    return fetch(url, options)
      .then(res => {
        if (!res.ok) {
            return res.json().then(error => {
            throw error
            })
        }
        return res.json()
      })
      .catch(error => { console.error(error) })

  }

  // Query the Tenor API for GIFs related to the search term, then set those GIFs in state as GIF options

  getGifs = (e) => {
    
    e.preventDefault()

    this.setState({previews: []})

    const gif_endpoint = config.TENOR_API_ENDPOINT
    const query = this.state.value
    const apiKey = config.API_KEY
    const limit = 10 // The number of gifs to fetch

    // Media_filter gets rid of unnecessary results in the response, ar_range controls aspect ratio (normal or wide, we're going with default)

    const url = `${gif_endpoint}search?q=${query}&key=${apiKey}&limit=${limit}&media_filter=minimal`
    const options = {
      method: 'GET',
      redirect: 'follow',
    }

    return fetch(url, options)
        .then((res) => {
          return res.json();
        })
        .then((responseJson) => {

          // Trim the results
          const searchResults = responseJson.results

          // Extract previews from the results
          const gifPreviews = searchResults.map((result) => {
            return result.media[0].tinygif.url
          })

          // Extract the full-size gifs from the results so we can send the full-size gif to chat
          const fullSizeGifs = searchResults.map((result) => {
            return result.media[0].gif.url
          })
          
          // Set the gifs
          this.setState({
            gifs: {
              previews: [...gifPreviews], 
              fullsize: [...fullSizeGifs]
            }
          })
          
        })
        .catch(error => { console.error(error) })
  
  }

  // Updates state with search term as user types; this is causing some weird behavior with gifs restarting locally, so we'll need to check that behavior once we deploy the server
  handleChange = (e) => {
    
    this.setState({value: e.target.value});
  
  }

  handleMessage = (msg) => {

    this.setState({messages: [...this.state.messages, msg]})

  }

  componentDidMount() {

    const api_endpoint = config.GIFCHAT_API_ENDPOINT

    // Connect to the socket
    const socket = io.connect(api_endpoint);
    this.setState({ room: socket })

    // Listen for incoming messages and handle them when they come in
    socket.on('chat message', this.handleMessage);

    // Wait a beat for this.state.room to have a value,
    // then try to retrieve any messages in the room.
    // This is necessary because we want to pass along the
    // value of socket.connected and reject requests if the
    // user is not connected
    setTimeout(() => {this.getMessages()}, 500);

    // Refresh the last-connection date in the db
    this.reportConnection();

  }
   
  componentDidUpdate() {
    
  }
  

  render() {

    const msgs = this.state.messages.map((msg) => {
        return (
            <li key={uuidv4()}>
                <img alt='' src={msg}></img>
            </li>
        )
    })

    const gifOptions = this.state.gifs.previews.map((preview, i) => {

        // We don't want to send the preview to the server, we want to send the full-size gif
        const fullSizeGif = this.state.gifs.fullsize[i]

        // Select small preview gifs and arrange them in a flex container that wraps
        return (
            <li id={i} key={i}>
                <img onClick={() => this.sendMessage(fullSizeGif)} className="gif-option" src={preview} alt=''/>
            </li>
        )
    })

  return (
    <div>
      <main className="room">

          <ul className="messages">
          {msgs.reverse()}
          </ul>
          
          <form onSubmit={this.getGifs}>

            <div className="room-input-flex-wrapper">
              <input type="text" 
                value={this.state.value} 
                onChange={this.handleChange} 
                id="m" 
                autoComplete="off" 
                placeholder="Enter search term"
              />
              <button>Search</button>
            </div>

            <img alt='' className="tenor-attr" src="https://www.gstatic.com/tenor/web/attribution/PB_tenor_logo_blue_horizontal.png" />

            {/* React wants to re-render the form component every time the array (and thus height) changes, which kills our CSS transition. To get around this, we generate a dynamic height value based on the length of the array. */}

            <ul className="gif-options" 
            style={{ height: this.state.gifs.previews.length * 15 + 'rem'}}
            >
            {gifOptions}
            </ul>

          </form>
      </main>

    </div>
  );

  }
}

