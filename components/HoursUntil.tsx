'use client';

import React, { useEffect, useState } from 'react';

interface HoursUntilProps {
  targetTime?: string;
}

const HoursUntil: React.FC<HoursUntilProps> = ({ targetTime }) => {
  const [hoursLeft, setHoursLeft] = useState<number | null>(null);

  const calculateHoursUntil = (targetTime: string): number | null => {
    const now = new Date();

    const regex = /^(1[0-2]|0?[1-9]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/i;
    if (!regex.test(targetTime)) {
      return null; // Invalid format
    }

    const [timePart, amPm] = targetTime.split(' ');
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return null; // Invalid time components
    }

    let targetHours = hours;
    if (amPm.toUpperCase() === 'PM' && hours !== 12) {
      targetHours += 12;
    } else if (amPm.toUpperCase() === 'AM' && hours === 12) {
      targetHours = 0; // Midnight
    }

    const target = new Date(now);
    target.setHours(targetHours, minutes, seconds, 0);

    let diffInMs = target.getTime() - now.getTime();

    if (diffInMs < 0) {
      target.setDate(target.getDate() + 1);
      diffInMs = target.getTime() - now.getTime();
    }

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    return diffInHours;
  };

  useEffect(() => {
    if (typeof targetTime === 'string') {
      const hours = calculateHoursUntil(targetTime);
      setHoursLeft(hours);
    } else {
      setHoursLeft(null);
    }
  }, [targetTime]);

  return (
    <div>
      <p>
        {hoursLeft !== null ? (
          hoursLeft >= 0 ? (
            `IN ${hoursLeft} HOURS`
          ) : (
            `${hoursLeft} hours ago`
          )
        ) : (
          'Calculating...'
        )}
      </p>
    </div>
  );
};

export default HoursUntil;
