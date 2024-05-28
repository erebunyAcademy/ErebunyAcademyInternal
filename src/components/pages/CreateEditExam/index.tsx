'use client';
import React, { FC } from 'react';
import { Avatar, Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Attachment, AttachmentTypeEnum, LanguageTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CourseGroupService } from '@/api/services/course-group.service';
import { CourseService } from '@/api/services/courses.service';
import { ExamService } from '@/api/services/exam.service';
import { FacultyService } from '@/api/services/faculty.service';
import { StudentService } from '@/api/services/student.service';
import { SubjectService } from '@/api/services/subject.service';
import { TestQuestionService } from '@/api/services/test-question.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import TableCheckbox from '@/components/organisms/TableCheckbox';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { ExamDataListModel } from '@/utils/models/exam';
import { UserStudentModel } from '@/utils/models/student';
import { SubjectSignupListModel } from '@/utils/models/subject';
import { TestQuestionListModel } from '@/utils/models/test-question.model';
import { ExamValidation } from '@/utils/validation/exam';

const resolver = classValidatorResolver(ExamValidation);

type CreateEditExamProps = {
  exam?: ExamDataListModel;
};

const CreateEditExam: FC<CreateEditExamProps> = () => {
  const { control, watch, handleSubmit } = useForm<ExamValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      facultyId: '',
      courseId: '',
      courseGroupId: '',
      studentIds: [],
      subjectId: '',
      testQuestionIds: [],
      language: LanguageTypeEnum.AM,
    },
  });

  const languageTypes = [
    {
      id: LanguageTypeEnum.AM,
      type: 'Armenian',
    },
    {
      id: LanguageTypeEnum.RU,
      type: 'Russian',
    },
    {
      id: LanguageTypeEnum.EN,
      type: 'English',
    },
  ];

  const isFacultySelected = watch('facultyId');
  const isCourseSelected = watch('courseId');
  const isCourseGroupSelected = watch('courseGroupId');

  const { data: facultyQueryData } = useQuery({
    queryKey: ['faculty'],
    queryFn: FacultyService.list,
  });

  const { data: studentGradeQueryData } = useQuery({
    queryKey: ['student-grade', isFacultySelected],
    queryFn: () => CourseService.getCourseByFacultyId(isFacultySelected),
    enabled: !!isFacultySelected,
  });

  const { data: studentGradeGroupQueryData } = useQuery({
    queryKey: ['student-grade-group', isCourseGroupSelected],
    queryFn: () => CourseGroupService.getStudentGradeGroupByStudentGradeId(isCourseSelected),
    enabled: !!isCourseSelected,
  });

  const { data: studentsData } = useQuery({
    queryKey: ['students', isCourseGroupSelected],
    queryFn: () => StudentService.getStudentsByCourseGroupId(isCourseGroupSelected),
    enabled: !!isCourseGroupSelected,
  });

  const { data: subjectQueryData } = useQuery<SubjectSignupListModel>({
    queryKey: ['subject'],
    queryFn: SubjectService.list,
  });

  const subjectId = watch('subjectId');

  const { data: testQuestionQueryData } = useQuery<TestQuestionListModel>({
    queryKey: ['testQuestion', subjectId],
    queryFn: () => TestQuestionService.getTestQuestionsBySubjectId(subjectId),
    enabled: !!subjectId,
  });

  const columnHelper = createColumnHelper<UserStudentModel>();

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

  const testQuestionCcolumnHelper = createColumnHelper<TestQuestionListModel>();

  const testQuestionColumns = [
    testQuestionCcolumnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Question',
    }),
    testQuestionCcolumnHelper.accessor('options', {
      id: uuidv4(),
      cell: info =>
        (info.getValue() as any).map(({ title }: { title: string }) => (
          <Box key={title} my={2}>
            {title}
          </Box>
        )),
      header: 'Answers',
    }),
  ];

  const { mutate } = useMutation({
    mutationFn: ExamService.createExam,
  });

  const onSubmit = (data: ExamValidation) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign="center">Exam</Heading>
      <Stack
        direction={{ base: 'column', md: 'column' }}
        gap={{ base: '16px', sm: '8px' }}
        borderWidth="1px"
        borderRadius="lg"
        px="24px"
        py="32px">
        <Flex gap="30px">
          <Flex width="33.3%">
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
                />
              )}
            />
          </Flex>

          <Flex width="33.3%">
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

          <Flex width="33.3%">
            <Controller
              name="language"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <SelectLabel
                  name={name}
                  options={languageTypes}
                  labelName="Please select exam language"
                  valueLabel="id"
                  nameLabel="type"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Flex>
        </Flex>

        <Flex gap="30px">
          <Flex width="33.3%">
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
          </Flex>
          <Flex width="33.3%">
            {isFacultySelected && (
              <Controller
                name="courseId"
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
          <Flex width="33.3%">
            {isCourseSelected && (
              <Controller
                name="courseGroupId"
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
          </Flex>
        </Flex>

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

      <Box my="50px">
        <Heading textAlign="center">Choose text questions</Heading>
        <Flex width="25%" my="50px">
          <Controller
            name="subjectId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={subjectQueryData || []}
                labelName="Select Subject"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Flex>

        {subjectId && (
          <Controller
            name="studentIds"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TableCheckbox
                title="Select tests"
                data={testQuestionQueryData || []}
                selectedValues={value}
                onChange={onChange}
                // @ts-ignore
                columns={testQuestionColumns || []}
              />
            )}
          />
        )}

        <Button colorScheme="teal" type="submit" width="50%">
          Submit Exam
        </Button>
      </Box>
    </form>
  );
};

export default CreateEditExam;
