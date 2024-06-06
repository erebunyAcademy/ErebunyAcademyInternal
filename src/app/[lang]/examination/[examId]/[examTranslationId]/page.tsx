'use client';
import React from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { ExamService } from '@/api/services/exam.service';

const ExamTranslation = ({
  params: { examTranslationId },
  searchParams,
}: {
  params: { examTranslationId: string };
  searchParams: { questionId: string };
}) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['question', examTranslationId, searchParams.questionId],
    queryFn: ExamService.getExamTestQuestion.bind(null, examTranslationId, searchParams.questionId),
  });

  if (!data || !isSuccess) {
    return null;
  }

  const { testQuestion, previousQuestionId, nextQuestionId } = data;

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
          <Button
            colorScheme="teal"
            onClick={() => console.log('Previous Question:', previousQuestionId)}>
            Previous
          </Button>
          <Button colorScheme="teal" onClick={() => console.log('Next Question:', nextQuestionId)}>
            Next
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default ExamTranslation;
