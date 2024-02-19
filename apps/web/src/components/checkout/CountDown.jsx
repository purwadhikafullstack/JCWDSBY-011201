import React from 'react';
export function CountDown({ hours, minutes, seconds }) {
  return (
    <div className="flex justify-around text-center font-extrabold text-red-500">
      {/* <div>
       <h2 id="day">30</h2>
       <p>days</p>
      </div> */}
      <div>
        <h2 id="hour">{hours}</h2>
        <p>Jam</p>
      </div>
      <div>
        <h2 id="minute">{minutes}</h2>
        <p>Menit</p>
      </div>
      <div>
        <h2 id="second">{seconds}</h2>
        <p>Detik</p>
      </div>
    </div>
  );
}
