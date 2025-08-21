import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
// import App from './App-v1';
import App from './App-v2';
import StarRatings from './StarRatings';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRatings maxRating={5} />
    <StarRatings maxRating={5} color='blue' size={30} />
    <StarRatings maxRating={5} color='blue' defaultRating={2} />
    <StarRatings maxRating={3} color='blue' size={50} messages={["terrible", "good", "excellent"]} /> */}
    {/* <Test /> */}
  </React.StrictMode>
);

function Test() {
  const [rate, setRate] = useState(0);


  return <div>
    <StarRatings maxRating={5} color='orange' defaultRating={2} size={30} onSetRating={setRate} />
    <p>use gave {rate} star rating for it</p>
  </div>
}

