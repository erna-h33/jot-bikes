import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import moment from 'moment';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import './AvailabilityCalendar.css';

const AvailabilityCalendar = ({ product, bookings }) => {
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    calculateAvailability();
  }, [bookings, product]);

  const calculateAvailability = () => {
    const availabilityMap = {};
    const today = moment().startOf('day');

    // Initialize next 90 days with full availability
    for (let i = 0; i < 90; i++) {
      const currentDate = moment(today).add(i, 'days').format('YYYY-MM-DD');
      availabilityMap[currentDate] = product.countInStock;
    }

    // Subtract booked units for each date
    bookings?.forEach((booking) => {
      const start = moment(booking.startDate);
      const end = moment(booking.endDate);
      let current = moment(start);

      while (current.isSameOrBefore(end, 'day')) {
        const dateKey = current.format('YYYY-MM-DD');
        if (availabilityMap[dateKey] !== undefined) {
          availabilityMap[dateKey] -= 1;
        }
        current.add(1, 'day');
      }
    });

    setAvailability(availabilityMap);
  };

  const getAvailabilityClass = (date) => {
    const dateKey = moment(date).format('YYYY-MM-DD');
    const availableUnits = availability[dateKey];

    if (availableUnits === undefined || moment(date).isBefore(moment(), 'day')) {
      return 'text-gray-400'; // Past or unavailable dates
    }
    if (availableUnits === 0) {
      return 'text-red-500'; // Fully booked
    }
    if (availableUnits < product.countInStock / 2) {
      return 'text-yellow-500'; // Limited availability
    }
    return 'text-green-500'; // Good availability
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const dateKey = moment(date).format('YYYY-MM-DD');
    const availableUnits = availability[dateKey];

    return (
      <div className="text-xs mt-1">
        {availableUnits > 0 &&
          availableUnits !== undefined &&
          !moment(date).isBefore(moment(), 'day') && (
            <span className={getAvailabilityClass(date)}>{availableUnits} available</span>
          )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-white">Availability Calendar</h3>

      <div className="mb-4 flex items-center space-x-4 text-white">
        <div className="flex items-center">
          <FaCheckCircle className="text-green-500 mr-2" />
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <FaExclamationCircle className="text-yellow-500 mr-2" />
          <span>Limited</span>
        </div>
        <div className="flex items-center">
          <FaTimesCircle className="text-red-500 mr-2" />
          <span>Booked</span>
        </div>
      </div>

      <Calendar
        className="rounded-lg border-0 shadow-lg"
        tileContent={tileContent}
        tileClassName={({ date }) => `${getAvailabilityClass(date)} hover:bg-gray-700`}
        minDate={new Date()}
        maxDate={moment().add(90, 'days').toDate()}
        onClickDay={(value) => setSelectedDate(value)}
      />

      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg shadow-md">
          <h4 className="font-semibold text-white">
            {moment(selectedDate).format('MMMM D, YYYY')}
          </h4>
          <p className={`${getAvailabilityClass(selectedDate)} font-medium`}>
            {availability[moment(selectedDate).format('YYYY-MM-DD')] || 0} units available
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
