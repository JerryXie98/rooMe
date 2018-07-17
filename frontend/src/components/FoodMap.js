import React, { Component } from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import CustomMarker from './CustomMarker'

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
  
  state = {
    matchFound: false,
    myMarker: {
      lat: 43.464,
      lng: -80.520
    },
    markers: []
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
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{height: `100%`}}/>}
          containerElement={<div style={{height: `100%`}}/>}
          mapElement={<div style={{height: `100%`}}/>}
          defaultZoom={13}
          defaultCentre={{lat: 47, lng: -85}}
          center={{lat: this.props.myLocation.lat, lng: this.props.myLocation.lng}}
          onClick={(e) => this.changeLocation(e)}>
          <Marker
              key={'myMarker'}
              position={{lat: this.state.myMarker.lat, lng: this.state.myMarker.lng}} 
          >
          </Marker>
          {this.props.matches.map((m)=> {
            return (
              <CustomMarker match={m} key={m.name}>
              </CustomMarker>
            )
          })}
        </GoogleMapsWrapper>
      </div>
    );
  }
}

export default FoodMap