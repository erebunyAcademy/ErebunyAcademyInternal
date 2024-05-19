import { FormInput } from '@/components/atoms';
import { ExamValidation } from '@/utils/validation/exam';
import { DeleteIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, Heading, Radio, Stack, IconButton } from '@chakra-ui/react';
import { TestQuestionTypeEnum } from '@prisma/client';
import { FC, memo } from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { v4 } from 'uuid';

interface AnswersControlProps {
  control: Control<ExamValidation>;
  questionIndex: number;
  questionType: TestQuestionTypeEnum;
}

const AnswersControl: FC<AnswersControlProps> = ({ control, questionIndex, questionType }) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `questions.${questionIndex}.answers`,
  });

  const handleRadioChange = (index: number) => {
    fields.forEach((field, i) => {
      update(i, { ...field, isRightAnswer: i === index });
    });
  };

  return (
    <Stack>
      <Heading size="sm">Answers</Heading>
      {fields.map((answer, answerIndex) => (
        <Flex key={answer.id} alignItems="center" gap={24}>
          <Flex display="flex" alignItems="center" height="100%">
            {questionType === TestQuestionTypeEnum.RADIO ? (
              <Controller
                name={`questions.${questionIndex}.answers.${answerIndex}.isRightAnswer`}
                control={control}
                render={({ field }) => (
                  <Radio
                    isChecked={field.value}
                    onChange={() => {
                      handleRadioChange(answerIndex);
                      field.onChange(true);
                    }}>
                    Correct
                  </Radio>
                )}
              />
            ) : (
              <Controller
                name={`questions.${questionIndex}.answers.${answerIndex}.isRightAnswer`}
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <Checkbox
                    name={name}
                    isChecked={value}
                    onChange={e => onChange(e.target.checked)}
                    ml="4">
                    Correct
                  </Checkbox>
                )}
              />
            )}
          </Flex>

          <Flex flexGrow={1}>
            <Controller
              name={`questions.${questionIndex}.answers.${answerIndex}.title`}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  placeholder="Answer"
                  name={name}
                  type="text"
                  formLabelName={`Answer ${answerIndex + 1}`}
                  value={value}
                  handleInputChange={onChange}
                />
              )}
            />
          </Flex>

          <Flex>
            <IconButton
              colorScheme="red"
              aria-label="Delete answer"
              icon={<DeleteIcon />}
              onClick={() => remove(answerIndex)}
              ml="4"
            />
          </Flex>
        </Flex>
      ))}
      <Button
        onClick={() => append({ title: '', isRightAnswer: false, optionId: v4() })}
        width="50%">
        Add Answer
      </Button>
    </Stack>
  );
};

export default memo(AnswersControl);
