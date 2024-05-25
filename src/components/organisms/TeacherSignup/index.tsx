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
import { FormInput, SelectLabel } from '../../atoms';

const resolver = classValidatorResolver(TeacherSignUpValidation);
// todo for me
const TeacherSignUp = ({ lang }: { lang: Locale }) => {
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
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
      router.push(languagePathHelper(lang, ROUTE_SIGN_IN));
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
                placeholder={t('firstName')}
                isInvalid={!!errors.firstName?.message}
                name="firstName"
                type="text"
                formLabelName={t('firstName')}
                value={value}
                handleInputChange={onChange}
                formErrorMessage={t(errors.firstName?.message)}
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
                placeholder={t('lastName')}
                formLabelName={t('lastName')}
                value={value}
                handleInputChange={onChange}
                formErrorMessage={t(errors.lastName?.message)}
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
                placeholder={t('email')}
                formLabelName={t('email')}
                value={value}
                handleInputChange={onChange}
                formErrorMessage={t(errors.email?.message)}
              />
            )}
          />
          <Controller
            name="profession"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                placeholder={t('profession')}
                name="profession"
                type="text"
                formLabelName={t('profession')}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.profession?.message}
                formErrorMessage={t(errors.profession?.message)}
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
                placeholder={t('workPlace')}
                name={name}
                type="text"
                formLabelName={t('workPlace')}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.workPlace?.message}
                formErrorMessage={t(errors.workPlace?.message)}
              />
            )}
          />
          <Controller
            name="scientificActivity"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                placeholder={t('scientificActivity')}
                isInvalid={!!errors.scientificActivity?.message}
                name={name}
                type="text"
                formLabelName={t('scientificActivity')}
                value={value}
                handleInputChange={onChange}
                formErrorMessage={t(errors.scientificActivity?.message)}
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
              isInvalid={!!errors.teachingSubjectId?.message}
              options={data || []}
              labelName={t('teachingSubject')}
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
              formErrorMessage={t(errors.teachingSubjectId?.message)}
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
                formLabelName={t('password')}
                placeholder={t('password')}
                value={value}
                handleInputChange={onChange}
                type="password"
                formHelperText={t('passwordValidation')}
                formErrorMessage={t(errors.password?.message)}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormInput
                isRequired
                isInvalid={!!errors.confirmPassword?.message}
                name="password"
                formLabelName={t('confirmPassword')}
                placeholder={t('confirmPassword')}
                value={value}
                handleInputChange={onChange}
                type="password"
                formErrorMessage={t(errors.confirmPassword?.message)}
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
