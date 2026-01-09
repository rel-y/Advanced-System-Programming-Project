import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signing-up-component.css'
import Element from "./Element"
function SigningUpComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secPassword, setSecPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [photo, setPhoto] = useState('');
  const navigator = useNavigate();


  const updateUsername = (newUserName) => {
    setUsername(newUserName)
  }
  const updatePassword = (newPassword) => {
    setPassword(newPassword);
  }
  const updateSecPassword = (newPassword) => {
    setSecPassword(newPassword);
  }
  const updateNickname = (newNickname) => {
    setNickname(newNickname);
  }
  const updateImage = (newPhoto) => {
    setPhoto(newPhoto);
  }
  const onSubmit = (e) => {
    //controlling password matches secPassword
    // if (this.state.secPassword !== this.state.password) {

    // }

    // console.log(JSON.stringify(this.state))
    let data = { username: username, password: password, nickname: nickname, photo: photo };
    fetch('http://localhost:8080/api/users', {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          navigator('/api/users/login');
        } else {
          alert('Issues saving');
        }
      });

  }


  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="border p-4 rounded box-sizes">
        <form className="form-style ms-auto needs-validation" onSubmit={e => {
          e.preventDefault(); // stop the default submit

          const form = e.target;
          let invalid = false;
          if (!form.checkValidity()) {
            form.classList.add('was-validated');
            invalid = true;
          }
          if (password !== secPassword) {
            
          }
          if (invalid) {
            //there is a problem in the input
            return;
          }
          onSubmit(e);
        }} noValidate>
          <Element label="Username" type="text" updateFunc={e => updateUsername(e.target.value)} />
          <Element label="Password" type="password" updateFunc={e => updatePassword(e.target.value)} />
          <Element label="verify Password" type="password" updateFunc={e => updateSecPassword(e.target.value)} />
          <Element label="Nickname" type="text" updateFunc={e => updateNickname(e.target.value)} />

          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input type="file" accept="image/*" className="form-control" onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateImage(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }} required></input>
            <div className="invalid-feedback">
              this field is required.
            </div>
          </div>
          <button type="submit" className="btn btn-primary rounded-pill align-self-left">Sign In</button>
        </form>
      </div >
    </div >
  );

}
export default SigningUpComponent;