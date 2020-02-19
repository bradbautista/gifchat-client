import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './Home';
import renderer from 'react-test-renderer';
import NavButton from './NavButton';

// Router wraps everything in index.js,
// but we need to wrap it here else the test complains
// about not having one

it('Renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<BrowserRouter><Home /></BrowserRouter>, div)
  ReactDOM.unmountComponentAtNode(div);
});


it('Renders the UI as expected', () => {
    const someFunc = () => {};
    const someStr = 'a-big-red-dog-named-Clifford';
    const tree = renderer
        .create(
            <BrowserRouter>
                <header>
                <h1>GifChat</h1>
                </header>

                <main>
                <section>
                    {/* GET ROOM */}

                    <NavButton
                    onClick={someFunc}
                    frontCardContent="Get a room"
                    backCardContent={
                        <>
                        <span>Room created at </span>
                        <Link
                            to={`/rooms/${someStr}`}
                            className="room-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {someStr}.
                        </Link>
                        </>
                    }
                    />

                    {/* GO TO ROOM */}

                    <NavButton
                    // This is dumb but it works. So, NavButton is passing this.props.onClick and this.toggleSwap onClick, so React gets mad if there's not an onClick function assigned. But because of the fact that we're passing two functions and that requires a semicolon to work, JSX gets mad if we try to conditionally pass the onClick props based on this.props.frontCardContent. Thus, we pass this onClick an empty function and the program is happy.
                    onClick={someFunc}
                    frontCardContent="Go to room"
                    backCardContent={
                        <>
                        <span className="input-prompt">
                            Enter room name, i.e. a-big-red-dog-named-Clifford
                        </span>
                        <div className="home-input-flex-wrapper">
                            <input
                            className="destination-field"
                            value={someStr}
                            onChange={someFunc}
                            type="text"
                            placeholder="a-big-red-dog-named-Clifford"
                            />
                            <button
                            className="go-button"
                            onClick={() => {
                                this.openInNewTab(`rooms/${someStr}`);
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
                        someFunc;
                    }}
                    frontCardContent="Get a rando"
                    backCardContent="Searching for randos. If none are found, you will be put in a room to wait until one comes along."
                    />

                    {/* HOW TO */}
                    <section className="explainer">
                    <h2>Rules of GifChat</h2>
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
                        <strong>Conversations last while they're active.</strong> Your room URL is your link to that conversation. If conversations go inactive for seven days, they disappear and the room is closed.
                        </li>
                        <li>
                        <strong>Why?</strong> <a href="https://github.com/bradbautista/gifchat-client#readme" target="_blank" rel="noopener noreferrer"><strong>Because.</strong></a>
                        </li>
                    </ul>
                    </section>

                </section>
                </main>

                <footer>
                {' '}
                <a href="https://github.com/bradbautista/" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/bradford-bautista/" target="_blank" rel="noopener noreferrer">
                    {' '}
                    <i className="fab fa-linkedin-in"></i>
                </a>
                </footer>
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})