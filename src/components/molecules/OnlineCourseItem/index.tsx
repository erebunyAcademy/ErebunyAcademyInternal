import React, { FC, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import EyeIcon from 'public/icons/eye.svg';
import StarIcon from 'public/icons/star.svg';
import { segoe } from '@/utils/constants/fonts';
import { generateAWSUrl } from '@/utils/helpers/common';

type OnlineCourseItemProps = {
  id: number;
  name: string;
  description: string;
  coverPhoto: string;
};

const OnlineCourseItem: FC<OnlineCourseItemProps> = ({ name, description, coverPhoto, id }) => {
  return (
    <Flex
      as={Link}
      href={`online-courses/${id}`}
      padding="16px"
      gap="16px"
      borderRadius="12px"
      border="1px solid #F3F4F6"
      backgroundColor="#FFFFFF">
      <Box
        width="240px"
        height="180px"
        objectFit="cover"
        position="relative"
        borderRadius="6px"
        overflow="hidden">
        <Image src={generateAWSUrl(coverPhoto)} alt="" fill />
      </Box>
      <Flex
        flexDirection="column"
        maxWidth="608px"
        color="#222222"
        justifyContent="space-between"
        alignItems="center">
        <Flex
          justifySelf="flex-start"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          fontWeight={700}
          marginBottom="8px">
          <Text fontSize="24px">{name}</Text>
        </Flex>
        <Text fontWeight={400} fontSize="16px" color="#000">
          {description}
        </Text>
        <Flex justifySelf="flex-start" width="100%" alignItems="center" gap="16px" my="8px">
          <Flex alignItems="center" gap="10px">
            <EyeIcon />
            <Text
              as="span"
              className={segoe.className}
              fontSize="16px"
              fontWeight={700}
              color="#1F1646">
              120
            </Text>
          </Flex>
          <Flex alignItems="center">
            <StarIcon />
            <Text
              as="span"
              className={segoe.className}
              fontSize="16px"
              fontWeight={700}
              color="#1F1646">
              4.8
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" justifySelf="center">
          <Text
            as={Link}
            href={'overview-courses'}
            bg="transparent"
            className={segoe.className}
            fontSize="16px"
            fontWeight={700}
            color="#1F1646"
            width="auto"
            height="auto"
            _hover={{
              bg: 'transparent',
            }}
            _focusVisible={{
              bg: 'transparent',
            }}
            _focus={{
              bg: 'transparent',
            }}>
            Get your subscription
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(OnlineCourseItem);
