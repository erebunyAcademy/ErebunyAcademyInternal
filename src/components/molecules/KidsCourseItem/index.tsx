import React, { FC } from 'react';
import { Box, Flex, GridItem, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { FOR_KIDS_ROUTE } from '@/utils/constants/routes';
import { generateAWSUrl } from '@/utils/helpers/common';
import { generateCourseName } from '@/utils/helpers/courses';

type KidsCourseItemProps = {
  title: string;
  subTitle: string;
  price: number;
  totalDuration: number;
  courseLevel: string;
  id: number;
  coverPhoto: string;
  pdf: string;
};

const KidsCourseItem: FC<KidsCourseItemProps> = ({
  id,
  title,
  subTitle,
  price,
  totalDuration,
  courseLevel,
  coverPhoto,
  pdf,
}) => {
  return (
    <GridItem
      p="16px"
      id={id.toString()}
      boxShadow="0px 4px 6px 0px rgba(0, 0, 0, 0.06)"
      _hover={{
        boxShadow: '0px 20px 50px 0px #0000001A',
      }}
      borderRadius="12px"
      transition="all 0.3s">
      <Box as={Link} href={`${FOR_KIDS_ROUTE}/${generateCourseName(title)}/${id}`}>
        <Box borderRadius="12px 12px 0px 0px" overflow="hidden" height="242px" position="relative">
          <Image
            src={generateAWSUrl(coverPhoto)}
            alt="Kids offline courses"
            width={387}
            height={242}
          />
        </Box>
        <Box borderRadius=" 0px 0px 12px 12px" background="#FFFFFF">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mb="8px"
            fontStyle="normal"
            fontWeight={700}
            lineHeight="normal"
            color="#222">
            <Text as="span" fontSize="24px">
              {title}
            </Text>
            <Text as="span" fontSize="16px" display="flex">
              {price}
              <Image src="/icons/dram.svg" alt="dram" width={13} height={13} />
              /month
            </Text>
          </Flex>
          <Text
            fontSize="16px"
            fontStyle="normal"
            fontWeight={400}
            lineHeight="22px"
            color="#222"
            maxHeight="110px"
            overflow="hidden"
            display="-webkit-box"
            sx={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
            }}>
            {subTitle}
          </Text>
          <Flex display="flex" alignItems="center" gap="21.72px" my="16px">
            <Flex gap="8.14px">
              <Image width={22} height={22} alt="Time icon" src="/icons/time_icon.svg" />
              <span
                style={{
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}>
                {totalDuration} month
              </span>
            </Flex>
            <Flex gap="8.14px">
              <Image width={22} height={22} alt="Level icon" src="/icons/level_icon.svg" />
              <span
                style={{
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}>
                {courseLevel} level
              </span>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <Flex gap="16px" alignItems="center">
        <Button as={Link} href={`${FOR_KIDS_ROUTE}/${generateCourseName(title)}/${id}`}>
          Enroll now
        </Button>
        <Text
          padding="16px 0"
          as="a"
          href={generateAWSUrl(pdf)}
          target="_blank"
          fontWeight="400"
          lineHeight="21.28px"
          fontSize="16px"
          zIndex={1000}
          bg="transparent"
          _focus={{
            bg: 'transparent',
          }}
          _focusWithin={{
            bg: 'transparent',
          }}
          _focusVisible={{
            bg: 'transparent',
          }}
          _hover={{
            bg: 'transparent',
          }}
          color="#1F1646">
          View program
        </Text>
      </Flex>
    </GridItem>
  );
};

export default KidsCourseItem;
