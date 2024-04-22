'use client';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { CourseComment } from '@prisma/client';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { generateAWSUrl } from '@/utils/helpers/common';

type StudentCommentSlideProps = {
  comments: CourseComment[];
};

const StudentCommentSlide: FC<StudentCommentSlideProps> = ({ comments }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const handleSlideChange = useCallback((swiper: any) => {
    setActiveSlideIndex(swiper.activeIndex);
  }, []);

  const isDesktop = useMemo(() => !(innerWidth < 400), []);

  return (
    <Box overflow="hidden">
      <Swiper
        slidesPerView={isDesktop ? 1 : 'auto'}
        centeredSlides={!isDesktop}
        style={{
          overflow: 'visible',
        }}
        spaceBetween={10}
        navigation={isDesktop}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        onSlideChange={handleSlideChange}>
        {comments.map((comment: CourseComment) => (
          <SwiperSlide key={comment.id}>
            <Flex
              flexDirection="column"
              gap="8px"
              justifyContent="space-between"
              margin="0 auto"
              paddingBottom="60px"
              width={{
                base: '274px',
                sm: '794px',
              }}>
              <Box
                borderRadius="15px"
                width="100%"
                padding={{
                  base: '24px ',
                  lg: ' 48px 90px',
                  xl: ' 68px 124px',
                }}
                color="#222222"
                textAlign="center"
                bg="#FDF1F0">
                <Text
                  as="p"
                  fontWeight="700"
                  lineHeight={{
                    base: '21.28px ',
                    lg: '42.56px',
                  }}
                  fontSize={{ base: '16px ', md: '32px' }}>
                  {comment.headline}
                </Text>
                <Text as="span" fontSize="16px" lineHeight="18.75px">
                  {comment.text}
                </Text>
              </Box>
              <Flex
                justifyContent="center"
                display={{
                  base: 'flex',
                  sm: 'none',
                }}>
                <Avatar
                  src={generateAWSUrl(comment.userPicture || '')}
                  width="72px"
                  height="72px"
                  transition="all 0.3s"
                />
              </Flex>
            </Flex>
          </SwiperSlide>
        ))}
      </Swiper>

      <Flex
        justifyContent="center"
        gap="40px"
        height="222px"
        mt="55px"
        flexWrap="wrap"
        display={{ base: 'none', sm: 'flex' }}>
        {comments.map((comment: CourseComment, index) => (
          <Avatar
            key={index}
            src={generateAWSUrl(comment.userPicture || '')}
            width={activeSlideIndex === index ? '126px' : '72px'}
            height={activeSlideIndex === index ? '132px' : '72px'}
            transition="all 0.3s"
          />
        ))}
      </Flex>
    </Box>
  );
};

export default StudentCommentSlide;
