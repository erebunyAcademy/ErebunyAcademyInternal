import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

type ExamTimeProps = {
  startTime: Date;
  durationInMinutes: number;
};

const ExamTimer: FC<ExamTimeProps> = ({ startTime, durationInMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(dayjs.duration(durationInMinutes * 60 * 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const endTime = dayjs(startTime).add(durationInMinutes, 'minute');
      const timeRemaining = endTime.diff(now);

      if (timeRemaining <= 0) {
        clearInterval(interval);
        setTimeLeft(dayjs.duration(0));
      } else {
        setTimeLeft(dayjs.duration(timeRemaining));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationInMinutes]);

  const formatTime = (timeDuration: duration.Duration) => {
    const minutes = timeDuration.minutes();
    const seconds = timeDuration.seconds();
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Box>
      <Text as="h2" fontSize={24} textAlign="center">
        Time Left: {formatTime(timeLeft)}
      </Text>
    </Box>
  );
};

export default ExamTimer;
