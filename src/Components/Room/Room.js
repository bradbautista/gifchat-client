import React, { Component } from 'react';
import './Room.css';
import io from 'socket.io-client';
import { render } from '@testing-library/react';
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
      }
    };

  }

  
  sendMessage = (msg) => {
  
    console.log(this.state.messages)
    console.log(msg)

    // HI BRAD THIS IS BRAD THE CODE BELOW IS JUST FOR THE DUMMY CLIENT, THE CODE BELOW THAT IS GOOD AND YOU SHOULD UNCOMMENT IT AT THE PROPER TIME BUT FOR NOW WE'RE JUST PUSHING THE IMAGE INTO THE MESSAGES ARRAY

    this.setState({ gifs: {previews: [], fullsize: []} })
    this.setState({ value: '' })
    this.setState({messages: [...this.state.messages, msg]})

    // Designate the server socket to emit to; this will have
    // to be the room name, i.e. url (path?); when we get there, we'll 
    // need to install and require unique names, but for now it's just
    // going to connect to the proof-of-concept server
    // const socket = io('http://localhost:3000/');

    // Emit a chat message to the server; rather than
    // this.state.value, the value after the function
    // name changes will be the GIF url. Don't know
    // whether we'll need a setState statement after
    // socket.emit('chat message', this.state.value);
    //       this.setState({value: ''})
  
  }

  // Query the Tenor API for GIFs related to the search term, then set those GIFs in state as GIF options

  getGifs = (e) => {
    
    e.preventDefault()

    // Clear the previous options
    this.setState({previews: []})

    const endpoint = config.API_ENDPOINT
    const query = this.state.value
    const apiKey = config.API_KEY
    const limit = 8 // The number of gifs to fetch

    const url = `${endpoint}search?q=${query}&key=${apiKey}&limit=${limit}`
    const options = {
      method: 'GET',
      redirect: 'follow',
    }

    // console.log(url)
    // console.log(endpoint)
    // console.log(query)
    // console.log(this.state)

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

  // Updates state with search term as user types
  handleChange = (e) => {
    
    this.setState({value: e.target.value});
  
  }

  emptyOptions = (e) => {
    
    let n = Math.floor(Math.random() * Math.floor(7));

    const prngArray = this.state.gifs.previews.splice(0, n);

    console.log(prngArray)

    e.preventDefault()
    this.setState({gifs: {previews: [...prngArray]}});
    // console.log('Heya')
  
  }

  // When the server emits a msg to the client,
  // update this.state.messages to include the msg
  handleMessage = (msg) => {

    console.log(msg)
    
    this.setState({messages: [...this.state.messages, msg]})

    console.log(this.state.messages)

  }

  // When the page loads, 
  componentDidMount() {

    // console.log(this)

    // console.log(this.state.messages)

    // Establish which socket to communicate with;
    // this will ultimately be the room URL, but for
    // now it's just the dummy server
    // const socket = io('http://localhost:3000');

    // When the 
    // socket.on('chat message', this.handleMessage)

  }
  

  render() {

    // console.log(this.state.value)

    const msgs = this.state.messages.map((msg) => {
        return (
            <li key={uuidv4()}>
                <img src={msg}></img>
            </li>
        )
    })

    const gifOptions = this.state.gifs.previews.map((preview, i) => {

        // We don't want to send the preview to the server, we want to send the full-size gif

        const fullSizeGif = this.state.gifs.fullsize[i]

        // Select small preview gif and arrange them in a flex container that wraps
        return (
            <li key={i}>
                <img onClick={() => this.sendMessage(fullSizeGif)} className="chat-message" src={preview} />
            </li>
        )
    })

  return (
    <div className="Room">
    <main>

        <ul className="messages">
        {msgs}
        </ul>

        <form onSubmit={this.getGifs}>
        {/* <form onSubmit={this.emptyOptions}> */}

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

          <img className="tenor-attr" src="https://www.gstatic.com/tenor/web/attribution/PB_tenor_logo_blue_horizontal.png" />

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

