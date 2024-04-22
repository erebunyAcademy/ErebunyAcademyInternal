'use client';
import React, { FC } from 'react';
import { Box, Flex, Heading, Text, useBreakpoint } from '@chakra-ui/react';
import { OfflineCourseVideo } from '@prisma/client';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { OfflineCoursePlayer } from '@/components/atoms';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type SwiperProps = {
  offlineCourseVideo: OfflineCourseVideo[];
  courseName: string;
};

const Slide: FC<SwiperProps> = ({ offlineCourseVideo, courseName }) => {
  const swiperStyle = useBreakpoint();

  return (
    <Box marginBottom={{ base: '36px ', lg: ' 148px', xl: ' 148px' }}>
      <Box
        textAlign="center"
        maxW="90%"
        margin={{
          base: '0 auto 20px',
          md: '0 auto 40px ',
        }}>
        <Heading
          color="#222222"
          as="h2"
          margin={{
            base: '0',
            md: '0 0 16px 0 ',
          }}
          fontWeight="700"
          lineHeight={{
            base: '31.92px',
            md: '37.24px ',
          }}
          fontSize={{ base: '24px', lg: '32px' }}>
          Successfully Navigating the PBA {courseName} course: Our Journey to Mastery
        </Heading>
        <Text fontSize="16px" lineHeight="24px" color="#747474">
          Let's explore how our students navigate this journey, experiencing a myriad of emotions
          and challenges a long the way. From the initial hurdles to moments of triumph, discover
          the depth of their feelings and the bond they form with the PBAfamily community. Join us
          as we delve into their experiences, uncovering the highs, lows, and unwavering passion
          that propel them forward.
        </Text>
      </Box>

      <Box
        maxWidth="1200px"
        margin="0 auto"
        display="flex"
        flexDirection="column"
        alignItems="center">
        <Box textAlign="center" lineHeight="21.28px" fontSize="12px" fontWeight="400" mb="16px">
          <Text as="span">Watch Video</Text>
        </Box>

        <Flex alignItems="center" gap={{ base: '0', sm: '0', md: '30px', lg: '80px', xl: '132px' }}>
          <Box
            display="flex"
            w={{ base: '350px', sm: '480px', md: '630px', lg: '851px' }}
            h={{ base: '250px', sm: '280px', md: '430px', lg: '501px' }}
            flexDirection="column"
            alignItems="center"
            margin={0}
            position="relative">
            <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
              <Swiper
                id="main"
                navigation={swiperStyle !== 'sm' && swiperStyle !== 'base'}
                style={{ width: 'inherit', height: 'inherit' }}
                pagination={{ clickable: true }}
                slidesPerView={1}
                spaceBetween={5}
                modules={[Navigation, Pagination]}>
                {offlineCourseVideo.map(video => (
                  <SwiperSlide key={video.id}>
                    <Box paddingBottom={10} h="100%">
                      <OfflineCoursePlayer video={video} />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Slide;
