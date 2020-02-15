import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// We are wrapping App in our router in index.js,
// so we need to do it here else the test complains
// about using a route outside a router

it('Renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, div)
  ReactDOM.unmountComponentAtNode(div);
});