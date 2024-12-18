import React from 'react';

import background from '../../pic/backround.jpg.avif';

const HomeDashboard = () => {
  const style: any = {
    head: {
      fontSize: '50px', // Large font size
      fontWeight: 'bold', // Bold text
      textAlign: 'center', // Center text horizontally
      color: 'black', // White text for better contrast on the background
      display: 'flex', // Use flexbox for alignment
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
      position: 'absolute', // Position it over the image
      top: 0,
      left: 0,
      right: 0,
      bottom: -400,
      zIndex: 1, // Ensure it stays above the image
    },
    container: {
      position: 'relative', // Parent container for absolute positioning
      overflow: 'hidden', // Prevents overflowing
      display: 'flex',
      justifyContent: 'center', // Center horizontally
      alignItems: 'center',
      height: '100%', // Adjusted height of the container for a smaller display
    },
    background: {
      width: '50%', // Adjust the width of the image to make it smaller
      height: 'auto', // Maintain the aspect ratio
      objectFit: 'contain', // Ensure the image fits nicely within the container
    },
  };

  return (
    <div style={style.container}>
      <img style={style.background} src={background} alt="Background" />
      <div style={style.head}>Select User to Chat</div>
    </div>
  );
};

export default HomeDashboard;
