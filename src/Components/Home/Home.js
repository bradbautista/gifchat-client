import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import config from '../../config';
import NavButton from './NavButton';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      destination: '',
      createdRoom: ''
    };
  }

  // This sends a POST request to the server; the server creates
  // a room and sends the URL back to the client for display

  getRoom = () => {
    const endpoint = config.GIFCHAT_API_ENDPOINT;
    const url = `${endpoint}rooms/`;
    const options = {
      method: 'POST',
      body: '',
      headers: {
        'content-type': 'application/json'
      }
    };

    return fetch(url, options)
      .then(res => {
        return res.json();
      })
      .then(responseJson => {
        this.setState({
          createdRoom: responseJson[0]
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  // This sends a post request to the server; if there are no randos
  // waiting for a connection, it creates a room and puts the user
  // in the room. If there are lonely randos, it connects the user
  // with the rando

  searchForRandos = () => {
    const endpoint = config.GIFCHAT_API_ENDPOINT;
    const url = `${endpoint}randos/`;
    const options = {
      method: 'POST',
      body: '',
      headers: {
        'content-type': 'application/json'
      }
    };

    return fetch(url, options)
      .then(res => {
        return res.url;
      })
      .then(url => {
        const roomName = url.split('/').pop();
        this.openInNewTab(`/randos/${roomName}`);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Necessitated by passing of this.props.onClick in NavButton component
  satisfyReact = () => {};

  openInNewTab = url => {
    var win = window.open(url, '_blank');
    win.focus();
  };

  handleChange = e => {
    this.setState({
      destination: e.target.value
    });
  };

  render() {
    return (
      <>
        <header>
          <h1> GifChat </h1>
        </header>

        <main>
          <section>
            {/* GET ROOM */}

            <NavButton
              onClick={this.getRoom}
              frontCardContent="Get a room"
              backCardContent={
                <>
                  <span>Room created at </span>
                  <Link
                    to={`/rooms/${this.state.createdRoom}`}
                    className="room-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.state.createdRoom}.
                  </Link>
                </>
              }
            />

            {/* GO TO ROOM */}

            <NavButton
              // This is dumb but it works. So, NavButton is passing this.props.onClick and this.toggleSwap onClick, so React gets mad if there's not an onClick function assigned. But because of the fact that we're passing two functions and that requires a semicolon to work, JSX gets mad if we try to conditionally pass the onClick props based on this.props.frontCardContent. Thus, we pass this onClick an empty function and the program is happy.
              onClick={() => this.satisfyReact()}
              frontCardContent="Go to room"
              backCardContent={
                <>
                  <span className="input-prompt">
                    Enter room name, i.e. a-big-red-dog-named-Clifford
                  </span>
                  <div className="home-input-flex-wrapper">
                    <input
                      className="destination-field"
                      value={this.state.destination}
                      onChange={this.handleChange}
                      type="text"
                      placeholder="a-big-red-dog-named-Clifford"
                    />
                    <button
                      className="go-button"
                      onClick={() => {
                        this.openInNewTab(`rooms/${this.state.destination}`);
                      }}
                    >
                      Go
                    </button>
                  </div>
                </>
              }
            />

            {/* GET A RANDO */}
            <NavButton
              onClick={() => {
                this.searchForRandos();
              }}
              frontCardContent="Get a rando"
              backCardContent="Searching for randos. If none are found, you will be put in a room to wait until one comes along."
            />

            {/* HOW TO */}
            <h2>Here's how this works</h2>
            <ul>
              <li>
                <strong>No logins.</strong> GifChat does not want your email
                address.
              </li>
              <li>
                <strong>No names.</strong> GifChat does not care who you are.
              </li>
              <li>
                <strong>Two to a room.</strong>
              </li>
              <li>
                <strong>GIFs only.</strong>
              </li>
              <li>
                <strong> Conversations last while they're active.</strong> Your
                room URL is your link to that conversation. If conversations go
                inactive for seven days, they disappear and the room is closed.
              </li>
            </ul>
          </section>
        </main>

        <footer>
          {' '}
          {/* We'll also need to import FontAwesome icons or just use text links */}
          <a href="https://github.com/bradbautista/">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/bradford-bautista/">
            {' '}
            <i class="fab fa-linkedin-in"></i>
          </a>
        </footer>
      </>
    );
  }
}
