import React, { ChangeEvent, memo, useState } from 'react';
import {
  Box,
  Button,
  Button as ChakraButton,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { AuthService } from '@/api/services/auth.service';
import { FacultyService } from '@/api/services/faculty.service';
import { StudentGradeGroupService } from '@/api/services/student-grade-group.service';
import { StudentGradeService } from '@/api/services/student-grade.service';
import { UserService } from '@/api/services/user.service';
import { Locale } from '@/i18n';
import { ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { StudentSignUpValidation } from '@/utils/validation';
import { FormInput, SelectLabel } from '../../atoms';

const resolver = classValidatorResolver(StudentSignUpValidation);

const fetchFormData = async () => {
  try {
    const [studentGradeList, studentGradeGroupList, facultyList] = await Promise.all([
      StudentGradeService.list(),
      StudentGradeGroupService.list(),
      FacultyService.list(),
    ]);
    return { studentGradeList, studentGradeGroupList, facultyList };
  } catch {
    console.error();
  }
};

const StudentSignUp = ({ lang }: { lang: Locale }) => {
  const router = useRouter();
  const toast = useToast();
  const [localImage, setLocalImage] = useState<{ file: File; localUrl: string } | null>(null);
  const t = useTranslations();
  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.studentSignUp,
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

  const onStudentSubmit: SubmitHandler<StudentSignUpValidation> = async data => {
    if (localImage) {
      const attachmentId = uuid();
      const key = `students/${attachmentId}/attachments/${Date.now()}_${localImage.file.name}`;
      const { url } = await UserService.getPreSignedUrl(key);
      await axios.put(url, localImage.file);
      mutate({
        ...data,
        attachment: {
          mimetype: localImage.file.type,
          title: localImage.file.name,
          key,
          attachmentKey: attachmentId,
        },
      });
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSignUpValidation>({
    resolver,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      studentGradeId: '',
      facultyId: '',
      studentGradeGroupId: '',
      attachment: {
        mimetype: '',
        key: '',
        title: '',
      },
    },
  });

  const { data } = useQuery({
    queryKey: ['faculty', 'student-grade', 'student-grade-group'],
    queryFn: fetchFormData,
  });

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  };

  const handleRemoveImage = () => {
    setLocalImage(null);
  };

  return (
    <>
      <VStack
        spacing={{ base: '16px', sm: '32px' }}
        display="grid"
        gridTemplateColumns={{ base: '1fr' }}>
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
              />
            )}
          />
          <Controller
            name="studentGradeId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                isRequired
                name={name}
                options={data?.studentGradeList || []}
                labelName={t('studentGrade')}
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
                isInvalid={!!errors.studentGradeId?.message}
                formErrorMessage={errors.studentGradeId?.message}
              />
            )}
          />
        </Stack>

        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
          <Controller
            name="facultyId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                isRequired
                name={name}
                options={data?.facultyList || []}
                labelName={t('faculty')}
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
                isInvalid={!!errors.facultyId?.message}
                formErrorMessage={errors.facultyId?.message}
              />
            )}
          />
          <Controller
            name="studentGradeGroupId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={data?.studentGradeGroupList || []}
                labelName={t('courseGroup')}
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value || ''}
                formHelperText="You can skip choosing this field"
              />
            )}
          />
        </Stack>

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
                formLabelName={t('confirmPassword')}
                placeholder={t('confirmPassword')}
                value={value}
                handleInputChange={onChange}
                type="password"
              />
            )}
          />
        </Stack>
        <VStack alignItems="flex-start">
          <Box
            cursor="pointer"
            position="relative"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            height="22px"
            ml="5px">
            <ChakraButton
              fontWeight={500}
              height="100%"
              width="auto"
              cursor="pointer"
              color="#1F1646"
              backgroundColor="#fff"
              _hover={{
                color: '#1F1646',
                backgroundColor: '#fff',
              }}
              _focus={{
                color: '#1F1646',
                backgroundColor: '#fff',
              }}>
              <Input
                as="input"
                name="attachments"
                type="file"
                width="100%"
                position="absolute"
                left={0}
                right={0}
                bottom={0}
                opacity={0}
                cursor="pointer"
                onChange={onFileSelect}
                color="#1F1646"
                backgroundColor="#fff"
                _hover={{
                  color: '#1F1646',
                  backgroundColor: '#fff',
                }}
                _focus={{
                  color: '#1F1646',
                  backgroundColor: '#fff',
                }}
              />
              {t('uploadDocument')}
            </ChakraButton>
          </Box>
          {localImage?.localUrl && (
            <Box
              position="relative"
              width="200px"
              height="150px"
              border="1px solid #ccc"
              borderRadius="8px"
              ml="30px"
              overflow="hidden"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)">
              <Image
                src={localImage?.localUrl || ''}
                alt={localImage?.file.name || ''}
                fill
                style={{
                  objectFit: 'cover',
                }}
              />
              <Text
                position="absolute"
                top="5px"
                right="5px"
                backgroundColor="rgba(0, 0, 0, 0.6)"
                color="white"
                borderRadius="50%"
                width="32px"
                height="32px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                onClick={handleRemoveImage}>
                X
              </Text>
            </Box>
          )}
        </VStack>
      </VStack>
      <VStack spacing={16} paddingTop={48}>
        <Button w={'50%'} onClick={handleSubmit(onStudentSubmit)} isLoading={isPending}>
          {t('signUp')}
        </Button>
      </VStack>
    </>
  );
};

export default memo(StudentSignUp);
