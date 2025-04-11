import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-white opacity-50">
        <div className="absolute top-[40%] right-[50%] bg-white p-4 rounded-lg z-10 text-right">
          <button
            onClick={onClose}
            className="text-gray-500  font-semibold hover:text-gray-700 focus:outline-none mr-2"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
