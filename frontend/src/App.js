import React, { Component } from 'react';
import './App.css';
import FoodMap from './components/FoodMap';
import axios from 'axios';
import { Button, Modal, ControlLabel, FormControl, InputGroup } from 'react-bootstrap';

class App extends Component {
  
  state = {
    showModal: false,

    // Request Parameters
    name: '',
    phone: '',
    address: '',
    street: '',
    city: '',
    foodTypes: ['Restaurant'],
    distance: '',
    lat: '',
    lng: '',

    matches: [],
    myLocation: {
      lat: 43.464,
      lng: -80.520
    }
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  requestSubmit() {
    const url = 'https://roome.lib.id/rooMe@dev/api/'
    axios.get(url + 'geo_code/?address=' + this.state.street + " " + this.state.city)
      .then(res => {
        if (res) {
          this.setState({ myLocation: res.data})
        }
      })
      .catch(err => {
        console.log(err)
      })

    // main request
    axios.get(url + 'request/?', {
      params: {
        name: this.state.name,
        address: this.state.street + " " + this.state.city,
        phoneNo: this.state.phone,
        type: this.state.foodTypes.join(),
        distAway: 1000
      }
    })
      .then(res => {
        // Check if request can be matched, otherwise make new request
        if (res.data.list_of_locations.length > 0) {
          this.setState({ matches: res.data.list_of_locations })
        } else {
          alert('No matches found, would you like to submit a request?')
        }

        this.closeModal();
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleMultiSelect(e) {
    if (e.target.value in this.state.foodTypes) {
      return
    } else {
      let types = this.state.foodTypes.concat(e.target.value);
      this.setState({ foodTypes: types });
    }
  }

  // Filling forms with fake data for easier testing
  handleTestInputs() {
    const testData = {
      name: 'John Smith',
      phone: 555123456,
      foodTypes: ['Restaurant'],
      street: '330 Phillips St',
      city: 'Waterloo',
      distance: '1000'
    }
    this.setState({ name: testData.name})
    this.setState({ phone: testData.phone})
    this.setState({ foodTypes: testData.foodTypes})
    this.setState({ street: testData.street})
    this.setState({ city: testData.city })
    this.setState({ distance: testData.distance })
  } 

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>FeedMe</h1>
          <Button bsSize="large" onClick={() => this.openModal()}>Get food!</Button>
          <Modal show={this.state.showModal} onHide={() => this.closeModal()}>
            <Button bsStyle="info" className="test-input" onClick={() => this.handleTestInputs()}>Test Inputs</Button>
            <Modal.Header>
              <Modal.Title>Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <ControlLabel>What's your name?</ControlLabel>
                <FormControl type="text" id="name" value={this.state.name} onChange={(e) => this.handleChange(e)}/>
                <br/>
                <ControlLabel>What number can we reach you at?</ControlLabel>
                <FormControl type="number" id="phone" value={this.state.phone} placeholder="5551234567" onChange={(e) => this.handleChange(e)}/>
                <br/>
                <ControlLabel>What type of place are you looking for?</ControlLabel>
                <FormControl componentClass="select" id="type" onChange={(e) => this.handleMultiSelect(e)} multiple>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                  <option value="bar">Bar</option>
                  <option value="other">...</option>
                </FormControl>
                <br/>
                <ControlLabel>Where are you now?</ControlLabel>
                <FormControl type="text" id="street" value={this.state.street} placeholder="330 Phillips St" onChange={(e) => this.handleChange(e)}/>
                <FormControl type="text" id="city" value={this.state.city} placeholder="Waterloo" onChange={(e) => this.handleChange(e)}/>
                <br/>
                <ControlLabel>How far are you willing to travel? (in metres)</ControlLabel>
                <InputGroup>
                  <FormControl type="number" id="distance" value={this.state.distance} placeholder="1000" onChange={(e) => this.handleChange(e)}/>
                  <InputGroup.Addon>m</InputGroup.Addon>
                </InputGroup>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" onClick={() => this.requestSubmit()}>Submit</Button>
              <Button onClick={() => this.closeModal()}>Close</Button>
            </Modal.Footer>
          </Modal>
        </header>
        <FoodMap matches={this.state.matches} myLocation={this.state.myLocation}></FoodMap>
      </div>
    )
  }
}

export default App
