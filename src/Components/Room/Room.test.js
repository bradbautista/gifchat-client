import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Room from './Room';
import renderer from 'react-test-renderer';

// Router wraps everything in index.js,
// but we need to wrap it here else the test complains
// about not having one

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BrowserRouter><Room /></BrowserRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});


it('Renders the UI expected', () => {
    let error = false;
    const someText = 'A search term'
    const someFunc = () => {};
    const msgs = [
        'https://www.someurl.com/gif.gif', 
        'https://www.someurl.com/gif.gif', 
        'https://www.someurl.com/gif.gif'
    ];
    const gifOptions = [
        'https://www.someurl.com/gif.gif', 
        'https://www.someurl.com/gif.gif', 
        'https://www.someurl.com/gif.gif'
    ];
    const tree = renderer
        .create(
            <BrowserRouter>
                <main className="room">
                    <ul className="messages">
                        <li
                        style={{ display: error ? '' : 'none' }}
                        className="error"
                        >
                        Error: Messages could not be displayed. The room does not exist,
                        is full, or the Internet is broken. Try refreshing, or
                        <a href="https://gifchat.now.sh/" style={{ fontWeight: 700 }}>
                            {' '}
                            leave this place.
                        </a>
                        </li>
                        <li
                        style={{ display: (msgs.length === 0 && error === false) ? '' : 'none' }}
                        className="messages-prompt"
                        >
                        Messages will appear here! Search and click on a GIF to start your conversation!
                        </li>
                            {msgs.reverse()}
                    </ul>

                    <form onSubmit={someFunc}>
                        <div className="room-input-flex-wrapper">
                            <input
                                type="text"
                                value={someText}
                                onChange={someFunc}
                                id="m"
                                autoComplete="off"
                                placeholder="Enter search term"
                                // onFocus={this.preventScroll}
                            />
                            {/* This gives mobile users the option to dismiss their GIF search and minimize gifOptions if they decide they don't want to send a GIF. Three is an arbitrary number; it just needs to represent enough GIFs to create a scrolling container */}
                            {(gifOptions.length > 3 && someText.length === 0)
                                ? <button onClick={someFunc}><i class="fas fa-times"></i></button> 
                                : <button>Search</button> 
                        }
                        
                        </div>

                        <img
                        alt=""
                        className="tenor-attr"
                        src="https://www.gstatic.com/tenor/web/attribution/PB_tenor_logo_blue_horizontal.png"
                        />

                        {/* React wants to re-render the form component every time the array (and thus height) changes, which kills our CSS transition. To get around this, we generate a dynamic height value based on the length of the array. */}
                        <div
                        style={{ display: error ? '' : 'none' }}
                        className="noresults"
                        >
                        There is no GIF for that. Please try for new GIF.
                        </div>
                        <ul
                        className="gif-options"
                        style={{ height: gifOptions.length * 15 + 'rem' }}
                        >
                        {gifOptions}
                            <button 
                            className='get-gifs-btn' 
                            // Do not display the button if:
                            // - There are fewer than 10 results for your search, or
                            // - You've run out of additional search results
                            style={{ 
                                display: (gifOptions.length < 10) ? 'none' : (gifOptions.length > 10 && someText.length === '0') ? 'none' : ''}}
                            onClick={someFunc}
                            >MORE GIFS!</button>
                        </ul>
                    </form>
                    <section className="desktop-extras">
                        <h3 className="conversation-length__header">Messages<br/>in this conversation</h3>
                        <span className="messages-length">{msgs.length}</span>
                        <hr align="left"/>
                        <h3 className="status__header">Connection<br/>status</h3>
                        <span className="online-status">
                        {(error)
                            ? 'Very online'
                            : 'Very offline'
                        }
                        </span>
                        <hr align="left"/>
                        <h3 className="last-search__header">You last<br/>searched for:</h3>
                        <span className="last-search">
                        {(someText === '')
                            ? `GifChat can't remember what you last searched for :(`
                            : someText
                        }
                        </span>
                    </section>
                </main>
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})