import React, { Component } from 'react';
import './Room.css';
import io from 'socket.io-client';
import config from '../../config';
const uuidv4 = require('uuid/v4');

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      messages: [],
      gifs: {
        previews: [],
        fullsize: []
      },
      room: [],
      error: false,
      next: 0,
      noresults: false
    };
  };

  getMessages = () => {
    // If false, we want the server to reject the request.
    const isConnected = this.state.room.connected;

    let roomName = this.props.location.pathname.split('/').pop();

    // This is to prevent server crashes, as well as indicate the
    // nature of the problem in logs. The server depends on the
    // value of a value in the socket handshake to put the user
    // in a room, and we need to make sure there's always a valid
    // value there or else the server crashes and ruins everyone's fun.
    if (roomName === undefined) {
      roomName = 'oops-something-went-wrong-undefined';
    } else if (roomName === null) {
      roomName = 'oops-something-went-wrong-null';
    } else if (!roomName) {
      roomName = 'oops-something-went-wrong-other';
    }

    const subdir = this.props.location.pathname.split('/')[1];

    const endpoint = config.GIFCHAT_API_ENDPOINT;
    const url = `${endpoint}${subdir}/${roomName}`;

    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        isconnected: JSON.stringify(isConnected)
      }
    };

    return fetch(url, options)
      .then(messages => {
        if (!messages.ok) {
          return messages.json().then(error => {
            throw error;
          });
        }
        return messages.json();
      })
      .then(messages => {
        // Trim the chaff from the response and set them in state
        const messageArray = messages[0].messages;
        this.setState({ messages: [...messageArray] });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  };

  reportConnection = () => {
    let roomName = this.props.location.pathname.split('/').pop();

    // This is to prevent server crashes, as well as indicate the
    // nature of the problem in logs.
    if (roomName === undefined) {
      roomName = 'oops-something-went-wrong-undefined';
    } else if (roomName === null) {
      roomName = 'oops-something-went-wrong-null';
    } else if (!roomName) {
      roomName = 'oops-something-went-wrong-other';
    }

    const subdir = this.props.location.pathname.split('/')[1];
    const endpoint = config.GIFCHAT_API_ENDPOINT;
    const url = `${endpoint}${subdir}/${roomName}`;

    const currentDate = { date: Date.now() };

    const options = {
      method: 'PUT',
      body: JSON.stringify(currentDate),
      headers: {
        'content-type': 'application/json'
      }
    };

    return fetch(url, options)
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error;
          });
        }
        return res.json();
      })
      .catch(error => {
        console.error(error);
      });
  };

  sendMessage = msg => {
    this.setState({ gifs: { previews: [], fullsize: [] } });

    const socket = this.state.room;

    socket.emit('chat message', msg);

    this.setState({ value: '' });
    
    this.setState({ next: 0 });

    this.addToConversation(msg);
  };

  addToConversation = msg => {
    let roomName = this.props.location.pathname.split('/').pop();

    if (roomName === undefined) {
      roomName = 'oops-something-went-wrong5';
    } else if (roomName === null) {
      roomName = 'oops-something-went-wrong6';
    } else if (!roomName) {
      roomName = 'oops-something-went-wrong7';
    }

    const subdir = this.props.location.pathname.split('/')[1];
    const endpoint = config.GIFCHAT_API_ENDPOINT;
    const url = `${endpoint}${subdir}/${roomName}`;

    const message = { msg };

    const options = {
      method: 'PATCH',
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json'
      }
    };

    return fetch(url, options)
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error;
          });
        }
        return res.json();
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Query the Tenor API for GIFs related to the search term, then set those GIFs in state as GIF options. Additionally, reset next, noresults and gif arrays.

  getNewGifs = e => {
    e.preventDefault();
    this.setState({ next: 0 });
    this.setState({ noresults: false });
    this.setState({ gifs: {previews: [], fullsize: [] }});
    this.getGifs(e);
  };

  getGifs = e => {
    e.preventDefault();

    const gif_endpoint = config.TENOR_API_ENDPOINT;
    const query = this.state.value;
    const apiKey = config.API_KEY;
    const limit = 10; // The number of gifs to fetch
    const next = this.state.next // The next page of gifs

    // Media_filter gets rid of unnecessary results in the response, ar_range controls aspect ratio (normal or wide, we're going with default)

    const url = `${gif_endpoint}search?q=${query}&key=${apiKey}&limit=${limit}&pos=${next}&media_filter=minimal`;
    const options = {
      method: 'GET',
      redirect: 'follow'
    };

    return fetch(url, options)
      .then(res => {
        return res.json();
      })
      .then(responseJson => {
        // Trim the results
        const searchResults = responseJson.results;
        
        if (searchResults.length === 0) {
          this.setState({ noresults: true });
        };
        
        // Extract previews from the results
        const gifPreviews = searchResults.map(result => {
          return result.media[0].tinygif.url;
        });

        // Extract the full-size gifs from the results so we can send the full-size gif to chat
        const fullSizeGifs = searchResults.map(result => {
          return result.media[0].gif.url;
        });

        // Set the gifs
        this.setState({
          gifs: {
            previews: [...this.state.gifs.previews, ...gifPreviews],
            fullsize: [...this.state.gifs.fullsize, ...fullSizeGifs]
          }
        });

        // Set next; due to the way the Tenor API handles next,
        // set it to 0 if the number is not divisible by 10
        // (which indicates that we have or will very) shortly
        // run out of gifs. This is because if you query the
        // api with pos=55, it'll just return an empty set of
        // results with next as zero. However, it also sometimes
        // starts by giving you a 9 instead of a 10, in which case
        // all the subsequent values are 29, 39, and so on.
       
        ((parseInt(responseJson.next) % 10 != 0) && (responseJson.next.slice(-1) != '9'))
        ? this.setState({ next: '0' })
        : this.setState({ next: responseJson.next })
      })
      .catch(error => {
        console.error(error);
      });
  };


  // Updates state with search term as user types
  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  handleMessage = msg => {
    this.setState({ messages: [...this.state.messages, msg] });
  };

  componentDidMount() {
    const api_endpoint = config.GIFCHAT_API_ENDPOINT;

    // Connect to the socket
    const socket = io.connect(api_endpoint);
    this.setState({ room: socket });

    // Listen for incoming messages and handle them when they come in
    socket.on('chat message', this.handleMessage);

    // Wait a beat for this.state.room to have a value,
    // then try to retrieve any messages in the room.
    // This is necessary because we want to pass along the
    // value of socket.connected and reject requests if the
    // user is not connected
    setTimeout(() => {
      this.getMessages();
    }, 500);

    // Refresh the last-connection date in the db
    setTimeout(() => {
      this.reportConnection();
    }, 500);
  };

  componentDidUpdate() {};

  render() {
    const msgs = this.state.messages.map(msg => {
      return (
        <li key={uuidv4()}>
          <img alt="" src={msg}></img>
        </li>
      );
    });

    const gifOptions = this.state.gifs.previews.map((preview, i) => {
      // We don't want to send the preview to the server, we want to send the full-size gif
      const fullSizeGif = this.state.gifs.fullsize[i];

      // Select small preview gifs and arrange them in a flex container that wraps
      return (
        <li id={i} key={i}>
          <img
            onClick={() => this.sendMessage(fullSizeGif)}
            className="gif-option"
            src={preview}
            alt=""
          />
        </li>
      );
    });

    return (
      <div>
        <main className="room">
          <ul className="messages">
            <div
              style={{ display: this.state.error ? '' : 'none' }}
              className="error"
            >
              Error: Messages could not be displayed. The room does not exist,
              is full, or the Internet is broken. Try refreshing, or
              <a href="https://gifchat.now.sh/" style={{ fontWeight: 700 }}>
                {' '}
                leave this place.
              </a>
            </div>
            {msgs.reverse()}
          </ul>

          <form onSubmit={this.getNewGifs}>
            <div className="room-input-flex-wrapper">
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                id="m"
                autoComplete="off"
                placeholder="Enter search term"
              />
              <button>Search</button>
            </div>

            <img
              alt=""
              className="tenor-attr"
              src="https://www.gstatic.com/tenor/web/attribution/PB_tenor_logo_blue_horizontal.png"
            />

            {/* React wants to re-render the form component every time the array (and thus height) changes, which kills our CSS transition. To get around this, we generate a dynamic height value based on the length of the array. */}
            <div
              style={{ display: this.state.noresults ? '' : 'none' }}
              className="noresults"
            >
              There is no GIF for that. Please try for new GIF.
            </div>
            <ul
              className="gif-options"
              style={{ height: this.state.gifs.previews.length * 15 + 'rem' }}
            >
              {gifOptions}
              <button 
              className='get-gifs-btn' 
              // Do not display the button if:
              // - There are fewer than 10 results for your search, or
              // - You've run out of additional search results
              style={{ 
                display: (this.state.gifs.previews.length < 10) ? 'none' : (this.state.gifs.previews.length > 10 && this.state.next === '0') ? 'none' : ''}}
              onClick={this.getGifs}
              >MORE GIFS!</button>
            </ul>
          </form>
        </main>
      </div>
    );
  };
};
