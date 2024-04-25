import { VStack } from "@chakra-ui/react";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, FormInput } from "@/components/atoms";
import { useAuth } from "@/contexts/AuthContext";
import { ForgotPasswordStep1Validation } from "@/utils/validation";

const resolver = classValidatorResolver(ForgotPasswordStep1Validation);

const Step1 = () => {
  const { setStep } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordStep1Validation>({
    defaultValues: { email: "" },
    resolver,
  });

  // const { mutate, isLoading } = useMutation<
  //   number,
  //   { message: string },
  //   ForgotPasswordStep1Validation
  // >(AuthService.forgotPasswordStep1, {
  //   onSuccess: () => {
  //     setStep("OTPStep");
  //   },
  // });

  const onSubmit: SubmitHandler<ForgotPasswordStep1Validation> = (data) => {
    console.log(data);
  };

  return (
    <VStack spacing={16}>
      <Controller
        name="email"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors.email?.message}
            name="email"
            type="email"
            formLabelName="Email"
            value={value}
            placeholder="you@example.com"
            handleInputChange={onChange}
            formErrorMessage={errors.email?.message}
          />
        )}
      />
      <Button width={"100%"} onClick={handleSubmit(onSubmit)} isLoading={false}>
        Next
      </Button>
    </VStack>
  );
};

export default Step1;
