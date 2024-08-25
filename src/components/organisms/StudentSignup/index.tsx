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
import { CourseGroupService } from '@/api/services/course-group.service';
import { CourseService } from '@/api/services/courses.service';
import { FacultyService } from '@/api/services/faculty.service';
import { UserService } from '@/api/services/user.service';
import { Locale } from '@/i18n';
import { ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { Maybe } from '@/utils/models/common';
import { StudentSignUpValidation } from '@/utils/validation';
import { FormInput, Loading, SelectLabel } from '../../atoms';

const resolver = classValidatorResolver(StudentSignUpValidation);

const fetchFormData = async () => {
  try {
    const [courseList, courseGroupList, facultyList] = await Promise.all([
      CourseService.list(),
      CourseGroupService.list(),
      FacultyService.list(),
    ]);
    return { courseList, courseGroupList, facultyList };
  } catch {
    console.error();
  }
};

const StudentSignUp = ({ lang }: { lang: Locale }) => {
  const router = useRouter();
  const toast = useToast();
  const [localImage, setLocalImage] = useState<Maybe<{ file: File; localUrl: string }>>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();
  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.studentSignUp,
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

  const onStudentSubmit: SubmitHandler<StudentSignUpValidation> = async data => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StudentSignUpValidation>({
    resolver,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      courseId: '',
      facultyId: '',
      courseGroupId: '',
      attachment: {
        mimetype: '',
        key: '',
        title: '',
      },
    },
  });

  const { data } = useQuery({
    queryKey: ['faculty', 'course', 'course-group'],
    queryFn: fetchFormData,
  });

  const courseList = (data?.courseList || []).map(course => ({
    id: course.id,
    title: `${course.title}`,
  }));

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
      <Loading isLoading={isLoading} />
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
                placeholder="firstName"
                name="firstName"
                type="text"
                formLabelName={t('firstName')}
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
                placeholder="lastName"
                formLabelName={t('lastName')}
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
                placeholder="mailPlaceholder"
                formLabelName={t('email')}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.email?.message}
                formErrorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            name="facultyId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                isRequired
                name={name}
                options={data?.facultyList || []}
                labelName="faculty"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
                isInvalid={!!errors.facultyId?.message}
                formErrorMessage={errors.facultyId?.message}
              />
            )}
          />
        </Stack>

        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
          <Controller
            name="courseId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                isRequired
                name={name}
                options={courseList}
                labelName="course"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
                isInvalid={!!errors.courseId?.message}
                formErrorMessage={errors.courseId?.message}
              />
            )}
          />
          <Controller
            name="courseGroupId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={data?.courseGroupList || []}
                labelName="courseGroup"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value || ''}
                formErrorMessage={errors.courseGroupId?.message}
                isInvalid={!!errors.courseGroupId?.message}
                formHelperText={'courseGroupNotRequired'}
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
                name="password"
                formLabelName={t('password')}
                placeholder="password"
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
                formLabelName={t('confirmPassword')}
                placeholder="confirmPassword"
                value={value}
                handleInputChange={onChange}
                type="password"
                isInvalid={!!errors.confirmPassword?.message}
                formErrorMessage={errors.confirmPassword?.message}
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
                accept="image/*"
                width="100%"
                position="absolute"
                left={0}
                right={0}
                bottom={0}
                opacity={0}
                cursor="pointer"
                onChange={onFileSelect}
                value={localImage?.localUrl ? '' : undefined}
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
              {t('uploadDocument')}*
            </ChakraButton>
          </Box>
          {localImage?.localUrl && (
            <Box
              position="relative"
              width="200px"
              height="150px"
              borderRadius="8px"
              ml="30px"
              overflow="hidden">
              <Image
                src={localImage?.localUrl || ''}
                alt={localImage?.file.name || ''}
                fill
                style={{
                  objectFit: 'contain',
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
        <Button
          w={'50%'}
          onClick={handleSubmit(onStudentSubmit)}
          isLoading={isPending}
          isDisabled={!isValid}>
          {t('signUp')}
        </Button>
      </VStack>
    </>
  );
};

export default memo(StudentSignUp);
