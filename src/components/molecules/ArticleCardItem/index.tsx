import React, { FC } from 'react';
import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { ARTICLES_ROUTE } from '@/utils/constants/routes';
import { generateCourseName } from '@/utils/helpers/courses';

type ArticleCardItemProps = {
  id: number;
  title: string;
  description: string;
  date: string;
  imgSrc: string;
};

const ArticleCardItem: FC<ArticleCardItemProps> = ({ title, description, id, imgSrc }) => {
  return (
    <Box
      maxW="386px"
      borderRadius="6px"
      overflow="hidden"
      as={Link}
      href={`${ARTICLES_ROUTE}/${generateCourseName(title)}/${id}`}>
      <Image
        width={386}
        height={316}
        style={{
          objectFit: 'cover',
        }}
        src={imgSrc}
        alt="Article image"
      />
      <UnorderedList
        color="#222222"
        borderRadius="6px"
        transition="all 0.3s"
        bg="#fff"
        boxShadow="0px 2px 4px 0px #0000001F"
        listStyleType="none"
        position="relative"
        zIndex="2"
        margin="-51px 17px 13px 17px"
        height="205px"
        _hover={{
          boxShadow: '3px 3px 20px 0px #0000001A',
        }}
        padding=" 24px"
        maxW="351.9px"
        display="flex"
        flexDirection="column">
        <ListItem
          lineHeight="21.28px"
          fontSize="16px"
          fontWeight="700"
          mb="8px"
          maxHeight="24px"
          overflow="hidden"
          display="-webkit-box"
          sx={{
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
          }}>
          {title}
        </ListItem>
        <ListItem
          mb="16px"
          lineHeight="21.28px"
          fontSize="16px"
          fontWeight="400"
          maxHeight="44px"
          overflow="hidden"
          display="-webkit-box"
          sx={{
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
          }}>
          {description}
        </ListItem>
        <ListItem
          as="span"
          borderBottom="1px solid #222222"
          marginTop="auto"
          color="#222222"
          width="auto"
          alignSelf="flex-start"
          _hover={{
            color: '#5B5B5B',
            borderColor: '#5B5B5B',
          }}>
          Read full article
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default ArticleCardItem;
