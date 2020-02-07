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

  
  sendMessage = (msg) => {

    // HI BRAD THIS IS BRAD THE CODE BELOW IS JUST FOR THE DUMMY CLIENT, THE CODE BELOW THAT IS GOOD AND YOU SHOULD UNCOMMENT IT AT THE PROPER TIME BUT FOR NOW WE'RE JUST PUSHING THE IMAGE INTO THE MESSAGES ARRAY

    this.setState({ gifs: {previews: [], fullsize: []} })
    // this.setState({ value: '' })
    this.setState({messages: [...this.state.messages, msg]})

    // We're using regex to get the room name; this will pull everything after the last slash in the url; .exec returns an array, but the first item in it is what we want
    const roomRegEx = /([^/]+$)/
    const roomName = roomRegEx.exec(this.props.location.pathname)[0]

    // We're also using regex to get the subdirectory, either /rooms/ or /randos/. We want to use RegEx rather than slice or something to account for differences in name length
    const subdirRegEx = /^(.*[\\\/])/
    const subdir = subdirRegEx.exec(this.props.location.pathname)[0]

    const endpoint = config.GIFCHAT_API_ENDPOINT
    const url = `${endpoint}${subdir}${roomName}`
    console.log(url)
    
    // Establish which socket to communicate with;
    // this will ultimately be the room URL, but for
    // now it's just the dummy server
    const socket = this.state.room

    socket.connect();

    // Emit a chat message to the server
    socket.emit('chat message', (msg) => {
      console.log(msg)
      this.checkConnection();
    });
    // console.log(socket.emit('chat message', msg));
    this.setState({value: ''})
  
  }

  // Query the Tenor API for GIFs related to the search term, then set those GIFs in state as GIF options

  getGifs = (e) => {
    
    e.preventDefault()

    // Clear the previous options
    this.setState({previews: []})

    const endpoint = config.TENOR_API_ENDPOINT
    const query = this.state.value
    const apiKey = config.API_KEY
    const limit = 10 // The number of gifs to fetch

    // Media_filter gets rid of unnecessary results in the response, ar_range controls aspect ratio 

    const url = `${endpoint}search?q=${query}&key=${apiKey}&limit=${limit}&media_filter=minimal`
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

  // When the server emits a msg to the client,
  // update this.state.messages to include the msg
  handleMessage = (msg) => {

    console.log(msg)
    
    // this.setState({messages: [...this.state.messages, msg]})

  }

  checkConnection = () => {

    const socket = this.state.room;

    console.log('Socket connected: ' + socket.connected)
    console.log('Socket disconnected: ' + socket.disconnected)

  }

  // When the page loads, 
  componentDidMount() {

    // We're using regex to get the room name; this will pull everything after the last slash in the url; .exec returns an array, but the first item in it is what we want
    const roomRegEx = /([^/]+$)/
    const roomName = roomRegEx.exec(this.props.location.pathname)[0]

    // We're also using regex to get the subdirectory, either /rooms/ or /randos/. We want to use RegEx rather than slice or something to account for differences in name length
    const subdirRegEx = /^(.*[\\\/])/
    const subdir = subdirRegEx.exec(this.props.location.pathname)[0]

    const api_endpoint = config.GIFCHAT_API_ENDPOINT
    const url = `${api_endpoint}${subdir}${roomName}`
    console.log(url)
    // console.log(this)
    
    // Connect to the socket and tell it which room to put the user in
    const socket = io.connect(url, {reconnect: true});
    this.setState({ room: socket })

    console.log(socket)

    socket.on('connect', function(socket) {
      // Connected, let's sign up for to receive messages for this room
      socket.emit('room', roomName);
      console.log(socket.connected);
      socket.emit('refresh');
      console.log(socket.connected);
    })

    socket.on('chat message', this.handleMessage);

    // When the 
    // socket.on('chat message', this.handleMessage)

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

        // Select small preview gif and arrange them in a flex container that wraps
        return (
            <li id={i} key={i}>
                <img onClick={() => this.sendMessage(fullSizeGif)} className="gif-option" src={preview} alt=''/>
            </li>
        )
    })

  return (
    <div>
      <main className="room">

          <ul className="messages"
          
          onClick = {() => {this.checkConnection()}}

          >
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

