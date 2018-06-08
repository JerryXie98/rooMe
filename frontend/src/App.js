import React, { Component } from 'react';
import './App.css';
import FoodMap from './FoodMap';
import Modal from 'react-modal';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.requestSubmit = this.requestSubmit.bind(this);
  }

  state = {
    modalIsOpen: false,
    match: {
      name: '',
      phone: -1,
      found: false
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  requestSubmit() {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(res => {
        const match = res.data[0]
        this.setState({ 
          match: {
            name: match.name,
            phone: match.phone,
            found: true
          } 
        });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">FeedMe</h1>
          <button onClick={this.requestSubmit}>I want food!</button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            className="Modal-style">
            <form
              className="Form-style">
                <label>
                    Name:<br/><input type="text" />
                </label>
                <input type="submit" value="Submit" />
                <button onClick={this.requestSubmit}></button>
            </form>
          </Modal>
        </header>
        <FoodMap match={this.state.match}></FoodMap>
      </div>
    )
  }
}

export default App
