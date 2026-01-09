import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signing-in-component.css'
import Element from "./Element"
function LoginInComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigator = useNavigate();
  const [generalError, setGeneralError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const filedRequired = 'this field is required.'
  const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const updateUsername = (newUserName) => {
    setUsername(newUserName)
  }
  const updatePassword = (newPassword) => {
    setPassword(newPassword);
  }
  //reseting errors
  const resetErrors = () => {
    setGeneralError(null);
    setUsernameError(null);
    setPasswordError(null);
  }
  const onSubmit = (e) => {
    e.preventDefault();
    const data = {username: username, password: password};

    fetch('http://localhost:8080/api/tokens', {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    })
      .then(async (response) => {
        console.log(response);
        if (response.status === 201) { //user was created passing to login'
          const data = await response.json();
          sessionStorage.setItem("jwt", data.token);
          console.log(data.token);
          navigator('/');
        } else { //waiting for the response to tell the user what went wrong
          const errorData = await response.json();
          console.log(errorData);
          setGeneralError(errorData.error || "Unknown error");
        }
      });
  }

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="border p-4 rounded box-sizes">
        <p className="align-self-center fs-2 p-4">
          Login
        </p>
        <form className="form-style ms-auto" onSubmit={e => {
          e.preventDefault(); // stop the default submit
          resetErrors(); //reseting previous errors
          let invalid = false;
          if (!username) {
            setUsernameError(filedRequired);
            invalid = true;
          }

          if (!password) {
            setPasswordError(filedRequired);
            invalid = true;
          } else if (!validPasswordRegex.test(password)) {
            setPasswordError('Password should contain at least 8 characters, one letter and one number')
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
          <button type="submit" className="btn btn-primary rounded-pill align-self-left">login</button>
          <div className="Error">
            {generalError}
          </div>
        </form>
      </div >
    </div >
  );
}

export default LoginInComponent;