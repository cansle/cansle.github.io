import React from 'react';

const Loading = () => (
  <div className="loading">
    <img src={`${process.env.PUBLIC_URL}/loading.gif`} alt="Loading" />
    <p>Loading...</p>
  </div>
);

export default Loading;
