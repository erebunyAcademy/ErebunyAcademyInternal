'use client';
import React, { FC, useEffect } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Button, Flex, Heading, IconButton, Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import {
  Attachment,
  AttachmentTypeEnum,
  TestQuestionLevelEnum,
  TestQuestionTypeEnum,
} from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuidv4, v4 } from 'uuid';
import { ExamService } from '@/api/services/exam.service';
import { FacultyService } from '@/api/services/faculty.service';
import { StudentGradeGroupService } from '@/api/services/student-grade-group.service';
import { StudentGradeService } from '@/api/services/student-grade.service';
import { StudentService } from '@/api/services/student.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import AnswersControl from '@/components/molecules/AnswerControl';
import TableCheckbox from '@/components/organisms/TableCheckbox';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { ExamDataListModel } from '@/utils/models/exam';
import { StudentsExamListModel } from '@/utils/models/student';
import { ExamValidation } from '@/utils/validation/exam';

const resolver = classValidatorResolver(ExamValidation);

const initValue = {
  questionText: '',
  questionType: TestQuestionTypeEnum.CHECKBOX,
  skillLevel: TestQuestionLevelEnum.BEGINNER,
  answers: [{ title: '', isRightAnswer: false, optionId: v4() }],
};
const questionTypes = [
  {
    id: TestQuestionTypeEnum.RADIO,
    type: 'Single',
  },
  {
    id: TestQuestionTypeEnum.CHECKBOX,
    type: 'Multiple',
  },
];

const skillLevels = [
  {
    id: TestQuestionLevelEnum.BEGINNER,
    skillLevel: 'Beginner',
  },
  {
    id: TestQuestionLevelEnum.INTERMEDIATE,
    skillLevel: 'Intermediate',
  },
  {
    id: TestQuestionLevelEnum.ADVANCED,
    skillLevel: 'Advanced',
  },
];

type CreateEditExamProps = {
  exam?: ExamDataListModel;
};

const CreateEditExam: FC<CreateEditExamProps> = ({ exam }) => {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExamValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      facultyId: '',
      studentGradeId: '',
      studentGradeGroupId: '',
      studentIds: [],
      questions: [initValue],
    },
  });

  useEffect(() => {
    if (exam) {
      setValue('facultyId', exam.faculty?.id!);
      setValue('studentGradeId', exam.studentGradeId!);
      setValue('studentGradeGroupId', exam.studentGradeGroupId!);
      setValue('title', exam.title!);
      setValue(
        'studentIds',
        exam.studentExams.map(studentExam => studentExam.studentId),
      );
    }
  }, [exam, setValue]);

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  const isFacultySelected = watch('facultyId');
  const isStudentGradeSelected = watch('studentGradeId');
  const isStudentGradeGroupSelected = watch('studentGradeGroupId');

  console.log(watch('studentIds'));
  console.log(watch('questions'));

  console.log({ isFacultySelected, isStudentGradeGroupSelected, isStudentGradeSelected });

  const { data: facultyQueryData } = useQuery({
    queryKey: ['faculty'],
    queryFn: FacultyService.list,
  });

  useEffect(() => {
    if (!exam && facultyQueryData && facultyQueryData.length === 1) {
      setValue('facultyId', facultyQueryData[0].id);
    }
  }, [facultyQueryData]);

  const { data: studentGradeQueryData } = useQuery({
    queryKey: ['student-grade', isFacultySelected],
    queryFn: () => StudentGradeService.getStudentGradeByFacultyId(isFacultySelected),
    enabled: !!isFacultySelected,
  });

  useEffect(() => {
    if (!exam && studentGradeQueryData && studentGradeQueryData.length === 1) {
      setValue('studentGradeId', studentGradeQueryData[0].id);
    }
  }, [studentGradeQueryData]);

  const { data: studentGradeGroupQueryData } = useQuery({
    queryKey: ['student-grade-group', isStudentGradeSelected],
    queryFn: () =>
      StudentGradeGroupService.getStudentGradeGroupByStudentGradeId(isStudentGradeSelected),
    enabled: !!isStudentGradeSelected,
  });

  useEffect(() => {
    if (!exam && studentGradeGroupQueryData && studentGradeGroupQueryData.length === 1) {
      setValue('studentGradeGroupId', studentGradeGroupQueryData[0].id);
    }
  }, [studentGradeGroupQueryData]);

  const { data: studentsData } = useQuery({
    queryKey: ['students', isStudentGradeGroupSelected],
    queryFn: () => StudentService.getStudentsByStudentGradeGroupId(isStudentGradeGroupSelected),
    enabled: !!isStudentGradeGroupSelected,
  });

  const columnHelper = createColumnHelper<StudentsExamListModel>();

  const columns = [
    columnHelper.accessor('user.attachment', {
      id: uuidv4(),
      cell: (info: any) => {
        const existingAvatar = info
          .getValue()
          .find((attachment: Attachment) => attachment.type === AttachmentTypeEnum.AVATAR);
        return (
          <Avatar
            bg="#319795"
            color="#fff"
            name={`${info.row.original.user.firstName} ${info.row.original.user.lastName}`}
            src={generateAWSUrl(existingAvatar?.key || '')}
          />
        );
      },
      header: 'Avatar',
    }),
    columnHelper.accessor('user.firstName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'First Name',
    }),
    columnHelper.accessor('user.lastName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Last Name',
    }),
    columnHelper.accessor('user.email', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Email',
    }),
  ];

  const { mutate } = useMutation({
    mutationFn: ExamService.createExam,
  });

  const onSubmit = (data: ExamValidation) => {
    mutate(data);
  };
  console.log({ errors });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign="center">Exam Description</Heading>
      <Stack direction={{ base: 'column', md: 'column' }} gap={{ base: '16px', sm: '8px' }}>
        <Flex gap="30px">
          <Controller
            name="title"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                placeholder="Title"
                name={name}
                type="text"
                formLabelName="Title"
                value={value}
                handleInputChange={onChange}
                formHelperText={value}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                name={name}
                type="text"
                placeholder="Description"
                formLabelName="Description"
                value={value}
                handleInputChange={onChange}
              />
            )}
          />
        </Flex>

        <Flex gap="30px">
          <Controller
            name="facultyId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={facultyQueryData || []}
                labelName="Select faculty for"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
              />
            )}
          />
          {isFacultySelected && (
            <Controller
              name="studentGradeId"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <SelectLabel
                  name={name}
                  options={studentGradeQueryData || []}
                  labelName="Select student grade"
                  valueLabel="id"
                  nameLabel="title"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          )}
        </Flex>

        {isStudentGradeSelected && (
          <Controller
            name="studentGradeGroupId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={studentGradeGroupQueryData || []}
                labelName="Select student grade group"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
              />
            )}
          />
        )}

        {studentsData && (
          <Controller
            name="studentIds"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TableCheckbox
                title="Select students to participate in exam"
                data={studentsData || []}
                selectedValues={value}
                onChange={onChange}
                // @ts-ignore
                columns={columns || []}
              />
            )}
          />
        )}
      </Stack>

      <Stack>
        <Heading textAlign="center">Create Exam Questions</Heading>
        {questionFields.map((question, questionIndex) => {
          const questionType = watch(`questions.${questionIndex}.questionType`);
          return (
            <Stack key={question.id} borderWidth="1px" borderRadius="lg" px="12px" py="24px" mb="4">
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size="md">Question {questionIndex + 1}</Heading>
                <IconButton
                  aria-label="Delete question"
                  icon={<DeleteIcon />}
                  onClick={() => removeQuestion(questionIndex)}
                />
              </Flex>
              <Flex gap="30px">
                <Controller
                  name={`questions.${questionIndex}.questionText`}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <FormInput
                      isRequired
                      placeholder="Question"
                      name={name}
                      type="text"
                      formLabelName="Question"
                      value={value}
                      handleInputChange={onChange}
                    />
                  )}
                />
                <Controller
                  name={`questions.${questionIndex}.questionType`}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <SelectLabel
                      name={name}
                      options={questionTypes}
                      labelName="Question type"
                      valueLabel="id"
                      nameLabel="type"
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                <Controller
                  name={`questions.${questionIndex}.skillLevel`}
                  control={control}
                  render={({ field: { onChange, value, name } }) => (
                    <SelectLabel
                      name={name}
                      options={skillLevels}
                      labelName="Skill level"
                      valueLabel="id"
                      nameLabel="skillLevel"
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
              </Flex>

              <AnswersControl
                control={control}
                questionIndex={questionIndex}
                questionType={questionType}
              />
              {questionIndex === questionFields.length - 1 && (
                <Button onClick={() => appendQuestion(initValue)}>Add Question</Button>
              )}
            </Stack>
          );
        })}
        <Button colorScheme="teal" type="submit">
          Submit Exam
        </Button>
      </Stack>
    </form>
  );
};

export default CreateEditExam;
