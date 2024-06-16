'use client';
import React, { FC, memo, useCallback } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useRouter } from 'next/navigation';
import { useTimer } from 'react-timer-hook';
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
  const router = useRouter();

  const handleClose = useCallback(() => router.push(ROUTE_STUDENT_EXAM_LIST), [router]);

  const { isOpen, onClose, onOpen } = useDisclosure({ onClose: handleClose });

  const expiryTimestamp = dayjs(startTime).add(durationInMinutes, 'minute').toDate();

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      finish(
        { examId },
        {
          onSuccess() {
            onOpen();
          },
        },
      );
    },
  });

  return (
    <Box>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '100px' }}>
          <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>

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
