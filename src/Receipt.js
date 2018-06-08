import React, { Component } from 'react';
import './App.css';
import App from './App';
import Login from './Login';
import Moment from 'react-moment';
import ReactModal from 'react-modal';
class Receipt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      status:this.props.status_id
    }
    this.toggleModal = this.toggleModal.bind(this);
    this._approved = this._approved.bind(this);
    this._denied = this._denied.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    })
    console.log(this.state)
  }

  _updateServer(receipt_id, status_id) {
    fetch('/users/receipt/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receipt_id: receipt_id,
        status_id: status_id,
      }),
    }).catch((err) => {
      alert("can't update status", err);
    });


  }


  _approved(){
    console.log("************my receipt id************",this.props.id)
    this.setState({status : 2})
    this._updateServer(this.props.id, 2)
  }

  _denied(){
    console.log("**********my receipt id*************",this.props.id)
    this.setState({status : 3})
    this._updateServer(this.props.id, 3)
  }

  render() {
    console.log(this.props)

    function statusCheck (status) {
      if (status === 1) {
        return <i className="fas fa-ellipsis-h mdc-list-item__graphic orange text-warning"></i>
      } else if (status === 2) {
        return <i className="fas fa-check-circle mdc-list-item__graphic text-success"></i>
      } else if (status === 3) {
        return <i className="fas fa-exclamation-triangle mdc-list-item__graphic text-danger"></i>
      }
    };
    let statusWord = {
      1:"Pending",
      2:"Approved",
      3:"Denied"
    }

    const { id, date, location, description, total, image_url, status_id} = this.props;

    return (
      <li className="mdc-list-item mdc-ripple-surface" key = {id} onClick={ this.toggleModal }>
        {statusCheck(this.state.status)}
        <span className="mdc-list-item__text" >
          <Moment format="DD/MM/YYYY">{date}</Moment>
            <span className="mdc-list-item__secondary-text">
              {location} - {description}
            </span>
          </span>
        <span className="mdc-list-item__meta">
          ${parseFloat(total/100).toFixed(2)}
        </span>
         <ReactModal
          className="modal flex-element"
          isOpen={this.state.isModalOpen}
          contentLabel="Modal"
          >
          <div className="modal-list">
            <h2 className="list-align">Details</h2>
            <ul className="mdc-list">
              <li className="mdc-list-item">Purchased date: <Moment format="DD/MM/YYYY">{date}</Moment></li>
              <li className="mdc-list-item">Location: {location}</li>
              <li className="mdc-list-item">Description: {description}</li>
              <li className="mdc-list-item">Amount: ${parseFloat(total/100).toFixed(2)}</li>
              <li className="mdc-list-item">Status: {statusWord[status_id]}</li>
              <li className="mdc-list-item">
              
              <i className="fas fa-check-circle  text-success" onClick={this._approved}></i>
              <i className="fas fa-exclamation-triangle  text-danger" onClick={this._denied}></i>
              </li>
            </ul>
            <button className="mdc-button mdc-button--raised list-align" onClick={this.toggleModal}>Close</button>
          </div>
          <div className="modal-pic">
            <img src={image_url} alt="demo" className="receipt-pic"/>
          </div>
        </ReactModal>
      </li>
    )
  }
}
export default Receipt;