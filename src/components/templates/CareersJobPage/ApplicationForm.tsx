'use client';
import React, { FC, useCallback, useState } from 'react';
import { Box, Flex, FormControl, Heading, Input, Text } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { JobService } from '@/api/services/JobService';
import { Button, FormInput, Loading, PhoneNumberInput } from '@/components/atoms';
import FormTextarea from '@/components/atoms/FormTextarea';
import SuccessMessageToast from '@/components/atoms/SuccessMessageToast';
import { segoe } from '@/utils/constants/fonts';
import { ApplyJobFormValidation } from '@/utils/validation/apply-job';

type ApplicationFormProps = {
  jobId: number;
};

const resolver = classValidatorResolver(ApplyJobFormValidation);

const defaultValues = {
  name: '',
  phoneNumber: '',
  email: '',
  motivationLetter: '',
  attachment: '',
};

const ApplicationForm: FC<ApplicationFormProps> = ({ jobId }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<null | File>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyJobFormValidation>({ defaultValues, resolver });

  const { mutate, isLoading: jobIsLoading } = useMutation<
    boolean,
    { message: string },
    ApplyJobFormValidation
  >(data => JobService.createJobApplicant(jobId, data), {
    onSuccess: () => {
      reset();
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    },
  });

  const submitHandler = useCallback(
    async (data: ApplyJobFormValidation) => {
      setIsLoading(true);
      try {
        let filePath = '';
        if (file) {
          filePath = `job/${jobId}/applicant/${file.name}`;
          const { url } = await JobService.getPreSignedUrl(filePath);

          await axios.put(url, file);
        }
        data.attachment = filePath;
        mutate(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [file, jobId, mutate],
  );

  return (
    <Box marginBottom={{ base: '36px', lg: '148px' }} scrollMarginTop="80px" id="apply-for-course">
      {(isLoading || jobIsLoading) && <Loading />}
      <Heading
        className={segoe.className}
        m={{ base: ' 0 0 16px 0', lg: ' 0 0 40px 0' }}
        fontSize={{ base: '28px', md: '24px' }}
        textAlign={{ base: 'center', lg: 'start' }}
        lineHeight="normal"
        fontWeight="700">
        Vacancy Application
      </Heading>

      <Box>
        <Flex gap="20px" justifyContent="center" alignItems="center">
          <Box width="666px">
            <form onSubmit={handleSubmit(submitHandler)}>
              <FormControl marginBottom="36px">
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: 'This field is required',
                  }}
                  render={({ field: { onChange, value, name } }) => (
                    <FormInput
                      isRequired
                      name={name}
                      type="text"
                      formLabelName="Full name"
                      placeholder="Enter full name"
                      value={value}
                      handleInputChange={onChange}
                      isInvalid={!!errors[name]?.message}
                      formErrorMessage={errors[name]?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl marginBottom="36px">
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'This field is required',
                  }}
                  render={({ field: { onChange, value, name } }) => (
                    <FormInput
                      isRequired
                      name={name}
                      type="text"
                      formLabelName="Email"
                      placeholder="you@example.com"
                      value={value}
                      handleInputChange={onChange}
                      isInvalid={!!errors[name]?.message}
                      formErrorMessage={errors[name]?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl marginBottom="36px">
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: 'This field is required',
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneNumberInput
                      onChange={onChange}
                      value={value}
                      isRequired
                      placeholder="98 901 820"
                      formLabelName="Phone Number"
                    />
                  )}
                />
              </FormControl>

              <Box marginBottom="36px">
                <Text margin="0 0 6px 0" fontSize="14px" lineHeight="20px" fontWeight="600">
                  CV*
                </Text>

                <Box
                  borderRadius="12px"
                  padding="20px 0"
                  bg="#F6FCFF"
                  color="#C0C0C0"
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  cursor="pointer"
                  alignItems="center"
                  position="relative">
                  <Input
                    type="file"
                    width="100%"
                    cursor="pointer"
                    height="100%"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    onChange={e => {
                      if (e.target.files) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    opacity={0}
                  />
                  <Text margin="0 0 2px 0" fontSize="14px" fontWeight="500" lineHeight="20px">
                    Upload documents
                  </Text>
                  <Text fontSize="13px" fontWeight="400" lineHeight="18px" margin="0">
                    pdf, doc, xls
                  </Text>
                </Box>
              </Box>

              <FormControl>
                <Controller
                  name="motivationLetter"
                  control={control}
                  rules={{
                    required: 'This field is required',
                  }}
                  render={({ field: { onChange, value, name } }) => (
                    <FormTextarea
                      isRequired
                      name={name}
                      formLabelName="Motivation letter"
                      placeholder="Type here..."
                      value={value}
                      handleInputChange={onChange}
                      isInvalid={!!errors[name]?.message}
                      formErrorMessage={errors[name]?.message}
                    />
                  )}
                />
              </FormControl>

              <Button
                type="submit"
                width="100%"
                padding="8px 14px"
                fontSize="16px"
                fontWeight="600"
                height="37px"
                lineHeight="21.28px"
                onClick={handleSubmit(submitHandler)}>
                Submit
              </Button>
            </form>
            <Box mt="10px">{showSuccessMessage && <SuccessMessageToast />}</Box>
          </Box>

          <Box maxWidth="514px" display={{ base: 'none', lg: 'inline-block' }}>
            <Image src="/icons/job_img_form.jpg" alt="user img" width={507} height={607} />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ApplicationForm;
