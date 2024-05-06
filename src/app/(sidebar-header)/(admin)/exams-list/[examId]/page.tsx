'use client';
import React from 'react';
import { Stack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Controller, useForm } from 'react-hook-form';
import { FormInput } from '@/components/atoms';
import { ExamValidation } from '@/utils/validation/exam';

const resolver = classValidatorResolver(ExamValidation);

const Exam = () => {
  const { control } = useForm<ExamValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
    },
  });
  return (
    <div>
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
      </Stack>
    </div>
  );
};

export default Exam;
