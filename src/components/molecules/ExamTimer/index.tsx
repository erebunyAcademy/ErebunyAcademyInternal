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
  const { mutate: finish } = useFinishExam();
  const [timeLeft, setTimeLeft] = useState(dayjs.duration(0));
  const [isFinished, setIsFinished] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = dayjs();
    const endTime = dayjs(startTime).add(durationInMinutes, 'minute');
    const timeRemaining = endTime.diff(now);

    if (timeRemaining > 0) {
      return dayjs.duration(timeRemaining);
    } else {
      return dayjs.duration(0);
    }
  }, [durationInMinutes, startTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = calculateTimeLeft();
      setTimeLeft(timeRemaining);

      if (timeRemaining.asSeconds() <= 0 && !isFinished) {
        setIsFinished(true);
        finish(examId);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationInMinutes, calculateTimeLeft, isFinished, finish, examId]);

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
