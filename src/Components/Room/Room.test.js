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
                <ul className="messages">
                    <div
                    style={{ display: error ? '' : 'none' }}
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

                <form onSubmit={someFunc}>
                    <div className="room-input-flex-wrapper">
                    <input
                        type="text"
                        value={someText}
                        onChange={someFunc}
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
                        display: (msgs.length < 10) ? 'none' : (msgs.length > 10 && msgs.length === '0') ? 'none' : ''}}
                    onClick={someFunc}
                    >MORE GIFS!</button>
                    </ul>
                </form>
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})