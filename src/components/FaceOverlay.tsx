import React from 'react';

interface FaceOverlayProps {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  age: number | undefined;
  gender: string | undefined;
}

const FaceOverlay: React.FC<FaceOverlayProps> = ({ boundingBox, age, gender }) => {
  const { x, y, width, height } = boundingBox;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: y-20,
          left: x-20,
          width: width,
          height: height,
          border: '2px solid red',
          color: 'red',
          pointerEvents: 'none',
        }}
      >
        <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px', fontSize: '12px' }}>
          Age: {age}, Gender: {gender}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: y + height -20,
          left: x,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          padding: '2px',
          fontSize: '12px',
          pointerEvents: 'none',
        }}
      >
        Size: {Math.round(width)}x{Math.round(height)}px
        <br />
        Position: {x}, {y}
      </div>
    </>
  );
};

export default FaceOverlay;
