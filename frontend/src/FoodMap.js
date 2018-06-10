import React, { Component } from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';

const GoogleMapsWrapper = withScriptjs(withGoogleMap(props => {
  const {onMapMounted, ...otherProps} = props;
  return <div>
    <GoogleMap {...otherProps} ref={c => {
      onMapMounted && onMapMounted(c)
      }}>
    </GoogleMap>
  </div>
}));

class FoodMap extends Component {
  constructor() {
    super();

    this.state = {
      matchFound: false,
      myMarker: {},
      markers: []
    }

    this.changeLocation = this.changeLocation.bind(this);
  }

  changeLocation(e) {
    let location = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    }
    this.setState({ myMarker: location });
  }
  
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapsWrapper
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{height: `100%`}}/>}
          containerElement={<div style={{height: `100%`}}/>}
          mapElement={<div style={{height: `100%`}}/>}
          defaultZoom={13}
          centre={{lat: 47, lng: -85}}
          defaultCenter={{lat: 43.464, lng: -80.520}}
          onClick={this.changeLocation}>
          <Marker
              key={'myMarker'}
              position={{lat: this.state.myMarker.lat, lng: this.state.myMarker.lng}}
            />
        </GoogleMapsWrapper>
      </div>
    )
  }
}

export default FoodMap