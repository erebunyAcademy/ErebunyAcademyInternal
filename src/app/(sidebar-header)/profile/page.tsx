'use client';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Button as ChakraButton, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Country } from 'country-state-city';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { UserService } from '@/api/services/user.service';
import { Button, FormInput, Loading } from '@/components/atoms';
import PhoneNumberInput from '@/components/atoms/PhoneNumberInput';
import SelectLabel from '@/components/atoms/SelectLabel';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { ChangePasswordValidation, UserProfileFormValidation } from '@/utils/validation/user';

const resolver = classValidatorResolver(UserProfileFormValidation);
const changePasswordResolver = classValidatorResolver(ChangePasswordValidation);

const Profile = () => {
  const toast = useToast();

  const sessionUser: User = {};

  const [localImage, setLocalImage] = useState<{ file: File; localUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      firstName: sessionUser?.firstName || '',
      lastName: sessionUser?.lastName || '',
      email: sessionUser?.email || '',
      state: sessionUser?.state || '',
      city: sessionUser?.city || '',
      country: sessionUser?.country || 'Armenia',
      phone: sessionUser?.phone || '',
      address: sessionUser?.address || '',
      avatar: sessionUser?.avatar || localImage?.localUrl || '',
    }),
    [
      localImage?.localUrl,
      sessionUser?.address,
      sessionUser?.avatar,
      sessionUser?.city,
      sessionUser?.country,
      sessionUser?.email,
      sessionUser?.firstName,
      sessionUser?.lastName,
      sessionUser?.phone,
      sessionUser?.state,
    ],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UserProfileFormValidation>({ defaultValues, resolver });

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

  const { mutateAsync: changePasswordMutation } = useMutation<
    number,
    { message: string },
    ChangePasswordValidation
  >({
    mutationFn: UserService.changeUserPassword,
  });

  const onSubmit: SubmitHandler<UserProfileFormValidation> = useCallback(
    data => {
      (async () => {
        setIsLoading(true);
        try {
          let avatar = data.avatar;
          if (localImage) {
            avatar = `users/${sessionUser?.id}/${localImage?.file.name}`;
            const { url } = await UserService.getPreSignedUrl(avatar);
            await axios.put(url, localImage.file);
          }

          await updateUserProfileMutation({ ...data, avatar });
          toast({ title: 'Success', status: 'success' });
        } catch (error) {
          console.log(error);
        } finally {
          timeout.current = setTimeout(router.refresh, 500);
          setIsLoading(false);
        }
      })();
    },
    [localImage, router, sessionUser?.id, toast, updateUserProfileMutation],
  );

  const onFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setLocalImage({ file: files[0], localUrl: URL.createObjectURL(files[0]) });
    }
  }, []);

  const onPasswordChangeSubmit: SubmitHandler<ChangePasswordValidation> = useCallback(
    async data => {
      try {
        await changePasswordMutation(data);
        toast({ title: 'Success', status: 'success' });
      } catch (error) {
        console.log(error);
      } finally {
        reset();
      }
    },
    [changePasswordMutation, reset, toast],
  );

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  const avatarSrc = useMemo(
    () =>
      localImage?.localUrl
        ? localImage.localUrl
        : sessionUser?.avatar
          ? generateAWSUrl(sessionUser.avatar)
          : '',
    [localImage?.localUrl, sessionUser?.avatar],
  );

  return (
    <>
      {isSubmitting || passwordSubmitting || isLoading ? <Loading /> : null}
      <Box
        width="700px"
        margin="0 auto"
        p={{ base: '30px 20px 36px 20px', md: '96px 16px 159px 16px', xl: '96px 0 159px 0' }}>
        <Text
          display={{ base: 'none', sm: 'block' }}
          textAlign="center"
          as="h3"
          width="100%"
          fontSize="44px"
          fontWeight={700}
          lineHeight="normal">
          Edit Profile
        </Text>
        <Flex
          gap={16}
          textAlign="center"
          paddingTop={{ base: '0', sm: '40px' }}
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'center', md: 'flex-start' }}>
          <Box
            borderRadius="50%"
            overflow="hidden"
            position="relative"
            width="101px"
            height="101px">
            <Avatar
              name={`${sessionUser?.firstName} ${sessionUser?.lastName}`}
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
                  rules={{ required: 'This field is required' }}
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
                Change Avatar
              </ChakraButton>
            </Box>
          </Box>
        </Flex>
        <Flex paddingTop={{ base: '36px', md: '40px' }} flexDirection="column" gap={24}>
          <Flex gap="24px" flexDirection={{ base: 'column', lg: 'row' }}>
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  name="firstName"
                  type="text"
                  formLabelName="First Name"
                  placeholder="First Name"
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
              rules={{
                required: 'This field is required',
              }}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  name="lastName"
                  type="text"
                  formLabelName="Last Name"
                  value={value}
                  placeholder="Last Name"
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
              rules={{
                required: 'This field is required',
              }}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  name="email"
                  type="email"
                  formLabelName="Email"
                  placeholder="you@gmail.com"
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
                  isRequired
                  name="address"
                  type="text"
                  formLabelName="Address"
                  placeholder="33062 komitas, 5st."
                  value={value}
                  handleInputChange={onChange}
                  isInvalid={!!errors[name]?.message}
                  formErrorMessage={errors[name]?.message}
                />
              )}
            />
          </Flex>
          <Flex gap="24px">
            <Box flex={1}>
              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PhoneNumberInput
                    onChange={onChange}
                    value={value}
                    isDisabled={sessionUser?.isPhoneVerified}
                  />
                )}
              />
            </Box>
          </Flex>

          <Flex gap="24px" flexDirection={{ base: 'column', lg: 'row' }}>
            <Controller
              name="country"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectLabel
                  options={Country.getAllCountries()}
                  labelName="Country"
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
                  formLabelName="State"
                  placeholder="Enter your state"
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
                  formLabelName="City"
                  placeholder="Enter your City"
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
              onClick={handleSubmit(onSubmit)}>
              Save Changes
            </Button>
          </Flex>
          <Flex></Flex>
        </Flex>
        <Flex flexDirection="column" gap={24} mt={{ base: '12px', md: '40px' }}>
          <Text color="#000" fontSize={28} fontWeight={700}>
            Private Settings
          </Text>
          <Flex gap={24} flexDirection="column">
            <Controller
              name="currentPassword"
              control={passwordChangeControl}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  isInvalid={!!changePasswordErrors[name]?.message}
                  name="Current Password"
                  type="password"
                  formLabelName="Current Password"
                  placeholder="Current Password"
                  value={value}
                  handleInputChange={onChange}
                  formHelperText="Your password must not be less than 6 characters."
                  formErrorMessage={changePasswordErrors[name]?.message}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={passwordChangeControl}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  isInvalid={!!changePasswordErrors[name]?.message}
                  name="New Password"
                  type="password"
                  formLabelName="New Password"
                  placeholder="New Password"
                  value={value}
                  handleInputChange={onChange}
                  formHelperText="Your password must not be less than 6 characters."
                  formErrorMessage={changePasswordErrors[name]?.message}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={passwordChangeControl}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  isInvalid={!!changePasswordErrors[name]?.message}
                  name="Confirm Password"
                  type="password"
                  formLabelName="Confirm Password"
                  placeholder="Confirm Password"
                  value={value}
                  handleInputChange={onChange}
                  formHelperText="Your password must not be less than 6 characters."
                  formErrorMessage={changePasswordErrors[name]?.message}
                />
              )}
            />
          </Flex>
          <Flex alignItems="flex-end" justifyContent="flex-end">
            <Button
              width="162px"
              height="53px"
              fontSize="16px"
              onClick={passwordChangeHandlerSubmit(onPasswordChangeSubmit)}>
              Change Password
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Profile;
