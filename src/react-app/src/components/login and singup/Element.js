import React from 'react';

function Element({label, type, updateFunc}) {
    return (
        <div className="form-floating mb-3">
          <input id={label} type={type} className="form-control" placeholder={label} onChange={e => updateFunc(e)}></input>
          <label for={label}>{label}</label>
        </div>
    );
}

export default Element;
