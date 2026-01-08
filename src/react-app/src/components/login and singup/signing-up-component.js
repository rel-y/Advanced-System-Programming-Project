import React from 'react';
import { useNavigate } from 'react-router-dom';
import './signing-up-component.css'
import Element from "./Element"
export class SigningUpComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      nickname: '',
      photo: ''
    };
  }
  
  updateImage = (newPhoto) => {
    this.setState((prevState) => ({ photo: newPhoto }))
  }
  updateUsername = (newUserName) => {
    this.setState((prevState) => ({ username: newUserName }))
    console.log(this.state.username);
    console.log("new: " + newUserName);
  }
  updatePassword = (newPassword) => {
    this.setState((prevState) => ({ password: newPassword }))
    console.log(this.state.password);
    console.log("new: " + newPassword);
  }
  updateNickname = (newNickname) => {
    this.setState((prevState) => ({ nickname: newNickname }))
    console.log(this.state.nickname);
    console.log("new: " + newNickname);
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
            <Element label="Nickname" type="text" updateFunc={e => this.updateNickname(e.target.value)} />

            <div className="mb-3">
              <label className="form-label">profile picture</label>
              <input type="file" accept="image/*" className="form-control" onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    this.updateImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}></input>
            </div>
            <button type="submit" class="btn btn-primary rounded-pill">Sign In</button>
          </form>
        </div >
      </div >
    );
  }
}

export default SigningUpComponent;