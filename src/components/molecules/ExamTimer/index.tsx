'use client';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { Box, Text, useDisclosure } from '@chakra-ui/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useRouter } from 'next/navigation';
import useFinishExam from '@/hooks/useFinishExam';
import { ROUTE_STUDENT_EXAM_LIST } from '@/utils/constants/routes';
import ExamResultsModal from '../ExamResultsModal';

dayjs.extend(duration);

type ExamTimeProps = {
  startTime: Date;
  durationInMinutes: number;
  examId: string;
  examTranslationId: string;
};

const ExamTimer: FC<ExamTimeProps> = ({
  startTime,
  durationInMinutes,
  examId,
  examTranslationId,
}) => {
  const { mutate: finish } = useFinishExam();
  const [timeLeft, setTimeLeft] = useState(dayjs.duration(0));
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  const handleClose = useCallback(() => router.push(ROUTE_STUDENT_EXAM_LIST), [router]);

  const { isOpen, onClose, onOpen } = useDisclosure({ onClose: handleClose });

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
        finish({ examId }, { onSuccess: onOpen });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft, examId, finish, isFinished, onOpen, router]);

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

      <ExamResultsModal
        isOpen={isOpen}
        onClose={onClose}
        examId={examId}
        onFinish={handleClose}
        examTranslationId={examTranslationId}
      />
    </Box>
  );
};

export default memo(ExamTimer);
