import { Datepicker } from 'flowbite-react';
import React from 'react';
export function DatepickerForOrders({ setSearchParams }) {
  return (
    <div className="flex flex-col gap-y-3 mb-3">
      <label htmlFor="from" className="flex gap-x-6">
        from:
        <Datepicker
          className="w-40"
          maxDate={new Date()}
          onSelectedDateChanged={(date) => {
            setSearchParams((value) => {
              if (date.toLocaleString('en-CA').split(' ')[1] === '12:00:00') {
                value.set(
                  'from',
                  date
                    .toLocaleString('en-CA', {
                      timeZone: 'Asia/Jakarta',
                    })
                    .split(',')[0],
                );
                value.set('page', 1);
              } else {
                value.delete('from');
                value.delete('page');
              }

              return value;
            });
          }}
        />
      </label>
      <label htmlFor="to" className="flex gap-x-10">
        to:
        <Datepicker
          className="w-40"
          maxDate={new Date()}
          onSelectedDateChanged={(date) => {
            setSearchParams((value) => {
              if (date.toLocaleString('en-CA').split(' ')[1] === '12:00:00') {
                value.set(
                  'to',
                  date
                    .toLocaleString('en-CA', {
                      timeZone: 'Asia/Jakarta',
                    })
                    .split(',')[0],
                );
                value.set('page', 1);
              } else {
                value.delete('to');
                value.delete('page');
              }

              return value;
            });
          }}
        />
      </label>
    </div>
  );
}
