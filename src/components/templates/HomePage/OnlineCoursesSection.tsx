import React, { FC } from 'react';
import { Box, Heading, Link, Text } from '@chakra-ui/react';
import Image from 'next/image';
import CourseCard from '@/components/molecules/CourseCard';

type OnlineCoursesSectionProps = {};

const OnlineCoursesSection: FC<OnlineCoursesSectionProps> = () => {
  const shortCourse = [
    {
      id: 1,
      src: '/icons/short_course_smm.svg',
      courseTitle: 'SMM',
      courseDescription: 'Get inspired by this revived W.H. Auden’s Hymn to the United Nations.',
      rating: 4.8,
    },
    {
      id: 2,
      src: '/icons/short_course_front_end.svg',
      courseTitle: 'Front-End',
      courseDescription: 'Get inspired by this revived W.H. Auden’s Hymn to the United Nations.',
      rating: 4.8,
    },
    {
      id: 3,
      src: '/icons/short_course_digital_marketing.svg',
      courseTitle: 'Digital Marketing',
      courseDescription: 'Get inspired by this revived W.H. Auden’s Hymn to the United Nations.',
      rating: 4.8,
    },
  ];

  return (
    <Box mb={{ base: '36px', lg: '148px' }}>
      <Box textAlign="center" maxW="564px" m="0 auto">
        <Heading
          lineHeight={{
            base: '31.92px',
            lg: '42.56px',
          }}
          fontWeight="700"
          fontSize={{ base: '24px', lg: '32px' }}
          margin="0 0 16px 0">
          Short Online Courses
        </Heading>
        <Box mb="16px">
          <Link
            display="flex"
            justifyContent="center"
            gap="8px"
            fontWeight={{
              base: '400',
              md: '700',
              xl: '700',
            }}
            fontSize="16px"
            lineHeight="21.28px"
            color={{
              base: '#222222',
              md: '#FF6131',
            }}>
            Get your subscribtion
            <Box display={{ base: 'none', md: 'block' }}>
              <Image src="/icons/not_found_icon.svg" alt="Arrow" width={24} height={24} />
            </Box>
          </Link>
        </Box>
        <Text fontWeight="400" fontSize="16px" lineHeight="21.28px" margin="0 0 24px 0">
          Short online video courses provide a convenient and accessible way for learners to acquire
          new skills, expand their knowledge, and stay updated on the latest trends in various
          fields. These courses offer concise, focused lessons that are designed to be easily
          digestible and engaging for participants.Course registration costs start at $1.99.
        </Text>
      </Box>

      <Box
        display="flex"
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        justifyContent={{
          base: 'center',
          lg: 'spacebetween',
        }}
        gap="20px"
        margin="40px 0">
        {shortCourse.map(course => (
          <CourseCard {...course} key={course.id} />
        ))}
      </Box>

      <Box
        display="flex"
        justifyContent={{
          base: 'center',
          xl: 'flex-end',
        }}>
        <Link lineHeight="21.28px" fontSize="16px" fontWeight="400">
          View all courses
        </Link>
      </Box>
    </Box>
  );
};

export default OnlineCoursesSection;
