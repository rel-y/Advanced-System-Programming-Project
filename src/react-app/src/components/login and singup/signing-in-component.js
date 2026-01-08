import React from 'react';
import { useNavigate } from 'react-router-dom';
import './signing-in-component.css'
import Element from "./Element"
export class LoginInComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      secPassword: '',
    };
  }
  
  updateUsername = (newUserName) => {
    this.setState((prevState) => ({ username: newUserName }))
  }
  updatePassword = (newPassword) => {
    this.setState((prevState) => ({ password: newPassword }))
  }
  updateSecPassword = (newPassword) => {
    this.setState((prevState) => ({ password: newPassword }))
  }
  onSubmit = (e) => {
    const navigator = useNavigate();
    e.preventDefault();
    console.log(JSON.stringify(this.state))
    fetch('http://localhost:8080/api/users', {
      body: JSON.stringify(this.state),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          navigator('/');
        } else {
          alert('Issues saving');
        }
      });
  }

  render() {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="border p-4 rounded d-flex box-sizes">
          <form class="form-style ms-auto" onSubmit={this.onSubmit.bind()}>
            <Element label="Username" type="text" updateFunc={(e) => this.updateUsername(e.target.value)} />
            <Element label="Password" type="password" updateFunc={e => this.updatePassword(e.target.value)} />
            <Element label="verify Password" type="password" updateFunc={e => this.updateSecPassword(e.target.value)} />
          </form>
        </div >
      </div >
    );
  }
}

export default LoginInComponent;