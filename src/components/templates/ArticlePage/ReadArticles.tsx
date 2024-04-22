import React, { FC } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { ArticleItem } from '@/components/molecules';
import { articlesData } from '@/utils/constants/articles';
import { segoe } from '@/utils/constants/fonts';

type ReadArticlesProps = {
  currentArticleId: number;
};

const ReadArticles: FC<ReadArticlesProps> = ({ currentArticleId }) => {
  return (
    <Box as="section" maxWidth="1320px" margin="0 auto">
      <Heading
        className={segoe.className}
        textAlign="center"
        color="#000000"
        fontWeight={700}
        fontSize="32px"
        lineHeight="normal"
        fontStyle="normal"
        mb={{ base: '16px', md: '40px' }}>
        Read Next
      </Heading>

      <Flex
        display="flex"
        gap={{ base: '16px', md: '20px' }}
        justifyContent="center"
        flexDirection={{ base: 'column', md: 'row' }}>
        {articlesData
          .filter(article => article.id !== currentArticleId)
          .slice(0, 4)
          .map((article, i) => (
            <ArticleItem article={article} key={i} />
          ))}
      </Flex>
    </Box>
  );
};

export default ReadArticles;
