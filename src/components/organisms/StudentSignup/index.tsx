import React, { ChangeEvent, memo, useState } from 'react';
import { Box, Button as ChakraButton, HStack, Input, Stack, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { FacultyService } from '@/api/faculty.service';
import { StudentGradeGroupService } from '@/api/student-grade-group.service';
import { StudentGradeService } from '@/api/student-grade.service';
import { UserService } from '@/api/user.service';
import { StudentSignUpValidation } from '@/utils/validation';
import { Button, FormInput, SelectLabel } from '../../atoms';

const resolver = classValidatorResolver(StudentSignUpValidation);

const StudentSignUp = () => {
  const [localImage, setLocalImage] = useState<{ file: File; localUrl: string } | null>(null);
  const { mutate } = useMutation({ mutationFn: UserService.studentSignUp });

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
      attachment: {
        mimetype: '',
        key: '',
        title: '',
      },
    },
  });

  const { data: studentGradeList } = useQuery({
    queryKey: ['student-grade'],
    queryFn: StudentGradeService.getStudentGradeList,
  });

  const { data: studentGradeGroupList } = useQuery({
    queryKey: ['student-grade-group'],
    queryFn: StudentGradeGroupService.getStudentGradeGroupList,
  });

  const { data: facultyList } = useQuery({
    queryKey: ['faculty'],
    queryFn: FacultyService.facultyList,
  });

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
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
                options={studentGradeList || []}
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
                options={studentGradeGroupList || []}
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
                options={facultyList || []}
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
        <Button w={'50%'} onClick={handleSubmit(onStudentSubmit)}>
          Sign up
        </Button>
      </VStack>
    </>
  );
};

export default memo(StudentSignUp);
