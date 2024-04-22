import React, { FC, useCallback, useState } from 'react';
import { Box, Flex, Heading, Input, InputGroup, Text } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { ArticleService } from '@/api/services/ArticleService';
import { Button, Loading } from '@/components/atoms';
import SuccessMessageToast from '@/components/atoms/SuccessMessageToast';
import { ArticleApplicantFormValidation } from '@/utils/validation/article';

type SubscribeSectionProps = {};

const resolver = classValidatorResolver(ArticleApplicantFormValidation);

const SubscribeSection: FC<SubscribeSectionProps> = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<ArticleApplicantFormValidation>({
    defaultValues: { email: '' },
    resolver,
  });

  const { mutate, isLoading } = useMutation<
    boolean,
    { message: boolean },
    ArticleApplicantFormValidation
  >(ArticleService.createArticleApplicant, {
    onSuccess: () => {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      reset();
    },
  });

  const submitHandler = useCallback(
    (data: ArticleApplicantFormValidation) => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <>
      {isLoading && <Loading />}
      <Flex
        as="section"
        backgroundColor="#F6FCFF"
        pt={{ base: '36px', md: '80px', xl: '151.95px' }}
        pb={{ base: '36px', md: '80px', xl: '126.26px' }}>
        <Flex
          flexDirection={{ base: 'column', lg: 'row' }}
          gap={{ base: '16px', md: '20px' }}
          maxWidth={1200}
          margin="0 auto"
          px={{ base: '16px', xl: '0' }}
          alignItems="center">
          <Box width={{ base: '100%', lg: '590px' }} height="324px">
            <Heading
              mb="16px"
              lineHeight="normal"
              fontStyle="normal"
              color="#222222"
              fontSize={{ base: '28px', sm: '44px' }}
              fontWeight={{ base: 600, xl: 700 }}
              textAlign="center">
              Insights that drive innovation
            </Heading>
            <Text
              as="span"
              fontStyle="normal"
              lineHeight="normal"
              fontSize="16px"
              fontWeight={400}
              color="#747474">
              Dive into this PBA-qualified article, designed to equip you with essential skills and
              insights for personal and professional growth. Discover effective strategies, gain
              valuable expertise, and embark on a journey of continuous learning.
            </Text>
            <Box>
              <InputGroup
                my="16px"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                border="1px solid #C0C0C0"
                padding="4px 4px 4px 16px"
                borderRadius="12px"
                outline="none">
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      height="100%"
                      name="email"
                      border="none"
                      outline="none"
                      _focusVisible={{ border: 'none' }}
                      lineHeight="normal"
                      fontSize="16px"
                      fontWeight={400}
                      placeholder="Your Email"
                      _placeholder={{ color: '#DEDEDE' }}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                <Button
                  borderRadius="6px"
                  p="12px 24px"
                  lineHeight="14px"
                  fontSize="14px"
                  fontWeight={600}
                  onClick={handleSubmit(submitHandler)}
                  isDisabled={!isValid}>
                  Subscribe
                </Button>
              </InputGroup>
              {showSuccessMessage && (
                <Box my={8}>
                  <SuccessMessageToast />
                </Box>
              )}
            </Box>
          </Box>
          <Box
            maxW={{ base: '100%', lg: '590px' }}
            height={{ base: 'auto', md: '388.7px' }}
            borderRadius="16px"
            overflow="hidden">
            <Image
              width={590}
              height={388.7}
              src="/images/public_available/article_img.jpg"
              alt="Article Image"
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default SubscribeSection;
