import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import {
  Box,
  Button as ChakraButton,
  HStack,
  Input,
  Stack,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { AuthService } from '@/api/services/auth.service';
import { FacultyService } from '@/api/services/faculty.service';
import { StudentGradeGroupService } from '@/api/services/student-grade-group.service';
import { StudentGradeService } from '@/api/services/student-grade.service';
import { UserService } from '@/api/services/user.service';
import { SIGN_IN_ROUTE } from '@/utils/constants/routes';
import { StudentSignUpValidation } from '@/utils/validation';
import { Button, FormInput, SelectLabel } from '../../atoms';

const resolver = classValidatorResolver(StudentSignUpValidation);

const fetchFormData = async () => {
  try {
    const [studentGradeList, studentGradeGroupList, facultyList] = await Promise.all([
      StudentGradeService.getStudentGradeList(),
      StudentGradeGroupService.getStudentGradeGroupList(),
      FacultyService.facultyList(),
    ]);
    return { studentGradeList, studentGradeGroupList, facultyList };
  } catch {
    console.error();
  }
};

const StudentSignUp = () => {
  const router = useRouter();
  const toast = useToast();
  const [localImage, setLocalImage] = useState<{ file: File; localUrl: string } | null>(null);
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
      router.push(SIGN_IN_ROUTE);
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
    reset,
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

  const { data, isSuccess } = useQuery({
    queryKey: ['faculty', 'student-grade', 'student-grade-group'],
    queryFn: fetchFormData,
  });

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      reset({
        facultyId: data?.facultyList[0].id,
        studentGradeId: data?.studentGradeList[0].id,
        studentGradeGroupId: data?.studentGradeGroupList[0].id,
      });
    }
  }, [data?.facultyList, data?.studentGradeGroupList, data?.studentGradeList, isSuccess, reset]);

  console.log(errors);

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
                placeholder="First Name"
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
                placeholder="Last Name"
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
            name="studentGradeId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={data?.studentGradeList || []}
                labelName="Student grade"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>

        <Stack direction={{ base: 'column', md: 'row' }} gap={{ base: '16px', sm: '8px' }}>
          <Controller
            name="studentGradeGroupId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={data?.studentGradeGroupList || []}
                labelName="Course group"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            name="facultyId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={data?.facultyList || []}
                labelName="Faculty"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
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
        <HStack>
          <Box
            cursor="pointer"
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="22px"
            ml="5px">
            <ChakraButton
              fontWeight={500}
              height="100%"
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
              Upload document
            </ChakraButton>
          </Box>
        </HStack>
      </VStack>
      <VStack spacing={16} paddingTop={48}>
        <Button w={'50%'} onClick={handleSubmit(onStudentSubmit)} isLoading={isPending}>
          Sign up
        </Button>
      </VStack>
    </>
  );
};

export default memo(StudentSignUp);
