import React from 'react'
import Aux from './Aux'

const Input = ({ name, value, label, placeholder, onChange }) => {
  return (
    <Aux>
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Aux>
  )
}

export default Input
