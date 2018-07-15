import React, { Component } from 'react';
import { Marker, InfoWindow } from 'react-google-maps';

class CustomMarker extends Component {
    
    constructor() {
        super()

        this.toggleInfo = this.toggleInfo.bind(this)
    }

    state = {
        showInfo: false
    }

    toggleInfo() {
        this.setState({ showInfo: !this.state.showInfo })
    }


    render() {
        return (
            <Marker
                showInfo={false}
                position={this.props.match.coord}
                onClick={this.toggleInfo}
              >
                {this.state.showInfo && (<InfoWindow onClick={this.toggleInfo}>  
                <div>
                    <h4>{this.props.match.name}</h4>
                    <p>{this.props.match.friend}</p>
                    <p>{this.props.match.phone}</p>
                </div>
                </InfoWindow>)}
            </Marker>
        );
    } 

};

export default CustomMarker