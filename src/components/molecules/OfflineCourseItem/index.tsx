import React, { FC, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { OfflineCourse } from '@prisma/client';
import Image from 'next/image';
import TimeIcon from '/public/icons/time_icon.svg';
import LevelIcon from '/public/icons/level_icon.svg';
import LessonsIcon from '/public/icons/book_icon.svg';
import { generateAWSUrl } from '@/utils/helpers/common';

type OfflineCourseItemProps = {
  courseData: OfflineCourse;
};

const OfflineCourseItem: FC<OfflineCourseItemProps> = ({ courseData }) => {
  return (
    <Flex
      padding="16px"
      gap="16px"
      borderRadius="12px"
      border="1px solid #F3F4F6"
      width={{ base: '343px', sm: 'auto' }}
      margin="0 auto"
      backgroundColor="#FFFFFF"
      flexDirection={{ base: 'column', sm: 'row' }}>
      <Box width={{ base: 311, sm: 240 }} height={{ base: 139, sm: 154 }} position="relative">
        <Image
          src={generateAWSUrl(courseData.coverPhoto)}
          alt=""
          fill
          style={{
            objectFit: 'cover',
            borderRadius: '6px',
          }}
        />
      </Box>
      <Flex flexDirection="column" justifyContent="space-between" flex={1} color="#222222">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          fontWeight={700}
          flexWrap="wrap"
          marginBottom="8px">
          <Text fontSize="24px">{courseData.title}</Text>
          <Text fontSize="16px" display="flex" alignItems="center">
            {courseData.price}
            <Image src="/icons/dram.svg" alt="dram" width={13} height={13} />
            /month
          </Text>
        </Flex>
        <Text
          fontWeight={400}
          fontSize="16px"
          marginBottom="16px"
          maxHeight="110px"
          overflow="hidden"
          display="-webkit-box"
          sx={{
            WebkitLineClamp: 3, // Number of lines to be shown
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis', // Ensure this is in camelCase
          }}>
          {courseData.subTitle}
        </Text>
        <Flex justifyContent="space-between">
          <Flex width="332px" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Flex gap="8px" alignItems="center">
              {<TimeIcon />}
              <Text>{courseData.totalDuration} month</Text>
            </Flex>
            <Flex gap="8px" alignItems="center">
              {<LevelIcon />}
              <Text>{courseData.courseLevel}</Text>
            </Flex>
            <Flex gap="8px" alignItems="center">
              {<LessonsIcon />}
              <Text>{courseData.lessonsCount} lessons</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(OfflineCourseItem);
