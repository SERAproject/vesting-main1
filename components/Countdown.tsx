import React from 'react';

const Countdown = ({ countdownTimer }) => {

  return (
    <div className="countdown">
      <div className="card">
        <div className="countdown-value">{countdownTimer.days}</div>
        <div className="countdown-unit">Days</div>
      </div>
      <div className="card">
        <div className="countdown-value">{countdownTimer.hours}</div>
        <div className="countdown-unit">Hours</div>
      </div>
      <div className="card">
        <div className="countdown-value">{countdownTimer.mins}</div>
        <div className="countdown-unit">Mins</div>
      </div>
      <div className="card">
        <div className="countdown-value">{countdownTimer.secs}</div>
        <div className="countdown-unit">Secs</div>
      </div>
    </div>
  );
}

export default Countdown;
// source : https://github.com/autumnchris/countdown-timer