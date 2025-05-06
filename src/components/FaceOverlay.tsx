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
        className="face-overlay-box"
        style={{
          top: y,
          left: x,
          width: width,
          height: height,
        }}
      >
        <div className="face-info-top">
          {age && gender ? `${age} years, ${gender}` : 'Face detected'}
        </div>
      </div>
      <div
        className="face-info-bottom"
        style={{
          top: y + height,
          left: x,
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
