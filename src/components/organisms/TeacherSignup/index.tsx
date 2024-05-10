import React from 'react';
import { Button, Stack, useToast, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthService } from '@/api/services/auth.service';
import { SubjectService } from '@/api/services/subject.service';
import { SIGN_IN_ROUTE } from '@/utils/constants/routes';
import { TeacherSignUpValidation } from '@/utils/validation';
import { FormInput, SelectLabel } from '../../atoms';

const resolver = classValidatorResolver(TeacherSignUpValidation);

const TeacherSignUp = () => {
  const toast = useToast();
  const router = useRouter();

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
      teachingSubjectId: '',
    },
  });

  const { data } = useQuery({
    queryKey: [],
    queryFn: SubjectService.list,
  });

  const { mutate } = useMutation({
    mutationFn: AuthService.teacherSignUp,
    onSuccess() {
      toast({
        title: 'You have successfully signed up.',
        description: 'Please verify your email.',
        status: 'success',
        duration: 4000,
        isClosable: false,
      });
      router.push(SIGN_IN_ROUTE);
    },
  });

  const onTeacherSubmit: SubmitHandler<TeacherSignUpValidation> = data => {
    mutate(data);
  };

  return (
    <>
      <VStack spacing={32} display="grid" gridTemplateColumns={{ base: '1fr' }}>
        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
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
                formLabelName="Last Name"
                value={value}
                handleInputChange={onChange}
              />
            )}
          />
        </Stack>

        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
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
        </Stack>

        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
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
        </Stack>
        <Controller
          name="teachingSubjectId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              options={data || []}
              labelName="Teaching Subject"
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
            />
          )}
        />
        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
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
                formHelperText="Your password must not be less than 6 characters."
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
                formLabelName="Confirm password"
                placeholder="Confirm password"
                value={value}
                handleInputChange={onChange}
                type="password"
              />
            )}
          />
        </Stack>
      </VStack>
      <VStack spacing={16} paddingTop={48}>
        <Button w={'100%'} onClick={handleSubmit(onTeacherSubmit)}>
          Sign up
        </Button>
      </VStack>
    </>
  );
};

export default TeacherSignUp;
