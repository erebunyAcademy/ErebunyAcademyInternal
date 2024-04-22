'use client';
import React, { FC, useCallback, useState } from 'react';
import { Box, Container, Flex, Grid, Heading, Input, InputGroup } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Controller, useForm } from 'react-hook-form';
import { ArticleService } from '@/api/services/ArticleService';
import { Button, Loading } from '@/components/atoms';
import SuccessMessageToast from '@/components/atoms/SuccessMessageToast';
import ArticleCardItem from '@/components/molecules/ArticleCardItem';
import { articlesData } from '@/utils/constants/articles';
import { segoe } from '@/utils/constants/fonts';
import { ArticleApplicantFormValidation } from '@/utils/validation/article';

const SubscribeSection = dynamic(() => import('./SubscribeSection'));
// const MoreArticles = dynamic(() => import('./MoreArticles'));

type Props = {};

const resolver = classValidatorResolver(ArticleApplicantFormValidation);

const ArticlesPage: FC<Props> = () => {
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
      <SubscribeSection />
      <Container maxWidth={1200} margin="0 auto" px={{ base: '16px', xl: '0' }} pb="40px">
        <Grid
          justifyItems="center"
          gridTemplateColumns={{
            base: '1fr',
            lg: '1fr 1fr',
            xl: '1fr 1fr 1fr',
          }}>
          {articlesData.map((article, i: number) => (
            <ArticleCardItem {...article} key={i} />
          ))}
        </Grid>
        {/* <MoreArticles /> */}

        <Flex
          flexDirection="column"
          maxW="506px"
          margin="0 auto"
          mt={{ base: '36px', md: '80px', xl: '148px' }}
          height="200px">
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
              onClick={handleSubmit(submitHandler)}
              isDisabled={!isValid}>
              Subscribe
            </Button>
          </InputGroup>
          <Box my={8}>{showSuccessMessage && <SuccessMessageToast />}</Box>
        </Flex>
      </Container>
    </>
  );
};

export default ArticlesPage;
