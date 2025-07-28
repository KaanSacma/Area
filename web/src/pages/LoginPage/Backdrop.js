import React from 'react';

const Backdrop = ({ onClick }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={onClick}
    ></div>
  );
};

export default Backdrop;
