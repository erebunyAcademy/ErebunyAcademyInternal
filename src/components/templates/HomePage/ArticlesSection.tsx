'use client';
import React, { FC } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { articlesData } from '@/utils/constants/articles';

const ArticleItem = dynamic(() => import('@/components/molecules/ArticleItem'));

type ArticlesSectionProps = {};

const ArticlesSection: FC<ArticlesSectionProps> = () => {
  return (
    <Box mb={{ base: '36px', lg: '148px' }}>
      <Heading
        textAlign="center"
        margin={{
          base: '0 0 16px 0',
        }}
        as="h3"
        color="#222222"
        fontWeight="700"
        fontSize={{ base: '24px', lg: '32px' }}
        lineHeight={{
          base: '31.92px',
          lg: '42.56px',
        }}>
        Only Qualified Articles
      </Heading>

      <Box display="flex" flexWrap="wrap" gap="40px 20px" justifyContent="center" padding="0">
        {articlesData.slice(0, 4).map((article, i) => (
          <ArticleItem article={article} key={i} />
        ))}
      </Box>
    </Box>
  );
};

export default ArticlesSection;
