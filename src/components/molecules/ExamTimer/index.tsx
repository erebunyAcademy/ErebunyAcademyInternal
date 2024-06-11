'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import useFinishExam from '@/hooks/useFinishExam';

dayjs.extend(duration);

type ExamTimeProps = {
  startTime: Date;
  durationInMinutes: number;
  examId: string;
};

const ExamTimer: FC<ExamTimeProps> = ({ startTime, durationInMinutes, examId }) => {
  const calculateTimeLeft = useCallback(() => {
    const now = dayjs();
    const endTime = dayjs(startTime).add(durationInMinutes, 'minute');
    const timeRemaining = endTime.diff(now);
    return dayjs.duration(timeRemaining > 0 ? timeRemaining : 0);
  }, [durationInMinutes, startTime]);
  const { mutate: finish } = useFinishExam();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationInMinutes, calculateTimeLeft]);

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
