import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const CustomMarker = ({ text }) => (
  <div style={{
    color: 'white', 
    background: 'blue',
    padding: '15px 10px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    {text}
  </div>
);

class FoodMap extends Component {
  constructor() {
    super();

    this.state = {
      matchFound: false
    }
  }

  static defaultProps = {
    center: {lat: 43.464, lng: -80.520},
    zoom: 13,
  }
  
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          { this.props.match.found ? 
            <CustomMarker
              lat={43.464}
              lng={-80.520}
              text={this.props.match.name}
            /> : null}
        </GoogleMapReact>
      </div>
    )
  }
}

export default FoodMap