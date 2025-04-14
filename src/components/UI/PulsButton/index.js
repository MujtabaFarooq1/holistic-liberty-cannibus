import React from 'react';
import "./PulsButton.scss"


class PulsButton extends React.Component {
    state = {
        x: 0,
        y: 0,
        displayFollower: false
    }

    checkPosition = (e) => {
        var el = e.target.className;
        // console.log(el);
        this.setState({
            x: e.pageX,
            y: e.pageY,
            displayFollower: true
        })
    }

    // setbuttonOffset = (e) => {
        
    // }

    hide = (e) => {
        this.setState({
            x: e.pageX,
            y: e.pageY,
            displayFollower: false
        })
    }
    
    render(){
        // console.log(this.state);
        const style = {
            // top:this.state.y,
            // left:this.state.x
        }

        return (
            <div className="puls-wrap" onMouseMove={this.checkPosition} onMouseLeave={this.hide}>
                <button>
                    Button
                </button>
                {this.state.displayFollower?<div className="follower-pulse"style={style}>                
                </div>:null}
            </div>
        )
    }
}

export default PulsButton