import { FormInput } from '@/components/atoms';
import { ExamValidation } from '@/utils/validation/exam';

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
      update(i, { ...field, isCorrect: i === index });
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
                name={`questions.${questionIndex}.answers.${answerIndex}.isCorrect`}
                control={control}
                render={({ field }) => (
                  <Radio
                    isChecked={field.value}
                    onChange={() => {
                      handleRadioChange(answerIndex);
                      field.onChange(true); // Ensure this field's value is set to true
                    }}>
                    Correct
                  </Radio>
                )}
              />
            ) : (
              <Controller
                name={`questions.${questionIndex}.answers.${answerIndex}.isCorrect`}
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
              name={`questions.${questionIndex}.answers.${answerIndex}.answerText`}
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
              aria-label="Delete answer"
              icon={<DeleteIcon />}
              onClick={() => remove(answerIndex)}
              ml="4"
            />
          </Flex>
        </Flex>
      ))}
      <Button onClick={() => append({ answerText: '', isCorrect: false, answerId: v4() })}>
        Add Answer
      </Button>
    </Stack>
  );
};

export default memo(AnswersControl);
