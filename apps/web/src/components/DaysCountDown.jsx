import React from 'react';
export function DaysCountDown({ days, hours, minutes, seconds, displayText }) {
  return (
    <div className="flex justify-around text-center font-extrabold text-emerald-500">
      <div>
        <h2 id="day">{days}</h2>
        {displayText && <p>Hari</p>}
      </div>
      <div>
        <h2 id="hour">{hours}</h2>
        {displayText && <p>Jam</p>}
      </div>
      <div>
        <h2 id="minute">{minutes}</h2>
        {displayText && <p>Menit</p>}
      </div>
      <div>
        <h2 id="second">{seconds}</h2>
        {displayText && <p>Detik</p>}
      </div>
    </div>
  );
}
