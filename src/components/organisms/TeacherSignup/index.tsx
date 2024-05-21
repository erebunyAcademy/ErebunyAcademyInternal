import React from 'react';
import { Button, Stack, useToast, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthService } from '@/api/services/auth.service';
import { SubjectService } from '@/api/services/subject.service';
import { ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { TeacherSignUpValidation } from '@/utils/validation';
import { FormInput, SelectLabel } from '../../atoms';
import { Locale } from '@/i18n';
import { languagePathHelper } from '@/utils/helpers/language';

const resolver = classValidatorResolver(TeacherSignUpValidation);
// todo for me
const TeacherSignUp = ({ lang }: { lang: Locale }) => {
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations();

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
                placeholder={t('user.firstName')}
                isInvalid={!!errors.firstName?.message}
                name="firstName"
                type="text"
                formLabelName={t('user.firstName')}
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
                placeholder={t('user.lastName')}
                formLabelName={t('user.lastName')}
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
                placeholder={t('user.email')}
                formLabelName={t('user.email')}
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
                placeholder={t('user.profession')}
                isInvalid={!!errors.firstName?.message}
                name="firstName"
                type="text"
                formLabelName={t('user.profession')}
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
                placeholder={t('user.workPlace')}
                isInvalid={!!errors.firstName?.message}
                name={name}
                type="text"
                formLabelName={t('user.workPlace')}
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
                placeholder={t('user.scientificActivity')}
                isInvalid={!!errors.firstName?.message}
                name={name}
                type="text"
                formLabelName={t('user.scientificActivity')}
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
              labelName={t('user.teachingSubject')}
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
                formLabelName={t('common.password')}
                placeholder={t('common.password')}
                value={value}
                handleInputChange={onChange}
                type="password"
                formHelperText={t('validations.passwordValidation')}
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
                formLabelName={t('common.confirmPassword')}
                placeholder={t('common.confirmPassword')}
                value={value}
                handleInputChange={onChange}
                type="password"
              />
            )}
          />
        </Stack>
      </VStack>
      <VStack spacing={16} paddingTop={48}>
        <Button w={'50%'} onClick={handleSubmit(onTeacherSubmit)}>
          {t('common.signUp')}
        </Button>
      </VStack>
    </>
  );
};

export default TeacherSignUp;
