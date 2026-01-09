import React from 'react';

function Element({ label, type, updateFunc }) {
  return (
    <div className="form-floating mb-3">
      <input id={label} type={type} className="form-control" placeholder={label} onChange={e => updateFunc(e)} required></input>
      <label htmlFor={label}>{label}</label>
      <div className="invalid-feedback">
        this field is required.
      </div>
    </div>
  );
}

export default Element;
