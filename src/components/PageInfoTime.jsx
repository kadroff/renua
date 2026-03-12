'use client'

import React, { useState, useEffect } from 'react';

const PageInfoTime = ({ country, timezone }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const options = {
        timeZone: getTimeZoneByCountry(country),
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };

      const formattedTime = now.toLocaleTimeString('en-US', options);

      setTime(`${formattedTime} ${timezone}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [country, timezone]);

  return <span className={`page-info-time ${country.toLowerCase()}`}>{time}</span>;
};

const getTimeZoneByCountry = (country) => {
  switch (country) {
    case 'Switzerland':
      return 'Europe/Zurich';
    case 'Estonia':
      return 'Europe/Tallinn';
    default:
      return 'UTC';
  }
};

export default PageInfoTime;
