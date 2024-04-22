'use client';
import React, { FC, useCallback, useState } from 'react';
import { Flex, FormControl } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { OfflineCourseService } from '@/api/services/OfflineCourseService';
import { Button, FormInput, Loading, PhoneNumberInput } from '@/components/atoms';
import SuccessMessageToast from '@/components/atoms/SuccessMessageToast';
import { ApplyOfflineCourseFormValidation } from '@/utils/validation/apply-offline-course';

type ApplyCourseProps = { offlineCourseId: number };

const resolver = classValidatorResolver(ApplyOfflineCourseFormValidation);

const defaultValues = {
  name: '',
  phone: '',
  email: '',
};

const ApplyCourse: FC<ApplyCourseProps> = ({ offlineCourseId }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyOfflineCourseFormValidation>({ defaultValues, resolver });

  const { mutate, isLoading } = useMutation<
    boolean,
    { message: string },
    ApplyOfflineCourseFormValidation
  >(data => OfflineCourseService.applyOfflineCourse(offlineCourseId, data), {
    onSuccess: () => {
      reset();
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    },
  });

  const submitHandler = useCallback(
    (data: ApplyOfflineCourseFormValidation) => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <>
      <form style={{ width: '100%' }} onSubmit={handleSubmit(submitHandler)}>
        {isLoading && <Loading />}
        <Flex
          width="100%"
          alignItems="end"
          gap="20px"
          mb="40px"
          flexWrap="wrap"
          justifyContent="center">
          <FormControl
            maxWidth={{
              base: '335px ',
              xl: ' 285px',
            }}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  name={name}
                  type="text"
                  formLabelName="Name"
                  placeholder="Enter your name"
                  value={value}
                  handleInputChange={onChange}
                  isInvalid={!!errors[name]?.message}
                  formErrorMessage={errors[name]?.message}
                />
              )}
            />
          </FormControl>

          <FormControl
            maxWidth={{
              base: '335px ',
              xl: ' 285px',
            }}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  name={name}
                  type="text"
                  formLabelName="Email"
                  placeholder="you@example.com"
                  value={value}
                  handleInputChange={onChange}
                  isInvalid={!!errors[name]?.message}
                  formErrorMessage={errors[name]?.message}
                />
              )}
            />
          </FormControl>

          <FormControl
            maxWidth={{
              base: '335px ',
            }}>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field: { onChange, value } }) => (
                <PhoneNumberInput
                  onChange={onChange}
                  value={value}
                  isRequired
                  formLabelName="Phone Number"
                />
              )}
            />
          </FormControl>
          <Button
            type="submit"
            lineHeight="21.28px"
            fontSize="16px"
            padding="16px 32px"
            width={{ base: '100%', lg: '235px' }}
            height="42px">
            Apply
          </Button>
        </Flex>
      </form>
      {showSuccessMessage && <SuccessMessageToast />}
    </>
  );
};

export default ApplyCourse;
