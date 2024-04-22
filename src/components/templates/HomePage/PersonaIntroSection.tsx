import React, { FC } from 'react';
import { Box, Container, Flex, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { OfflineCourseService } from '@/api/services/OfflineCourseService';
import { OutlinedButton } from '@/components/atoms';
import MovableButton from '@/components/atoms/MovableButton';
import { FOR_KIDS_ROUTE, HOMEPAGE_ROUTE, OFFLINE_COURSES_ROUTE } from '@/utils/constants/routes';
import { generateCourseName } from '@/utils/helpers/courses';

type PersonaIntroSectionProps = {};

const PersonaIntroSection: FC<PersonaIntroSectionProps> = async () => {
  const offlineCourseListNames = await OfflineCourseService.getOfflineCourseListNames();

  if (!offlineCourseListNames) {
    return redirect(HOMEPAGE_ROUTE);
  }

  return (
    <Container maxW="1200px" margin="0 auto" padding={{ base: '0 16px', xl: '0' }}>
      <Box
        mb={{
          base: '36px ',
          md: '148px ',
        }}>
        <Box
          color="#222222"
          maxW="667px"
          margin={{
            base: '0 auto 20px ',
            md: '0 auto 40px ',
          }}
          textAlign="center">
          <Heading
            lineHeight={{
              base: '31.92px',
              lg: '42.56px',
            }}
            fontSize={{ base: '24px', lg: '32px' }}
            fontWeight="700"
            margin="0 0 16px 0"
            as="h2"
            marginTop={{
              base: '25px',
            }}>
            What is PBA?
          </Heading>
          <Text fontSize="16px" fontWeight="400" color="#696984" lineHeight="21.28px">
            Persona Business Academy is a branch of the American company Persona Media Group in
            Armenia. We emphasize academics education, we collaborate with professionals with
            qualifications approved by the academy, providing the best educational programs for our
            students, both in IT and other fields. Persona, cooperating with a number of well-known
            companies in Armenia, supports newly graduated students to cooperate with leading
            companies in the market.
          </Text>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
          gap="20px">
          <Box
            width="590px"
            as={Link}
            href={OFFLINE_COURSES_ROUTE}
            borderRadius="20px"
            padding="45px 0"
            display="flex"
            alignItems="center"
            transition="all 0.3s"
            _hover={{
              bg: '#F6FCFF',
            }}
            flexDirection="column">
            <Box>
              <Image src="./icons/for_individuals.svg" alt="" width={108} height={108} />
            </Box>

            <Text
              mt="8px"
              color="#BABABA"
              margin="0 0 16px 0"
              lineHeight="42.56px"
              fontSize="32px"
              fontWeight="700">
              for
              <span style={{ color: '#1F1646', marginLeft: '15px', textTransform: 'uppercase' }}>
                individuals
              </span>
            </Text>

            <MovableButton btnText="Start a class today" />
          </Box>

          <Box
            width="590px"
            as={Link}
            href={FOR_KIDS_ROUTE}
            _hover={{
              bg: '#F6FCFF',
            }}
            borderRadius="20px"
            transition="all 0.3s"
            padding="45px 0"
            display="flex"
            alignItems="center"
            flexDirection="column">
            <Box width="108px" height="108px">
              <Image src="./icons/for_kids.svg" alt="Kids Icon" width={108} height={108} />
            </Box>

            <Text
              color="#BABABA"
              mt="8px"
              margin="0 0 16px 0"
              lineHeight="42.56px"
              fontSize="32px"
              fontWeight="700">
              for
              <span style={{ color: '#1F1646', marginLeft: '15px' }}>Kids</span>
            </Text>

            <MovableButton btnText="Start a class today" />
          </Box>
        </Box>
      </Box>

      <Box mb={{ base: '36px', lg: '148px' }}>
        <Box color="#222222" maxW="846px" margin="0 auto 40px" textAlign="center">
          <Heading
            lineHeight={{ base: '31.92px', xl: '42.56px' }}
            fontSize={{ base: '24px', xl: '32px' }}
            fontWeight="700"
            margin="0 0 16px 0"
            as="h2">
            Talent Transformation Program
          </Heading>
          <Text fontSize="16px" fontWeight="400" color="#696984" lineHeight="21.28px">
            Where the classroom becomes your launchpad, and knowledge takes flight through hands-on
            experience and face-to-face guidance.
          </Text>
        </Box>

        <Box>
          <Flex
            justifyContent={{
              base: 'center',
              lg: 'space-between',
              xl: 'space-between',
            }}
            color="#222222"
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
            gap={{ base: '26px', lg: '60px' }}>
            <Box
              width="424px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center">
              <Image
                src="/icons/transformation_program.svg"
                alt="Should icon"
                width={128}
                height={128}
              />
              <Text
                display={{ base: 'none', lg: 'block' }}
                textAlign="center"
                fontSize="32px"
                fontWeight="700"
                lineHeight="42.56px"
                margin="36px 0 0 0">
                We believe that our transformation program will transform not only your knowledge in
                the IT world but also in your life
              </Text>
            </Box>

            <Box width="654px">
              <Box
                gap={{
                  base: '24px',
                  lg: '60px',
                }}
                display="flex">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box width="24px" height="24px">
                    <Image src="/icons/done_icon_homepage.svg" alt="Done" width={24} height={24} />
                  </Box>

                  <Box width="2px" height="100%" bg="#1F1646"></Box>
                </Box>

                <Box mb="64px">
                  <Heading
                    margin="0 0 16px 0"
                    as="h3"
                    lineHeight={{
                      base: '26.6px',
                      lg: '31.92px',
                    }}
                    fontSize={{
                      base: '20px',
                      lg: '24px',
                    }}
                    fontWeight="700"
                    color="#222222">
                    Start
                  </Heading>
                  <Text
                    margin="0"
                    color="#5B5B5B"
                    lineHeight="21.28px"
                    fontSize="16px"
                    fontWeight="400">
                    The period of courses at a business academy represents an immersive educational
                    journey designed to provide students with comprehensive knowledge, practical
                    skills, and a deep understanding of various aspects of the business world. This
                    period typically encompasses a structured curriculum that covers fundamental
                    business principles, specialized coursework, and hands-on training aimed at
                    nurturing well-rounded professionals with the ability to thrive in diverse
                    business environments.
                  </Text>
                </Box>
              </Box>

              <Box
                gap={{
                  base: '24px',
                  lg: '60px',
                }}
                display="flex">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box width="24px" height="24px">
                    <Image src="/icons/done_icon_homepage.svg" alt="Done" width={24} height={24} />
                  </Box>

                  <Box width="2px" height="100%" bg="#1F1646"></Box>
                </Box>

                <Box mb="64px">
                  <Heading
                    margin="0 0 16px 0"
                    as="h3"
                    lineHeight={{
                      base: '26.6px',
                      lg: '31.92px',
                    }}
                    fontSize={{
                      base: '20px',
                      lg: '24px',
                    }}
                    fontWeight="700"
                    color="#222222">
                    Believe
                  </Heading>
                  <Text
                    margin="0"
                    color="#5B5B5B"
                    lineHeight="21.28px"
                    fontSize="16px"
                    fontWeight="400">
                    By providing hands-on training, interactive workshops, and industry-relevant
                    case studies, our business academy ensures that students gain a deep
                    understanding of business fundamentals and are well-prepared to tackle complex
                    challenges in the workplace. The practical application of learned concepts
                    allows students to develop problem-solving skills, strategic thinking, and
                    effective decision-making abilities, which are essential for thriving in the
                    dynamic business environment.
                  </Text>
                </Box>
              </Box>

              <Box
                gap={{
                  base: '24px',
                  lg: '60px',
                }}
                display="flex">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box width="24px" height="24px">
                    <Image src="/icons/done_icon_homepage.svg" alt="Done" width={24} height={24} />
                  </Box>

                  <Box width="2px" height="100%" bg="#1F1646"></Box>
                </Box>

                <Box>
                  <Heading
                    margin="0 0 16px 0"
                    as="h3"
                    lineHeight={{
                      base: '26.6px',
                      lg: '31.92px',
                    }}
                    fontSize={{
                      base: '20px',
                      lg: '24px',
                    }}
                    fontWeight="700"
                    color="#222222">
                    Success
                  </Heading>
                  <Text
                    margin="0"
                    color="#5B5B5B"
                    lineHeight="21.28px"
                    fontSize="16px"
                    fontWeight="400">
                    Passing exams at persona business academy signifies the culmination of rigorous
                    preparation, dedication, and a comprehensive understanding of the fundamental
                    concepts and principles within the realm of business studies. It reflects a
                    student's ability to apply theoretical knowledge to practical scenarios,
                    demonstrate critical thinking skills, and showcase a deep comprehension of
                    various business disciplines. The process of passing exams at a business academy
                    often involves thorough preparation, including extensive study of course
                    materials, active participation in classroom discussions, and engagement in
                    collaborative learning activities.
                  </Text>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box mb={{ base: '36px', lg: '148px' }}>
        <Box
          color="#222222"
          maxW="846px"
          margin={{
            base: '0 auto 20px',
            lg: '0 auto 40px',
          }}
          textAlign="center">
          <Heading
            lineHeight={{
              base: '31.92px',
              lg: '42.56px',
            }}
            fontSize={{ base: '24px', lg: '32px' }}
            fontWeight="700"
            margin="0 0 16px 0"
            as="h2">
            Explore Inspiring Courses
          </Heading>
          <Text fontSize="16px" fontWeight="400" color="#696984" margin="0" lineHeight="21.28px">
            We drive our clients growth through innovation and hard work
          </Text>
        </Box>

        <Flex flexDirection="column" gap={16}>
          <UnorderedList
            margin="0"
            listStyleType="none"
            display="flex"
            justifyContent="center"
            gap="16px"
            flexWrap="wrap">
            {(offlineCourseListNames || []).reduce((acc, course, index) => {
              if ([24, 7, 6, 27, 28, 25, 26, 23, 17, 9, 21].includes(course.id)) {
                acc.push(
                  <ListItem
                    key={index}
                    as={Link}
                    href={`${OFFLINE_COURSES_ROUTE}/${generateCourseName(course.title)}/${course.id}`}>
                    <OutlinedButton>{course.title}</OutlinedButton>
                  </ListItem>,
                );
              }
              return acc;
            }, [] as any)}
          </UnorderedList>
        </Flex>
      </Box>
    </Container>
  );
};

export default PersonaIntroSection;
