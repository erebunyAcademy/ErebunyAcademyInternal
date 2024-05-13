'use client';
import React from 'react';
import { Flex, Heading, Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { FacultyService } from '@/api/services/faculty.service';
import { StudentGradeGroupService } from '@/api/services/student-grade-group.service';
import { StudentGradeService } from '@/api/services/student-grade.service';
import { StudentService } from '@/api/services/student.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import TableCheckbox from '@/components/organisms/TableCheckbox';
import { ExamValidation } from '@/utils/validation/exam';

const resolver = classValidatorResolver(ExamValidation);

const Exam = () => {
  const { control, watch } = useForm<ExamValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      facultyId: '',
      studentGradeId: '',
      studentGradeGroupId: '',
      studentIds: [],
    },
  });

  const isFacultySelected = watch('facultyId');
  const isStudentGradeSelected = watch('studentGradeId');
  const isStudentGradeGroupSelected = watch('studentGradeGroupId');

  const { data: facultyQueryData } = useQuery({
    queryKey: ['faculty'],
    queryFn: FacultyService.list,
  });

  const { data: studentGradeQueryData } = useQuery({
    queryKey: ['student-grade', isFacultySelected],
    queryFn: () => StudentGradeService.getStudentGradeByFacultyId(isFacultySelected),
    enabled: !!isFacultySelected,
  });

  const { data: studentGradeGroupQueryData } = useQuery({
    queryKey: ['student-grade-group', isStudentGradeSelected],
    queryFn: () =>
      StudentGradeGroupService.getStudentGradeGroupByStudentGradeId(isStudentGradeSelected),
    enabled: !!isStudentGradeSelected,
  });

  const { data: studentsData } = useQuery({
    queryKey: ['students', isStudentGradeGroupSelected],
    queryFn: () => StudentService.getStudentsByStudentGradeGroupId(isStudentGradeGroupSelected),
    enabled: !!isStudentGradeGroupSelected,
  });

  const columnHelper = createColumnHelper<User[]>();

  const columns = [
    columnHelper.accessor('firstName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'First Name',
    }),
    columnHelper.accessor('lastName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Last Name',
    }),
    columnHelper.accessor('email', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Email',
    }),
  ];

  return (
    <div>
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
        <Heading>Create Exam Tests</Heading>
      </Stack>
    </div>
  );
};

export default Exam;
