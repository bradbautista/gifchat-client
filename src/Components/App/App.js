import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Home from '../Home/Home'
import Room from '../Room/Room'
import './App.css'

export default class App extends Component {

  // It'll arise naturally but think about what state we might need to track on this page if any; may just come in the form of context provision

  constructor(props) {
    super(props);
    this.state = {
      somestate: '',
    };

  }

  render() {

    return (
        <div className="App">
          <Route exact path={'/'} component={Home}/>
          <Route path={['/rooms/', '/randos/']} component={Room}/>
        </div>
    );
  }  
}
