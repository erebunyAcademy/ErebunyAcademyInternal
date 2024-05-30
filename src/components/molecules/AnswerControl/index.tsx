import { FC, memo } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, Heading, IconButton, Radio, Stack } from '@chakra-ui/react';
import { TestQuestionTypeEnum } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { FormInput } from '@/components/atoms';
import { TestQuestionValidation } from '@/utils/validation/exam';

interface AnswersControlProps {
  control: Control<TestQuestionValidation>;
  questionIndex: number;
  questionType: TestQuestionTypeEnum;
}

const AnswersControl: FC<AnswersControlProps> = ({ control, questionIndex, questionType }) => {
  const t = useTranslations();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const handleRadioChange = (index: number) => {
    fields.forEach((field, i) => {
      update(i, { ...field, isRightAnswer: i === index });
    });
  };
  return (
    <Stack>
      <Heading size="sm">{t('answers')}</Heading>
      {fields.map((answer, answerIndex) => (
        <Flex key={answer.id} alignItems="center" gap={24}>
          <Flex display="flex" alignItems="center" height="100%">
            {questionType === TestQuestionTypeEnum.RADIO ? (
              <Controller
                name={`questions.${questionIndex}.options.${answerIndex}.isRightAnswer`}
                control={control}
                render={({ field }) => (
                  <Radio
                    isChecked={field.value}
                    onChange={() => {
                      handleRadioChange(answerIndex);
                      field.onChange(true);
                    }}>
                    {t('correct')}
                  </Radio>
                )}
              />
            ) : (
              <Controller
                name={`questions.${questionIndex}.options.${answerIndex}.isRightAnswer`}
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <Checkbox
                    name={name}
                    isChecked={value}
                    onChange={e => onChange(e.target.checked)}
                    ml="4">
                    {t('correct')}
                  </Checkbox>
                )}
              />
            )}
          </Flex>

          <Flex flexGrow={1}>
            <Controller
              name={`questions.${questionIndex}.options.${answerIndex}.title`}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  placeholder={t('answer')}
                  name={name}
                  type="text"
                  formLabelName={`${t('answer')} ${answerIndex + 1}`}
                  value={value}
                  handleInputChange={onChange}
                />
              )}
            />
          </Flex>

          <Flex>
            <IconButton
              colorScheme="red"
              aria-label={t('deleteAnswer')}
              icon={<DeleteIcon />}
              onClick={() => remove(answerIndex)}
              ml="4"
            />
          </Flex>
        </Flex>
      ))}
      <Button onClick={() => append({ title: '', isRightAnswer: false })} width="50%">
        {t('addAnswer')}
      </Button>
    </Stack>
  );
};

export default memo(AnswersControl);
