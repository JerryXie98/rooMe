import React, { Component } from 'react';
import './App.css';
import FoodMap from './FoodMap';
import Modal from 'react-modal';

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">FeedMe</h1>
          <button onClick={this.openModal}>I want food!</button>
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
            </form>
          </Modal>
        </header>
        <FoodMap></FoodMap>
      </div>
    );
  }
}

export default App;
