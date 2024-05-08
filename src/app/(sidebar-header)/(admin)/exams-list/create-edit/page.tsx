'use client';
import React from 'react';
import { Heading, Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Controller, useForm } from 'react-hook-form';
import { FormInput, SelectLabel } from '@/components/atoms';
import SelectCheckboxLabel from '@/components/atoms/SelectCheckboxLabel';
import { ExamValidation } from '@/utils/validation/exam';

const resolver = classValidatorResolver(ExamValidation);

const Exam = () => {
  const { control } = useForm<ExamValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      facultyId: '',
      selectedUsersIds: [],
    },
  });
  return (
    <div>
      <Heading textAlign="center">Exam Description</Heading>
      <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
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

        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              options={[]}
              labelName="Select faculty for"
              valueLabel="name"
              nameLabel="name"
              onChange={onChange}
              value={value}
            />
          )}
        />

        <Controller
          name="selectedUsersIds"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectCheckboxLabel
              name={name}
              options={[]}
              labelName="Select faculty for"
              valueLabel="name"
              nameLabel="name"
              onChange={onChange}
              value={value}
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default Exam;
