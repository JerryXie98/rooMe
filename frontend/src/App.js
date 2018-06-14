import React, { Component } from 'react';
import './App.css';
import FoodMap from './FoodMap';
import axios from 'axios';
import { Button, Modal, ControlLabel, FormControl, InputGroup } from 'react-bootstrap';

class App extends Component {
  constructor() {
    super();

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.requestSubmit = this.requestSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMultiSelect = this.handleMultiSelect.bind(this);
  }

  state = {
    showModal: false,

    name: '',
    phone: '',
    address: '',
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
        name: 'Joe',
        address: '123 Columbia St W Waterloo',
        phoneNo: '5551234567',
        type: 'bar',
        distAway: 1000
      }
    })
      .then(res => {
        // const match = res.data[0]
        this.setState({ matches: res.data.list_of_locations })
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
    let types = this.state.foodTypes.concat(e.target.value);
    this.setState({ foodTypes: types });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>FeedMe</h1>
          <Button bsSize="large" onClick={this.openModal}>Get food!</Button>
          <Modal show={this.state.showModal} onHide={this.closeModal}>
            <Modal.Header>
              <Modal.Title>Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <ControlLabel>What's your name?</ControlLabel>
                <FormControl type="text" id="name" value={this.state.name} onChange={this.handleChange}/>
                <br/>
                <ControlLabel>What number can we reach you at?</ControlLabel>
                <FormControl type="number" id="phone" value={this.state.phone} placeholder="5551234567" onChange={this.handleChange}/>
                <br/>
                <ControlLabel>What type of place are you looking for?</ControlLabel>
                <FormControl componentClass="select" id="foodType" onChange={this.handleMultiSelect} multiple>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                  <option value="bar">Bar</option>
                  <option value="other">...</option>
                </FormControl>
                <br/>
                <ControlLabel>Where are you now?</ControlLabel>
                <FormControl type="text" value={this.state.temp} placeholder="330 Phillips St"/>
                <FormControl type="text" value={this.state.temp} placeholder="Ontario, Canada"/>
                <FormControl type="text" value={this.state.temp} placeholder="N2L3G9"/>
                <br/>
                <ControlLabel>How far are you willing to travel? (in metres)</ControlLabel>
                <InputGroup>
                  <FormControl type="number" id="distance" value={this.state.distance} placeholder="1000" onChange={this.handleChange}/>
                  <InputGroup.Addon>m</InputGroup.Addon>
                </InputGroup>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" onClick={this.requestSubmit}>Submit</Button>
              <Button onClick={this.closeModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </header>
        <FoodMap matches={this.state.matches}></FoodMap>
      </div>
    )
  }
}

export default App
