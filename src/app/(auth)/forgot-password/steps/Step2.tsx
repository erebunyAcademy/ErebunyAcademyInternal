import { memo, useCallback } from 'react';
import { Text, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthService } from '@/api/services/AuthService';
import { Button } from '@/components/atoms';
import OTPPassword from '@/components/atoms/OTPPassword';
import { useAuth } from '@/contexts/AuthContext';
import { ForgotPasswordStep2Validation } from '@/utils/validation';

const resolver = classValidatorResolver(ForgotPasswordStep2Validation);

const Step2 = () => {
  const { setStep, setConfirmationCode } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordStep2Validation>({
    resolver,
    defaultValues: { otpPassword: '' },
  });

  const { mutate, isLoading } = useMutation<
    number,
    { message: string },
    ForgotPasswordStep2Validation
  >(AuthService.forgotPasswordStep2, {
    onSuccess: res => {
      setConfirmationCode(res);
      setStep('passwordStep');
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordStep2Validation> = useCallback(
    data => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <VStack spacing={32}>
      <Text fontWeight={'400'} fontSize={14} lineHeight={'normal'} textAlign={'center'}>
        An email with password reset instructions has been sent to your email address
      </Text>
      <Text fontWeight={'600'} fontSize={20} lineHeight={'normal'} textAlign={'center'}>
        OTP verification
      </Text>
      <Controller
        name="otpPassword"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field: { onChange, value } }) => (
          <OTPPassword onChange={onChange} value={value} />
        )}
      />
      <Button
        width={'100%'}
        onClick={handleSubmit(onSubmit)}
        isDisabled={!isValid}
        isLoading={isLoading}>
        Next
      </Button>
    </VStack>
  );
};

export default memo(Step2);
