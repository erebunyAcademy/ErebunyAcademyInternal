import { FC, memo } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Checkbox, Flex, Heading, IconButton, Radio, Stack } from '@chakra-ui/react';
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
        <Flex
          key={answer.id}
          alignItems={{ base: 'flex-start', sm: 'center' }}
          gap={{ base: '15px', sm: '24px' }}
          flexDirection={{ base: 'column', sm: 'row' }}>
          <Flex
            width={{ base: '100%', sm: 'auto' }}
            alignItems="center"
            height="100%"
            justifyContent="space-between">
            <Box>
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
                      mt="22px"
                      name={name}
                      isChecked={value}
                      onChange={e => onChange(e.target.checked)}
                      ml="4">
                      {t('correct')}
                    </Checkbox>
                  )}
                />
              )}
            </Box>
            <Box display={{ base: 'block', sm: 'none' }}>
              <IconButton
                size="sm"
                colorScheme="red"
                aria-label={t('deleteAnswer')}
                icon={<DeleteIcon />}
                onClick={() => remove(answerIndex)}
                ml="4"
              />
            </Box>
          </Flex>

          <Flex width="100%">
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

          <Flex mt={{ base: '0', sm: '16px' }}>
            <Box display={{ base: 'none', sm: 'block' }}>
              <IconButton
                size={{ base: 'sm', lg: 'md' }}
                colorScheme="red"
                aria-label={t('deleteAnswer')}
                icon={<DeleteIcon />}
                onClick={() => remove(answerIndex)}
                ml="4"
              />
            </Box>
          </Flex>
        </Flex>
      ))}
      <Button
        onClick={() => append({ title: '', isRightAnswer: false })}
        width="50%"
        fontSize={{ base: '16px', lg: '20px' }}>
        {t('addAnswer')}
      </Button>
    </Stack>
  );
};

export default memo(AnswersControl);
