'use client';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Button as ChakraButton,
  Divider,
  Flex,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Country } from 'country-state-city';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { SubjectService } from '@/api/services/subject.service';
import { UserService } from '@/api/services/user.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import SelectMultiple from '@/components/atoms/SelectMultiple';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { Maybe } from '@/utils/models/common';
import { ChangePasswordValidation, UserProfileFormValidation } from '@/utils/validation/user';

const resolver = classValidatorResolver(UserProfileFormValidation);
const changePasswordResolver = classValidatorResolver(ChangePasswordValidation);

const Profile = ({ sessionUser }: { sessionUser: NonNullable<Session['user']> }) => {
  const [localImage, setLocalImage] = useState<{ file: File; localUrl: string } | null>(null);
  const [localAttachmentImage, setAttachmentLocalImage] =
    useState<Maybe<{ file: File; localUrl: string }>>(null);

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<UserProfileFormValidation>({
    defaultValues: {
      firstName: sessionUser?.firstName || '',
      lastName: sessionUser?.lastName || '',
      email: sessionUser?.email || '',
      state: sessionUser?.state || '',
      city: sessionUser?.city || '',
      country: sessionUser?.country || 'Armenia',
      address: sessionUser?.address || '',
      attachmentKey:
        sessionUser.attachment.find(attachment => attachment.type === 'FILE')?.key || '',
      avatar: sessionUser.attachment.find(attachment => attachment.type === 'AVATAR')?.key || '',
      teachingSubjectIds:
        sessionUser.teacher?.subjectTeachers.map(subjectTeacher => subjectTeacher.subjectId) || [],
    },
    resolver,
  });

  const {
    control: passwordChangeControl,
    handleSubmit: passwordChangeHandlerSubmit,
    reset,
    formState: {
      errors: changePasswordErrors,
      isSubmitting: passwordSubmitting,
      isDirty: isPaswordDirty,
    },
  } = useForm<ChangePasswordValidation>({
    defaultValues: { confirmPassword: '', currentPassword: '', newPassword: '' },
    resolver: changePasswordResolver,
  });

  const { mutateAsync: updateUserProfileMutation } = useMutation<
    number,
    { message: string },
    UserProfileFormValidation
  >({
    mutationFn: UserService.updateUserProfile,
  });

  const { mutate: changePasswordMutation } = useMutation<
    number,
    { message: string },
    ChangePasswordValidation
  >({
    mutationFn: UserService.changeUserPassword,
  });

  const onSubmit: SubmitHandler<UserProfileFormValidation> = useCallback(
    async payload => {
      setIsLoading(true);
      const reqData = { ...payload };
      try {
        if (localImage) {
          const key = `academy/users/${sessionUser.id || ''}/${localImage?.file.name}`;
          reqData.avatarMimetype = localImage?.file.type;
          reqData.avatar = key;

          const { url } = await UserService.getPreSignedUrl(key);
          await axios.put(url, localImage.file);
        }
        if (localAttachmentImage) {
          const attachmentId = uuid();
          const key = `students/${attachmentId}/attachments/${Date.now()}_${localAttachmentImage.file.name}`;
          reqData.attachmentMimetype = localImage?.file.type;
          reqData.attachmentKey = key;

          const { url } = await UserService.getPreSignedUrl(key);
          await axios.put(url, localAttachmentImage.file);
        }
        await updateUserProfileMutation(reqData, {
          onSuccess: () => toast({ title: t('success'), status: 'success' }),
        });
      } catch (error) {
        console.log(error);
      } finally {
        router.refresh();
        setIsLoading(false);
      }
    },
    [localAttachmentImage, localImage, router, sessionUser.id, t, toast, updateUserProfileMutation],
  );

  const onFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  }, []);

  const onAttachmentFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setAttachmentLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  }, []);

  const onPasswordChangeSubmit: SubmitHandler<ChangePasswordValidation> = useCallback(
    data => {
      changePasswordMutation(data, {
        onSuccess: () => {
          toast({ title: t('passwordIsChanged'), status: 'success' });
          reset();
        },
      });
    },
    [changePasswordMutation, reset, t, toast],
  );

  const loading = isSubmitting || passwordSubmitting || isLoading;

  const avatarSrc = useMemo(() => {
    if (localImage?.localUrl) {
      return localImage.localUrl;
    }

    return generateAWSUrl(
      sessionUser?.attachment.find(attachment => attachment.type === 'AVATAR')?.key || '',
    );
  }, [localImage?.localUrl, sessionUser?.attachment]);

  const attachmentSrc = useMemo(() => {
    if (localAttachmentImage?.localUrl) {
      return localAttachmentImage.localUrl;
    }

    return generateAWSUrl(
      sessionUser?.attachment.find(attachment => attachment.type === 'AVATAR')?.key || '',
    );
  }, [localAttachmentImage?.localUrl, sessionUser?.attachment]);

  const handleRemoveImage = () => {
    setAttachmentLocalImage(null);
  };

  const { data: subjectList } = useQuery({
    queryKey: ['subject-list'],
    queryFn: SubjectService.list,
  });

  const subjectData = useMemo(
    () =>
      (subjectList || [])?.map(subject => ({
        id: subject.id,
        title: subject.title,
      })),
    [subjectList],
  );
  const selectedSubjectIds = watch('teachingSubjectIds');

  const selectedSubjects = useMemo(
    () => subjectData.filter(subject => selectedSubjectIds.includes(subject.id)),
    [subjectData, selectedSubjectIds],
  );

  const removeSubjectHandler = useCallback(
    (id: string) => {
      const updatedValues = selectedSubjectIds.filter(subjectId => subjectId !== id);
      setValue('teachingSubjectIds', updatedValues);
    },
    [selectedSubjectIds, setValue],
  );

  console.log({ isPaswordDirty });

  return (
    <Box
      width="700px"
      margin="0 auto"
      p={{ base: '20px 16px 30px 16px', md: '96px 16px 159px 16px', xl: '96px 0 159px 0' }}>
      <Text
        display={{ base: 'none', sm: 'block' }}
        textAlign="center"
        as="h3"
        width="100%"
        fontSize="44px"
        fontWeight={700}
        lineHeight="normal">
        {t('editProfile')}
      </Text>
      <Flex
        gap={16}
        textAlign="center"
        paddingTop={{ base: '0', sm: '40px' }}
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'center', md: 'flex-start' }}>
        <Box borderRadius="50%" overflow="hidden" position="relative" width="101px" height="101px">
          <Avatar
            name={`${sessionUser.firstName} ${sessionUser.lastName}`}
            src={avatarSrc}
            bg="#F3F4F6"
            color="#C0C0C0"
            size="xl"
          />
        </Box>

        <Box>
          <Text
            fontSize={{ base: '16px', sm: '24px' }}
            fontWeight={700}
            lineHeight="normal"
            m={{ base: '0 0 8px 0', sm: '0 0 16px 0' }}>
            {`${sessionUser?.firstName || ''} ${sessionUser?.lastName || ''}`}
          </Text>
          <Box
            cursor="pointer"
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="22px">
            <ChakraButton
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
              <Controller
                name="avatar"
                control={control}
                rules={{ required: t('fieldIsRequired') }}
                render={({ field: { onChange, name } }) => (
                  <Input
                    as="input"
                    name={name}
                    type="file"
                    width="100%"
                    position="absolute"
                    left={0}
                    right={0}
                    bottom={0}
                    opacity={0}
                    cursor="pointer"
                    onChange={e => {
                      onFileSelect(e);
                      onChange(e);
                    }}
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
                )}
              />
              {t('changeAvatar')}
            </ChakraButton>
          </Box>
        </Box>
        <VStack alignItems="flex-start" justifyItems="flex-end">
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
                onChange={onAttachmentFileSelect}
                value={localAttachmentImage?.localUrl ? '' : undefined}
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
          {attachmentSrc && (
            <Box
              position="relative"
              width="200px"
              height="150px"
              borderRadius="8px"
              ml="30px"
              overflow="hidden">
              <Image
                src={attachmentSrc || ''}
                alt={localAttachmentImage?.file.name || ''}
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
      </Flex>
      {sessionUser.teacher && (
        <>
          <Flex my="20px">
            <Controller
              name="teachingSubjectIds"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectMultiple
                  placeholder="Select subjects"
                  isRequired
                  label="teachingSubjects"
                  value={value}
                  options={subjectData}
                  onChange={onChange}
                  isInvalid={!!errors.teachingSubjectIds?.message}
                  formErrorMessage={errors.teachingSubjectIds?.message}
                />
              )}
            />
          </Flex>
          <Flex flexDirection="column" gap="10px">
            {selectedSubjects.map(subject => (
              <Flex key={subject.id} gap="10px" alignItems="center">
                <DeleteIcon
                  color="red"
                  onClick={removeSubjectHandler.bind(null, subject.id)}
                  style={{ cursor: 'pointer' }}
                />
                <Box>{subject.title} </Box>
              </Flex>
            ))}
          </Flex>
        </>
      )}
      <Flex paddingTop={{ base: '36px', md: '40px' }} flexDirection="column" gap={24}>
        <Flex gap="24px" flexDirection={{ base: 'column', lg: 'row' }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                name="firstName"
                type="text"
                formLabelName={t('firstName')}
                placeholder="firstName"
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                name="lastName"
                type="text"
                formLabelName={t('lastName')}
                value={value}
                placeholder="lastName"
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
        </Flex>
        <Flex gap="24px" flexDirection={{ base: 'column', lg: 'row' }}>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                name="email"
                type="email"
                formLabelName={t('email')}
                placeholder="mailPlaceholder"
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                name="address"
                type="text"
                formLabelName={t('address')}
                placeholder="addressPlaceholder"
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
        </Flex>

        <Flex gap="24px" flexDirection={{ base: 'column', lg: 'row' }}>
          <Controller
            name="country"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectLabel
                options={Country.getAllCountries() as any[]}
                labelName="country"
                valueLabel="name"
                nameLabel="name"
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                name="state"
                type="text"
                formLabelName={t('state')}
                placeholder="enterYourState"
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                name="city"
                type="text"
                formLabelName={t('city')}
                placeholder="enterYourCity"
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
        </Flex>
        <Flex alignItems="flex-end" justifyContent="flex-end">
          <Button
            height="53px"
            fontSize="16px"
            isDisabled={isSubmitting || !isValid || !isDirty}
            isLoading={loading}
            overflow="break-word"
            whiteSpace="normal"
            onClick={handleSubmit(onSubmit)}>
            {t('saveChanges')}
          </Button>
        </Flex>
      </Flex>
      <Divider paddingTop={{ base: '36px', md: '40px' }} />
      <Flex flexDirection="column" gap={24} mt={{ base: '12px', md: '40px' }}>
        <Text color="#000" fontSize={28} fontWeight={700}>
          {t('privateSettings')}
        </Text>
        <Flex gap={24} flexDirection="column">
          <Controller
            name="currentPassword"
            control={passwordChangeControl}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                isInvalid={!!changePasswordErrors.currentPassword?.message}
                name={name}
                type="password"
                formLabelName={t('currentPassword')}
                placeholder="currentPassword"
                value={value}
                handleInputChange={onChange}
                formHelperText="passwordValidation"
                formErrorMessage={changePasswordErrors.currentPassword?.message}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={passwordChangeControl}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                isInvalid={!!changePasswordErrors.newPassword?.message}
                name={name}
                type="password"
                formLabelName={t('newPassword')}
                placeholder="newPassword"
                value={value}
                handleInputChange={onChange}
                formHelperText="passwordValidation"
                formErrorMessage={changePasswordErrors.newPassword?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={passwordChangeControl}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                isInvalid={!!changePasswordErrors.confirmPassword?.message}
                name={name}
                type="password"
                formLabelName={t('confirmPassword')}
                placeholder="confirmPassword"
                value={value}
                handleInputChange={onChange}
                formHelperText="passwordValidation"
                formErrorMessage={changePasswordErrors.confirmPassword?.message}
              />
            )}
          />
        </Flex>
        <Flex alignItems="flex-end" justifyContent="flex-end">
          <Button
            height="53px"
            fontSize="16px"
            isDisabled={isSubmitting || !isPaswordDirty}
            isLoading={loading}
            onClick={passwordChangeHandlerSubmit(onPasswordChangeSubmit)}>
            {t('changePassword')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Profile;
