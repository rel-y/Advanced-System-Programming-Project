import React from 'react';

function Element({ label, type, updateFunc, errorMessage}) {
  return (
    <div className="form-floating mb-3">
      <input id={label} type={type} className="form-control" placeholder={label} onChange={e => updateFunc(e)}></input>
      <label htmlFor={label}>{label}</label>
      <div className="Error">
        {errorMessage}
      </div>
    </div>
  );
}

export default Element;
