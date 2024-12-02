import React from 'react';

export default function Modal({ images, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close absolute z-[10000000] left-[85%] font-bold text-2xl" onClick={onClose}>Close</button>
        <div className="modal-content flex h-screen w-screen absolute z-[999999] left-0 left-0 overflow-auto">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index}`} className="modal-image" />
          ))}
        </div>
      </div>
    </div>
  );
}
