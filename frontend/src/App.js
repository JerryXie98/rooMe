import React, { Component } from 'react';
import './App.css';
import FoodMap from './FoodMap';
import axios from 'axios';
import { Button, Modal, ControlLabel, FormControl, InputGroup } from 'react-bootstrap';

class App extends Component {
  
  state = {
    showModal: false,

    name: '',
    phone: '',
    address: '',
    street: '',
    city: '',
    foodTypes: [],
    distance: '',
    lat: '',
    lng: '',

    matches: []
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  requestSubmit() {
    axios.get('https://roome.lib.id/rooMe@dev/main/test_request/?', {
      params: {
        name: this.state.name,
        address: this.state.street + " " + this.state.city,
        phoneNo: this.state.phone,
        type: this.state.foodTypes.join(),
        distAway: 1000
      }
    })
      .then(res => {
        this.setState({ matches: res.data.list_of_locations })
        this.closeModal();
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        console.log(this.state.foodTypes);
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>FeedMe</h1>
          <Button bsSize="large" onClick={() => this.openModal()}>Get food!</Button>
          <Modal show={this.state.showModal} onHide={() => this.closeModal()}>
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
        <FoodMap matches={this.state.matches}></FoodMap>
      </div>
    )
  }
}

export default App
