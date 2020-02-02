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
      messages: ["http://media.tenor.com/images/0f097ed319d498c2bda3d87ba4f6ff10/tenor.gif", "http://media.tenor.com/images/0f097ed319d498c2bda3d87ba4f6ff10/tenor.gif"],
      gifOptions: ["http://media.tenor.com/images/6b69e96d18e0cfb8248d7a138411d0ce/tenor.gif", "http://media.tenor.com/images/6b69e96d18e0cfb8248d7a138411d0ce/tenor.gif"],
    };

  }

  
  // This function name should and will change to handleSelect,
  // since it will run when the user selects a gif by clicking on it

  sendMessage = (e) => {
    
    e.preventDefault()
  
    console.log('We chattin')
    console.log(this.state.messages)

    // Designate the server socket to emit to; this will have
    // to be the room name, i.e. url (path?); when we get there, we'll 
    // need to install and require unique names, but for now it's just
    // going to connect to the proof-of-concept server
    const socket = io('http://localhost:3000/');

    // Emit a chat message to the server; rather than
    // this.state.value, the value after the function
    // name changes will be the GIF url. Don't know
    // whether we'll need a setState statement after
    socket.emit('chat message', this.state.value);
          this.setState({value: ''})
  
  }

  // Query the Tenor API for GIFs related to the search term,
  // then set those GIFs in state

  getGifs = (e) => {
    
    e.preventDefault()

    // Clear the previous options
    this.setState({gifOptions: []})

    console.log(this.state.gifOptions)
  
    console.log('We fetchin')

    const endpoint = config.API_ENDPOINT
    const query = this.state.value
    const apiKey = config.API_KEY
    console.log(config.API_KEY)

    const url = `${endpoint}search?q=${query}&key=${apiKey}&limit=5`
    const options = {
      method: 'GET',
      redirect: 'follow',
    }

    console.log(url)
    console.log(endpoint)
    console.log(query)

    return fetch(url, options)
        .then((res) => {
          return res.json();
        })
        .then((ourJson) => {
          console.log(ourJson)
          // this.setState({gifOptions: [...this.state.gifOptions, ]})
        })
        .catch(error => {    console.error(error)  })
    

    // // Emit a chat message
    // socket.emit('chat message', this.state.value);
    //       this.setState({value: ''})
  
  }

  renderGifs() {
    
    // const { articleList = [] } = this.context
    // return articleList.map(article =>
    //   <ArticleListItem
    //     key={article.id}
    //     article={article}
    //   />
    // )
  
  }

  // Updates state with search term as user types
  handleChange = (e) => {
    
    this.setState({value: e.target.value});
  
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

    console.log(this)

    console.log(this.state.messages)

    // Establish which socket to communicate with;
    // this will ultimately be the room URL, but for
    // now it's just the dummy server
    const socket = io('http://localhost:3000');

    // When the 
    socket.on('chat message', this.handleMessage)

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

    const gifOptions = this.state.gifOptions.map((option) => {
        // Select small preview gif and arrange them in a flex container that wraps
        return (
            <li key={uuidv4()}>
                <img src={option}></img>
            </li>
        )
    })

  return (
    <div className="Room">
    <main>
        <ul id="messages">
        {msgs}
        </ul>
        <form onSubmit={this.getGifs}>
            <div className="room-input-flex-wrapper">
                <input type="text" value={this.state.value} onChange={this.handleChange} id="m" autoComplete="off" />
                <button>Search</button>
            </div>
        <ul id="gif-options">
        {gifOptions}
        </ul>
        </form>
    </main>

    </div>
  );

  }
}

