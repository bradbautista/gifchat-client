import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import config from '../../config'
import NavButton from './NavButton'

export default class Home extends Component {

  // It'll arise naturally but think about what state we might need to track on this page if any; may just come in the form of context provision

  constructor(props) {
    super(props);
    this.state = {
      destination: '',
      createdRoom: '',
      lonelyRandos: false,
    };

  }

  getRoom = () => {

    console.log('getRoom fired')

    // >> user clicks "Get a room"

    // Send a POST request to the server (/ or /rooms/ or /requestRoom)
    // server should create a room at a URL and respond with that URL
    // 
    
    const endpoint = config.GIFCHAT_API_ENDPOINT
    const url = `${endpoint}/rooms`
    const options = {
      method: 'POST',
      body: '',
      headers: {
        'content-type': 'application/json',
      }
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

          console.log(responseJson)
          console.log(responseJson[0])

          this.setState({
            createdRoom: responseJson[0]
          })
          
        })
        .catch(error => { console.error(error) })

  }

  handleChange = (e) => {
    
    this.setState({destination: e.target.value});
  
  }

  render() {

    return (
        <>
        <header>
          <h1>GifChat</h1>
        </header>
        
        <main>
            <section>

                {/* Ultimately we want a function invocation on button click,
                and a different one for each button. So let's walk through
                what everything needs to do:
                
                When "Get a room" is clicked, a link is generated by the server,
                it will requestRoom() -- send a POST request to the server to generate a new room

                Copy to clipboard?
                
                
                */}

              {/* GET ROOM */}

              <NavButton
                onClick={this.getRoom}
                frontCardContent="Get a room" 
                backCardContent={

                  // Feels hacky, but: Combining strings ('Room created at...', etc.) and Link object caused a lot of [Object object], so instead we need to do it in HTML. Because we need to do it in HTML, we need to return only one element instead of three (span, link, span).

                  <>
                    <span>Room created at </span>
                      <Link 
                        to={`/rooms/${this.state.createdRoom}`}
                        className='room-link'
                      >
                        {this.state.createdRoom}.
                        
                      </Link>
                    <span> Link copied to clipboard!</span>
                  </>

                }
              />

              {/* GO TO ROOM */}

              <NavButton 
                frontCardContent='Go to room'
                backCardContent={
                  <div className='home-input-flex-wrapper'>
                    <input 
                      className='destination-field' 
                      value={this.state.destination} 
                      onChange={this.handleChange} 
                      type="text" placeholder="Enter URL"/>
                    <button className='go-button'
                      onClick={() => {console.log('Yo')}}
                    >Go</button>
                  </div>
                }

              />

              {/* GET A RANDO */}
                <NavButton 
                  onClick={() => {this.props.history.push('/randos/')}}
                  frontCardContent='Get a rando'
                  backCardContent=''
                />
        

              {/* HOW TO // Should this be a component? */}
              <h2>Here's how this works</h2>
              <ul>
                  <li><strong>No logins.</strong> GifChat does not want your email address.</li>
                  <li><strong>No names.</strong> GifChat does not care who you are.</li>
                  <li><strong>Two to a room.</strong></li>
                  <li><strong>GIFs only.</strong></li>
                  <li><strong>Conversations last while they're active.</strong> Your room URL is your link to that conversation. If conversations go inactive for seven days, they disappear and the room is closed.</li>
              </ul>
           
            </section>


                


        </main>

        <footer>
          {/* We'll also need to import FontAwesome icons or just use text links */}
          <a href="meongithub">FA GH</a> <a href="meonlinkedin">FA LI</a>
        </footer>

        </>
    );
  }  
}
