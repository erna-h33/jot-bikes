import React from 'react';

const PageHero = ({ title, description, backgroundImage }) => {
  return (
    <div
      className="relative h-[600px] w-full bg-cover bg-center -mt-20 bg-no-repeat"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        objectFit: 'cover',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-gray-200">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PageHero;
