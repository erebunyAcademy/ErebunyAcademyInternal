'use client';
import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ExamService } from '@/api/services/exam.service';
import { Locale } from '@/i18n';
import { ROUTE_EXAMINATION } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

const ExamTranslation = ({
  params: { examTranslationId, examId, lang, testQuestionId },
}: {
  params: { examId: string; examTranslationId: string; lang: Locale; testQuestionId: string };
}) => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['question', testQuestionId],
    queryFn: ExamService.getExamTestQuestion.bind(null, testQuestionId),
  });

  const { testQuestion, previousQuestionId, nextQuestionId } = data || {};

  const onPrev = useCallback(
    () =>
      router.push(
        `${languagePathHelper(lang, ROUTE_EXAMINATION)}/${examId}/${examTranslationId}/${previousQuestionId}`,
      ),
    [examId, examTranslationId, lang, previousQuestionId, router],
  );

  const { mutate } = useMutation({
    mutationFn: ExamService.createStudentAnswer.bind(null, examId, []),
    onSuccess() {
      router.push(
        `${languagePathHelper(lang, ROUTE_EXAMINATION)}/${examId}/${examTranslationId}/${nextQuestionId}`,
      );
    },
  });

  const onNext = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <Box p={5} shadow="md" borderWidth="1px" h="100vh">
      <Center flexDir="column" h="100%">
        <Heading fontSize="xl" mb={10}>
          {testQuestion?.title}
        </Heading>
        {testQuestion?.description && <Text mt={2}>{testQuestion.description}</Text>}
        {testQuestion?.type === 'RADIO' && (
          <RadioGroup mt={4}>
            <Stack spacing={5} direction="column">
              {testQuestion.options.map(item => (
                <Radio key={item.id} value={item.id}>
                  {item.title}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        )}
        {testQuestion?.type === 'CHECKBOX' && (
          <CheckboxGroup>
            <Stack spacing={5} direction="column">
              {testQuestion?.options.map(item => (
                <Checkbox key={item.id} value={item.id}>
                  {item.title}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        )}
        <Stack direction="row" spacing={300} mt={20}>
          <Button colorScheme="teal" isDisabled={!previousQuestionId} onClick={onPrev}>
            Previous
          </Button>
          <Button colorScheme="teal" onClick={onNext} isDisabled={!nextQuestionId}>
            Next
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default ExamTranslation;
