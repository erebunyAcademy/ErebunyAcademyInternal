"use client";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from "@/utils/constants/routes";
import CheckIcon from "/public/icons/check.svg";
import { Button, FormInput, SelectLabel } from "@/components/atoms";
import { AuthBox } from "@/components/molecules";
import { SignUpValidation } from "@/utils/validation/auth";
import { Controller, useForm } from "react-hook-form";
import { UserRoleEnum } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/api/user.service";

const resolver = classValidatorResolver(SignUpValidation);

const Signup = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpValidation>({
    resolver,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: UserRoleEnum.TEACHER,
    },
  });

  const authBoxProps = {
    data: [
      { href: SIGN_UP_ROUTE, title: "Sign up" },
      { href: SIGN_IN_ROUTE, title: "Sign In" },
    ],
    boxProps: { marginTop: { base: 64, md: 37 } },
  };

  const { mutate } = useMutation({
    mutationFn: UserService.signup,
  });

  const onSubmit = (data: SignUpValidation) => {
    console.log(data);
    mutate(data);
  };

  const isTeacherType = watch("userType") === UserRoleEnum.TEACHER;

  return (
    <>
      {false ? (
        <Flex
          flexDirection="column"
          marginTop="137px"
          padding="32px"
          gap="12px"
        >
          <Flex justifyContent="center" mb="12px">
            <CheckIcon />
          </Flex>
          <Text
            fontSize="24px"
            fontWeight={700}
            textAlign="center"
            color="#222"
          >
            Check your email
          </Text>
          <Text
            fontSize="16px"
            fontWeight={400}
            textAlign="center"
            color="#222"
          >
            Confirmation is sent to your email
          </Text>
          <Button
            mt="12px"
            p="12px 16px"
            fontSize="16px"
            fontWeight={400}
            mx="auto"
            onClick={() => {}}
          >
            Send again
          </Button>
        </Flex>
      ) : (
        <>
          <AuthBox data={authBoxProps.data} boxProps={authBoxProps.boxProps}>
            <VStack
              spacing={32}
              display="grid"
              gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
            >
              <Controller
                name="userType"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <SelectLabel
                    name={name}
                    options={[
                      { name: UserRoleEnum.STUDENT },
                      { name: UserRoleEnum.TEACHER },
                    ]}
                    labelName="User Type"
                    valueLabel="name"
                    nameLabel="name"
                    onChange={onChange}
                    value={value}
                  />
                )}
              />

              <Controller
                name="firstName"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    isRequired
                    placeholder="First name"
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
                    placeholder="Last name"
                    formLabelName="Last name"
                    value={value}
                    handleInputChange={onChange}
                  />
                )}
              />
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
                    formHelperText="Your password must be less than 6 characters."
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
                    formLabelName="Confirm passoword"
                    placeholder="Confirm password"
                    value={value}
                    handleInputChange={onChange}
                    type="password"
                    formHelperText="Your password must be less than 6 characters."
                  />
                )}
              />

              {isTeacherType ? (
                <>
                  <Controller
                    name="profession"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        isRequired
                        placeholder="Profession"
                        isInvalid={!!errors.firstName?.message}
                        name="firstName"
                        type="text"
                        formLabelName="Profession"
                        value={value}
                        handleInputChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    name="workPlace"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <FormInput
                        isRequired
                        placeholder="Working place"
                        isInvalid={!!errors.firstName?.message}
                        name={name}
                        type="text"
                        formLabelName="Working place"
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
                        placeholder="Scientific activity"
                        isInvalid={!!errors.firstName?.message}
                        name={name}
                        type="text"
                        formLabelName="Scientific activity"
                        value={value}
                        handleInputChange={onChange}
                      />
                    )}
                  />
                </>
              ) : (
                <>HI JOHNY</>
              )}
            </VStack>
            <VStack spacing={16} paddingTop={16}>
              <Button width={"100%"} onClick={handleSubmit(onSubmit)}>
                Sign up
              </Button>
            </VStack>
          </AuthBox>
        </>
      )}
    </>
  );
};

export default Signup;
