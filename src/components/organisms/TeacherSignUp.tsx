import React, { memo } from 'react';
import { HStack, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { UserService } from '@/api/user.service';
import { TeacherSignUpValidation } from '@/utils/validation';
import { Button, FormInput } from '../atoms';

const resolver = classValidatorResolver(TeacherSignUpValidation);

const TeacherSignUp = () => {
  const teacherSignUp = useMutation({ mutationFn: UserService.teacherSignUp });

  const onTeacherSubmit: SubmitHandler<TeacherSignUpValidation> = data => {
    teacherSignUp.mutate(data);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSignUpValidation>({
    resolver,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      profession: '',
      workPlace: '',
      scientificActivity: '',
    },
  });

  return (
    <>
      <VStack spacing={32} display="grid" gridTemplateColumns={{ base: '1fr' }}>
        <HStack>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                placeholder="First name"
                isInvalid={!!errors.firstName?.message}
                name="firstName"
                type="text"
                formLabelName="First Name"
                value={value}
                handleInputChange={onChange}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                isInvalid={!!errors.lastName?.message}
                name="lastName"
                type="text"
                placeholder="Last name"
                formLabelName="Last name"
                value={value}
                handleInputChange={onChange}
              />
            )}
          />
        </HStack>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors.email?.message}
              name="email"
              type="email"
              placeholder="Email"
              formLabelName="Email"
              value={value}
              handleInputChange={onChange}
            />
          )}
        />
        <HStack>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                isInvalid={!!errors.password?.message}
                name="password"
                formLabelName="Password"
                placeholder="Password"
                value={value}
                handleInputChange={onChange}
                type="password"
                formHelperText="Your password must be less than 6 characters."
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                isInvalid={!!errors.password?.message}
                name="password"
                formLabelName="Confirm passoword"
                placeholder="Confirm password"
                value={value}
                handleInputChange={onChange}
                type="password"
                formHelperText="Your password must be less than 6 characters."
              />
            )}
          />
        </HStack>

        <Controller
          name="profession"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormInput
              isRequired
              placeholder="Profession"
              isInvalid={!!errors.firstName?.message}
              name="firstName"
              type="text"
              formLabelName="Profession"
              value={value}
              handleInputChange={onChange}
            />
          )}
        />
        <Controller
          name="workPlace"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              placeholder="Working place"
              isInvalid={!!errors.firstName?.message}
              name={name}
              type="text"
              formLabelName="Working place"
              value={value}
              handleInputChange={onChange}
            />
          )}
        />
        <Controller
          name="scientificActivity"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              placeholder="Scientific activity"
              isInvalid={!!errors.firstName?.message}
              name={name}
              type="text"
              formLabelName="Scientific activity"
              value={value}
              handleInputChange={onChange}
            />
          )}
        />
      </VStack>
      <VStack spacing={16} paddingTop={48}>
        <Button w={'50%'} onClick={handleSubmit(onTeacherSubmit)}>
          Sign up
        </Button>
      </VStack>
    </>
  );
};

export default memo(TeacherSignUp);
