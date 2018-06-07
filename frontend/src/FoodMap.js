import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const CustomMarker = ({ text }) => <div>{text}</div>;

class FoodMap extends Component {
  static defaultProps = {
    center: {lat: 43.464, lng: -80.520},
    zoom: 13,
  };
  
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <CustomMarker
            lat={43.464}
            lng={-80.520}
            text={'Some Place!'}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default FoodMap;