import React from 'react';
import ReactDOM from 'react-dom';
import NavButton from './NavButton';
import renderer from 'react-test-renderer';
import { Link } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NavButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Renders the "Get a room" button as expected', () => {
    const someRoom = 'a-big-red-dog-named-Clifford'
    const tree = renderer
        .create(
            <BrowserRouter>
            <NavButton 
                frontCardContent="Get a room" 
                backCardContent={
                    <>
                        <span>Room created at </span>
                        <Link
                            to={`/rooms/${someRoom}`}
                            className="room-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {someRoom}.
                        </Link>
                    </>
                }
            />
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})

it('Renders the "Go to room" button as expected', () => {
    const someFunc = () => {};
    const someRoom = 'a-big-red-dog-named-Clifford';
    const tree = renderer
        .create(
            <BrowserRouter>
            <NavButton
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
                      value={someRoom}
                      onChange={someFunc}
                      type="text"
                      placeholder="a-big-red-dog-named-Clifford"
                    />
                    <button
                      className="go-button"
                      onClick={() => {
                        this.openInNewTab(`rooms/${someRoom}`);
                      }}
                    >
                      Go
                    </button>
                  </div>
                </>
              }
            />
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})

it('Renders the "Get a rando" button as expected', () => {
    const someFunc = () => {};
    const tree = renderer
        .create(
            <BrowserRouter>
            <NavButton
              onClick={() => {
                someFunc;
              }}
              frontCardContent="Get a rando"
              backCardContent="Searching for randos. If none are found, you will be put in a room to wait until one comes along."
            />
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})