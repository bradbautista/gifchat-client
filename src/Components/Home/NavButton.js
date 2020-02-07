import React, { Component } from 'react'
import './NavButton.css'

export default class NavButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      swapped: false,
    };

  }

  toggleSwap = () => {
    const currentState = this.state.swapped;
    this.setState({ swapped: !currentState})
  }

  render() {

    return (        

        <div className="card-container">
            <div 
            onClick={() => {this.props.onClick(); this.toggleSwap()}}
            // onClick={(this.props.frontCardContent == 'Get a rando') ? this.props.onClick : this.toggleSwap} 
            className="card front"
            >
                {this.props.frontCardContent}
            </div>

            <div 
            // onClick={this.toggleSwap} 
            className={'card' + ' ' + 'back' + ' ' + ((this.state.swapped) ? 'swap' : null)}>
                {this.props.backCardContent}
            </div>
        </div>



            
    );
  }  
}
