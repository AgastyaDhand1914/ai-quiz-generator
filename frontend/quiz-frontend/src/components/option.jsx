import React from 'react';
import './option.css';

const Option = ({ selected, disabled, onClick, children, isCorrect, submitted }) => {
  const getBorderStyle = () => {
    if (!submitted) return {};
    
    if (isCorrect) {
      return { border: '4px solid green' };
    } else if (selected && !isCorrect) {
      return { border: '4px solid red' };
    }
    
    return {};
  };

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
        ...getBorderStyle()
      }}
    >
      {children}
    </div>
  );
};

export default Option; 