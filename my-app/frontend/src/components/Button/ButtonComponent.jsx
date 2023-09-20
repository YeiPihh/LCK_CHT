import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ text }) => {
  return (
    <button className="custom-button">
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Button;