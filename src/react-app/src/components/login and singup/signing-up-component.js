import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signing-up-component.css'
import Element from "./Element"
function SigningUpComponent() {
  //variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secPassword, setSecPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [photo, setPhoto] = useState('');
  const navigator = useNavigate();
  //variables for error handeling
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [secPasswordError, setSecPasswordError] = useState(null);
  const [nicknameError, setNicknameError] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [generalError, setGeneralError] = useState(null);
  const filedRequired = 'this field is required.'
  const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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
    let data = { username: username, password: password, nickname: nickname, photo: photo };
    fetch('http://localhost:8080/api/users', {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    })
      .then(async (response) => {
        console.log(response);
        if (response.status === 200) { //user was created passing to login
          navigator('/api/users/login');
        } else { //waiting for the response to tell the user what went wrong
          const errorData = await response.json();
          setGeneralError(errorData.error || "Unknown error");
        }
      });

  }
  //reseting errors
  const resetErrors = () => {
    setGeneralError(null);
    setUsernameError(null);
    setPasswordError(null);
    setSecPasswordError(null);
    setNicknameError(null);
    setPhotoError(null);
  }
  function moveToLogin() {
    navigator('/api/users/login');
  }
  return (
    <div className="bg-secondary-subtle vh-100 d-flex justify-content-center align-items-center">
      <div className="bg-white border p-4 rounded-5 box-sizes">
        <div className="align-self-center lex-column">
          <p className="text-start fs-1">
            Signup
          </p>
          <p className="text-start fs-4">
            create a new account
          </p>
          <p className="text-start">
            already have an acount:
            <button onClick={moveToLogin} className="ms-2 btn btn-primary rounded-pill align-self-left">login</button>
          </p>
        </div>
        <form className="form-style ms-auto" onSubmit={e => {
          e.preventDefault(); // stop the default submit
          resetErrors(); //reseting previous errors
          let invalid = false;
          if (!username) {
            setUsernameError(filedRequired);
            invalid = true;
          }
          if (!secPassword) {
            setSecPasswordError(filedRequired);
            invalid = true;
          }
          if (!nickname) {
            setNicknameError(filedRequired);
            invalid = true;
          }
          if (!photo) {
            setPhotoError(filedRequired);
            invalid = true;
          }
          if (!password) {
            setPasswordError(filedRequired);
            invalid = true;
          } else if (!validPasswordRegex.test(password)) {
            setPasswordError('Password should contain at least 8 characters, one letter and one number')
            invalid = true;
          } else if (secPassword && password !== secPassword) {
            setPasswordError('passwords Should Match');
            setSecPasswordError('passwords Should Match');
            invalid = true;
          }
          if (invalid) {
            //there is a problem in the input
            return;
          }
          onSubmit(e);
        }} noValidate>
          <Element label="Username" type="text" errorMessage={usernameError} updateFunc={e => updateUsername(e.target.value)} />
          <Element label="Password" type="password" errorMessage={passwordError} updateFunc={e => updatePassword(e.target.value)} />
          <Element label="verify Password" type="password" errorMessage={secPasswordError} updateFunc={e => updateSecPassword(e.target.value)} />
          <Element label="Nickname" type="text" errorMessage={nicknameError} updateFunc={e => updateNickname(e.target.value)} />

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
            }}></input>
            <div className="Error">
              {photoError}
            </div>
          </div>
          <button type="submit" className="btn btn-primary rounded-pill align-self-left">Sign Up</button>
          <div className="Error">
            {generalError}
          </div>
        </form>
      </div >
    </div >
  );

}
export default SigningUpComponent;