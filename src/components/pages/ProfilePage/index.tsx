'use client';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
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
} from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Country } from 'country-state-city';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { UserService } from '@/api/services/user.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import { generateUserAvatar } from '@/utils/helpers/aws';
import { ChangePasswordValidation, UserProfileFormValidation } from '@/utils/validation/user';

const resolver = classValidatorResolver(UserProfileFormValidation);
const changePasswordResolver = classValidatorResolver(ChangePasswordValidation);

const Profile = ({ sessionUser }: { sessionUser: User }) => {
  const [localImage, setLocalImage] = useState<{ file: File; localUrl: string } | null>(null);
  const { data } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UserProfileFormValidation>({
    defaultValues: {
      firstName: sessionUser?.firstName || '',
      lastName: sessionUser?.lastName || '',
      email: sessionUser?.email || '',
      state: sessionUser?.state || '',
      city: sessionUser?.city || '',
      country: sessionUser?.country || 'Armenia',
      address: sessionUser?.address || '',
    },
    resolver,
  });

  const {
    control: passwordChangeControl,
    handleSubmit: passwordChangeHandlerSubmit,
    reset,
    formState: { errors: changePasswordErrors, isSubmitting: passwordSubmitting },
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
          // todo, need to change aws url
          reqData.avatar = `academy/users/${data?.user?.id || ''}/${localImage?.file.name}`;
          reqData.avatarMimetype = localImage?.file.type;
          const { url } = await UserService.getPreSignedUrl(reqData.avatar);
          await axios.put(url, localImage.file);
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
    [data?.user?.id, localImage, router, t, toast, updateUserProfileMutation],
  );

  const onFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
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
    return generateUserAvatar(data?.user as User);
  }, [localImage?.localUrl, data?.user]);

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
            name={`${data?.user?.firstName} ${data?.user?.lastName}`}
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
            {`${data?.user?.firstName || ''} ${data?.user?.lastName || ''}`}
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
      </Flex>
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
                placeholder={t('firstName')}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={t(errors[name]?.message)}
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
                placeholder={t('lastName')}
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={t(errors[name]?.message)}
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
                placeholder="you@gmail.com"
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={t(errors[name]?.message)}
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
                placeholder="33062 komitas, 5st."
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
                labelName={t('country')}
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
                placeholder={t('enterYourState')}
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
                placeholder={t('enterYourCity')}
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
            width="162px"
            height="53px"
            fontSize="16px"
            isDisabled={!isDirty}
            isLoading={loading}
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
                placeholder={t('currentPassword')}
                value={value}
                handleInputChange={onChange}
                formHelperText={t('passwordValidation')}
                formErrorMessage={t(changePasswordErrors.currentPassword?.message)}
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
                placeholder={t('newPassword')}
                value={value}
                handleInputChange={onChange}
                formHelperText={t('passwordValidation')}
                formErrorMessage={t(changePasswordErrors.newPassword?.message)}
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
                placeholder={t('confirmPassword')}
                value={value}
                handleInputChange={onChange}
                formHelperText={t('passwordValidation')}
                formErrorMessage={t(changePasswordErrors.confirmPassword?.message)}
              />
            )}
          />
        </Flex>
        <Flex alignItems="flex-end" justifyContent="flex-end">
          <Button
            width="162px"
            height="53px"
            fontSize="16px"
            isDisabled={!isDirty}
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
