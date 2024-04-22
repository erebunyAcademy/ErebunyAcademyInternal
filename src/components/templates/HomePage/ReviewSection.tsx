import React, { FC } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const StudentFeedback = dynamic(() => import('@/components/molecules/StudentFeedback'));

type ReviewSectionProps = {};

const ReviewSection: FC<ReviewSectionProps> = () => {
  const studentsFeedback = [
    {
      id: 1,
      feedbackText:
        'When I first came to Persona Business Academy, at Tigran Manukyans course, it seemed like I was on some new planet appeared (so everything was new and mixed).Then Manukyan the willingness of Tigran, Gagik and Tigran Harutyunyan, everything to explain thoroughly, patience and created As a result of the environment, Persona became more than just that organization providing quality knowledge. By visiting Persona, you are sure to get quality knowledge (not only in your chosen field) but also for sure you will have the most interesting and colorful course in life',
      studentAvatarSrc: '/images/homepage/dani.jpg',
      firstName: 'Daniela',
      lastName: 'Zanazanyan',
      profession: 'SMM Speciailist',
      icon: '/icons/arrow_down_blue.svg',
    },
    {
      id: 2,
      feedbackText:
        "Hi, I'm Garry, I've been trying my strength at IT for almost a year now, particularly in Front-End. Before learning about the PBA and joining its ranks, I received professional knowledge in 2 other different educational places. However I will not hide that they were not so satisfactory and sufficient for me. Accepting PBA and joining the ranks of students of Narek Boshyan's JavaScript course group, I realized how big a difference there is between previous and current studies in the organization of processes, their quality and level. And both the methodology of organizing the course in PBA and Narek Boshyan's Compassionate and individualized treatment of any student obligates us to study well and become leading professionals in the field.",
      studentAvatarSrc: '/images/homepage/garri.jpg',
      firstName: 'Garry',
      lastName: 'Gevorgyan',
      profession: 'Web-developer',
      icon: '/icons/arrow_down_pink.svg',
    },
    {
      id: 3,
      feedbackText:
        "Hi, I'm Armine, attending HRM in PBA I gained new knowledge at the courses by discovering and loving that realm unknown to me. Thanks to my trainer Julieta Asatryan, new to increase the level of cognitive perception. The course gave not only new knowledge, but also friends and invaluable values in the form of innovative ideas. PBA is a good and professional training academy, come on! The classes are very pleasant, because after working hours, the balance of humor and positive atmosphere is motivating, and of course the seriousness added to it. PBA, fast and quality education. ",
      studentAvatarSrc: '/images/homepage/armine.jpg',
      firstName: 'Armine',
      lastName: 'Hakobyan',
      profession: 'HR Management',
      icon: '/icons/arrow_down_blue.svg',
    },
  ];
  return (
    <Box as="section" id="feedback" mb={{ base: '36px', lg: '148px' }}>
      <Heading
        textAlign="center"
        m="0"
        as="h3"
        lineHeight={{
          base: '31.92px',
          md: '42.56px',
        }}
        fontSize={{ base: '24px', md: '32px' }}
        fontWeight="700">
        Why Students Love Persona
      </Heading>

      <Box
        display="flex"
        gap="20px"
        justifyContent="center"
        margin={{
          base: '20px 0 0 0',
          md: '50px 0 0 0',
          lg: '60px 0 0 0',
        }}
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
        {studentsFeedback.map((feedback, i) => (
          <StudentFeedback key={i} {...feedback} bg={i === 1 ? '#ffefea' : '#ECF7FC'} />
        ))}
      </Box>
    </Box>
  );
};

export default ReviewSection;
