import React from 'react';
import './option.css';

const Option = ({ selected, disabled, onClick, children }) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className='option'
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-pressed={selected}
      style={{
        background: selected ? '#e6f0ff' : 'black',
        color: disabled ? '#aaa' : '#222',
        userSelect: 'none',
        fontWeight: selected ? 'bold' : 'normal',
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </div>
  );
};

export default Option; 