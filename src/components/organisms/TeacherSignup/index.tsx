import React from 'react';
import { Button, Stack, useToast, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthService } from '@/api/services/auth.service';
import { SubjectService } from '@/api/services/subject.service';
import { Locale } from '@/i18n';
import { ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { TeacherSignUpValidation } from '@/utils/validation';
import { FormInput, Loading, SelectLabel } from '../../atoms';

const resolver = classValidatorResolver(TeacherSignUpValidation);
const TeacherSignUp = ({ lang }: { lang: Locale }) => {
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
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
        title: t('successfullySignedUp'),
        description: t('verifyYourEmail'),
        status: 'success',
        duration: 4000,
        isClosable: false,
      });
      router.push(languagePathHelper(lang, ROUTE_SIGN_IN));
    },
  });

  const onTeacherSubmit: SubmitHandler<TeacherSignUpValidation> = data => {
    mutate(data);
  };

  return (
    <>
      <VStack spacing={32} display="grid" gridTemplateColumns={{ base: '1fr' }}>
        <Loading isLoading={isSubmitting} />
        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                placeholder={'firstName'}
                name="firstName"
                type="text"
                formLabelName={'firstName'}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.firstName?.message}
                formErrorMessage={errors.firstName?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                name="lastName"
                type="text"
                placeholder={'lastName'}
                formLabelName={'lastName'}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.lastName?.message}
                formErrorMessage={errors.lastName?.message}
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
                name="email"
                type="email"
                placeholder={'email'}
                formLabelName={'email'}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.email?.message}
                formErrorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            name="profession"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                placeholder={'profession'}
                name="profession"
                type="text"
                formLabelName={'profession'}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.profession?.message}
                formErrorMessage={errors.profession?.message}
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
                placeholder={'workPlace'}
                name={name}
                type="text"
                formLabelName={'workPlace'}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.workPlace?.message}
                formErrorMessage={errors.workPlace?.message}
              />
            )}
          />
          <Controller
            name="scientificActivity"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                placeholder={'scientificActivity'}
                name={name}
                type="text"
                formLabelName={'scientificActivity'}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.scientificActivity?.message}
                formErrorMessage={errors.scientificActivity?.message}
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
              isRequired
              options={data || []}
              labelName={'teachingSubject'}
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
              isInvalid={!!errors.teachingSubjectId?.message}
              formErrorMessage={errors.teachingSubjectId?.message}
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
                name="password"
                formLabelName={'password'}
                placeholder={'password'}
                value={value}
                handleInputChange={onChange}
                type="password"
                formHelperText={'passwordValidation'}
                isInvalid={!!errors.password?.message}
                formErrorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                name="password"
                formLabelName={'confirmPassword'}
                placeholder={'confirmPassword'}
                value={value}
                handleInputChange={onChange}
                type="password"
                isInvalid={!!errors.confirmPassword?.message}
                formErrorMessage={errors.confirmPassword?.message}
              />
            )}
          />
        </Stack>
      </VStack>
      <VStack spacing={16} paddingTop={48}>
        <Button w={'50%'} onClick={handleSubmit(onTeacherSubmit)} isDisabled={!isValid}>
          {t('signUp')}
        </Button>
      </VStack>
    </>
  );
};

export default TeacherSignUp;
