'use client';
import React, { FC, useCallback, useState } from 'react';
import { Box, Container, Flex, Heading, Input, InputGroup } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Controller, useForm } from 'react-hook-form';
import { ArticleService } from '@/api/services/ArticleService';
import { Button, Loading } from '@/components/atoms';
import SuccessMessageToast from '@/components/atoms/SuccessMessageToast';
import { segoe } from '@/utils/constants/fonts';
import { ArticleApplicantFormValidation } from '@/utils/validation/article';
import WelcomeSection from './WelcomeSection';

const LogInSection = dynamic(() => import('./LogInSection'));
// const AboutAuthor = dynamic(() => import('./AboutAuthor'));
const ReadArticles = dynamic(() => import('./ReadArticles'));

type ArticleProps = {
  id: number;
  title: string;
  description: string;
  imgSrc?: string;
};

type ArticlePageProps = {
  children: ArticleProps[];
} & ArticleProps;

const resolver = classValidatorResolver(ArticleApplicantFormValidation);

const ArticlePage: FC<ArticlePageProps> = ({ id, title, description, children }) => {
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

      <WelcomeSection title={title} />

      <Container
        display="flex"
        flexDirection="column"
        maxWidth={1320}
        px={{ base: '16px', xl: '0' }}
        gap={{ base: '36px', md: '80px', xl: '148px' }}>
        <LogInSection description={description}>{children}</LogInSection>

        {/* <AboutAuthor /> */}

        <ReadArticles currentArticleId={id} />

        <Flex
          as="section"
          flexDirection="column"
          maxW="506px"
          margin="0 auto"
          mb={{ base: '36px', md: '80px', xl: '148px' }}>
          <Heading
            className={segoe.className}
            mb={{ base: '16px', md: '32px' }}
            lineHeight="normal"
            fontStyle="normal"
            color="#222222"
            fontSize={{ base: '28px', sm: '32px' }}
            fontWeight={700}
            textAlign="center">
            Subscribe to get our Newsletter
          </Heading>
          <InputGroup
            width="100%"
            height="46px"
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
              isDisabled={!isValid}
              onClick={handleSubmit(submitHandler)}>
              Subscribe
            </Button>
          </InputGroup>
          {showSuccessMessage && (
            <Box my={8}>
              <SuccessMessageToast />
            </Box>
          )}
        </Flex>
      </Container>
    </>
  );
};

export default ArticlePage;
