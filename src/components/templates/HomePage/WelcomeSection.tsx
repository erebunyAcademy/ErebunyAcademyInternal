import React, { FC } from 'react';
import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import CourseTopicBlock from '@/components/atoms/CourseTopicBlock';
import { courseTopicBlock } from '@/utils/constants/course-topic-block';
import {
  CONTACT_US_ROUTE,
  LEADERSHIP_ROUTE,
  OFFLINE_COURSES_ROUTE,
} from '@/utils/constants/routes';

type WelcomeSectionProps = {};

const commonFontStyle = {
  lineHeight: '21.28px',
  fontWeight: 700,
};

const WelcomeSection: FC<WelcomeSectionProps> = () => {
  return (
    <Box
      mb={{
        base: '0',
        md: '148px',
      }}
      borderRadius={{
        base: '0 0 16px 16px',
        lg: '0 0 74px  74px',
      }}
      backgroundColor="#F6FCFF"
      padding={{
        base: '36px 10px ',
        lg: '50px 20px',
        xl: '78px 0 86px',
      }}>
      <Container as="section" padding={0} maxWidth="1200px" margin="0 auto">
        <Flex
          marginBottom="54px"
          alignItems="center"
          justifyContent={{
            base: 'center',
            lg: 'space-between',
          }}
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          <Flex maxW={{ base: '100%', md: '490px' }} flexDirection="column">
            <Heading
              as="h1"
              margin="0 0 16px 0"
              fontSize={{ base: '28px', md: '32px' }}
              color="#1F1646"
              textAlign={{ base: 'center', lg: 'left' }}
              lineHeight={{ base: '37.24px', xl: '53.64px' }}>
              Welcome to
              <Text as="span" textTransform="uppercase" color="#3CB3E5">
                &nbsp;PBA
              </Text>
            </Heading>

            <Text
              fontSize="16px"
              color="#171717"
              marginBottom={{ base: '10px', xl: '32px' }}
              {...commonFontStyle}
              fontWeight={400}
              textAlign={{
                base: 'center',
                lg: 'left',
              }}>
              Join us on this transformative journey, where every lesson learned becomes a stepping
              stone towards a brighter, more promising future, for each individual and our
              collective society.Welcome to first Armenian leading educational platform.
            </Text>

            <Flex
              gap="24px"
              alignItems="center"
              justifyContent={{ base: 'center', lg: 'flex-start' }}>
              <Button
                as={Link}
                width="177px"
                href={OFFLINE_COURSES_ROUTE}
                height="53px"
                fontSize="16px"
                fontWeight="400"
                lineHeight="21.28px"
                bg="#3CB4E7"
                color="#FFFFFF"
                _hover={{
                  bg: 'blue.400',
                  color: '#FFFFFF',
                }}
                _focus={{
                  bg: 'blue.500',
                  color: '#FFFFFF',
                }}
                _focusVisible={{
                  bg: 'blue.500',
                  color: '#FFFFFF',
                }}>
                Find your Course
              </Button>

              <Text
                as={Link}
                variant="link"
                fontSize="16px"
                fontWeight="400"
                lineHeight="21.28px"
                href={CONTACT_US_ROUTE}
                bg="#F6FCFF"
                color="#222222"
                _hover={{ background: 'none' }}
                _focus={{ bg: 'transparent' }}>
                Have a Question?
              </Text>
            </Flex>
          </Flex>

          <Flex
            marginTop="76px"
            position="relative"
            justifyContent="center"
            width={{
              base: '211px',
              md: '636px',
            }}>
            <Box display="flex" justifyContent="center">
              <Box
                as={Link}
                href="/#feedback"
                zIndex="1"
                bg="#FFFFFFCC"
                left={{ base: '-60px', md: '-30px' }}
                bottom={{ base: '45px', md: '70px' }}
                position="absolute"
                width={{ base: ' 119px', md: '181px' }}
                transition="all 0.3s"
                padding={{
                  base: '8px',
                  md: '16px 32px',
                }}
                _hover={{
                  boxShadow: '0px 8.711px 21.777px 0px rgba(0, 0, 0, 0.10)',
                }}
                borderRadius="20px">
                <Text
                  margin="0"
                  fontWeight="700"
                  lineHeight={{
                    base: ' 21.28px',
                    md: '31.92px',
                  }}
                  fontSize={{ base: ' 16px', md: '24px' }}>
                  3000+
                </Text>
                <Text
                  margin="0"
                  fontWeight="400"
                  lineHeight="21.28px"
                  fontSize={{ base: ' 14px', sm: '14px', xl: '16px' }}>
                  Assisted Student
                </Text>
              </Box>

              <Box
                as={Link}
                href={OFFLINE_COURSES_ROUTE}
                zIndex="1"
                bg="#FFFFFFCC"
                top={{ base: '20px', md: '75px' }}
                left={{ base: '-35px', md: '40px' }}
                position="absolute"
                transition="all 0.3s"
                padding={{
                  base: '8px',
                  md: '16px 32px',
                }}
                borderRadius="20px"
                _hover={{
                  boxShadow: '0px 8.711px 21.777px 0px rgba(0, 0, 0, 0.10)',
                }}>
                <Text
                  margin="0"
                  fontWeight="700"
                  lineHeight={{
                    base: ' 21.28px',
                    md: '31.92px',
                    xl: '31.92px',
                  }}
                  fontSize={{
                    base: ' 16px',
                    md: '24px',
                    xl: '24px',
                  }}>
                  20+
                </Text>
                <Text
                  margin="0"
                  fontWeight="400"
                  lineHeight={{
                    base: '18.62px',
                    md: '21.28px',
                    xl: '21.28px',
                  }}
                  fontSize={{ base: ' 14px', md: '16px' }}>
                  Courses
                </Text>
              </Box>

              <Box
                zIndex="1"
                as={Link}
                href={LEADERSHIP_ROUTE}
                bg="#FFFFFFCC"
                top={{ base: '80px', md: '140px' }}
                right={{ base: '-30px', md: '45px' }}
                position="absolute"
                transition="all 0.3s"
                padding={{
                  base: '8px',
                  md: '16px 32px',
                }}
                borderRadius="20px"
                _hover={{
                  boxShadow: '0px 8.711px 21.777px 0px rgba(0, 0, 0, 0.10)',
                }}>
                <Text
                  margin="0"
                  fontWeight="700"
                  lineHeight={{
                    base: ' 21.28px',
                    md: '31.92px',
                  }}
                  fontSize={{
                    base: ' 16px',
                    md: '24px',
                  }}>
                  15+
                </Text>
                <Text
                  margin="0"
                  fontWeight="400"
                  lineHeight={{
                    base: '18.62px',
                    md: '21.28px',
                  }}
                  fontSize={{ base: ' 14px', lg: '16px' }}>
                  Experts
                </Text>
              </Box>

              <Box
                position="relative"
                width={{ base: '211px', md: '376px' }}
                height={{ base: '305px', md: '542px' }}>
                <Box
                  width={{ base: '93px', md: '166px' }}
                  top="0"
                  left="0"
                  borderTopLeftRadius={{ base: '40px', md: '80px' }}
                  overflow="hidden"
                  border="1px solid transparent"
                  position="absolute"
                  height={{ base: '92px', md: '164px' }}>
                  <Image
                    fill
                    src="/images/public_available/first_img_pba_welcome.webp"
                    alt="Students img"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Box
                  width={{ base: '93px', md: '166px' }}
                  height={{ base: '187px', md: '332px' }}
                  position="absolute"
                  borderBottomRightRadius={{ base: '40px', md: '80px' }}
                  border="1px solid transparent"
                  overflow="hidden"
                  bottom="0">
                  <Image
                    fill
                    src="/images/public_available/second_img_pba_welcome.webp"
                    alt="Student img"
                    style={{
                      objectFit: 'cover',
                    }}
                    sizes="100%"
                  />
                </Box>
                <Box
                  width={{ base: '93px', md: '166px' }}
                  position="absolute"
                  overflow="hidden"
                  borderTopRightRadius={{ base: '40px', md: '80px' }}
                  borderBottomRightRadius={{ base: '40px', md: '80px' }}
                  border="1px solid transparent"
                  top="0"
                  right="0"
                  height={{ base: '211px', md: '376px' }}>
                  <Image
                    src="/images/public_available/third_img_welcome.webp"
                    fill
                    alt="Student img"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Flex>
        </Flex>

        <Box>
          <Box mb={{ base: '0 ', lg: '40px' }}>
            <Heading
              as="h2"
              margin="0 0 16px 0"
              lineHeight="31.92px"
              fontWeight="700"
              fontSize={{ base: '24px ', lg: '32px' }}
              textAlign={{
                base: 'center',
                xl: 'left',
              }}>
              Popular topics to learn now
            </Heading>
          </Box>

          <Flex>
            <Box
              width="100%"
              display="flex"
              gap={{ base: '17px', lg: '20px' }}
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap">
              {courseTopicBlock.map(courseBlock => (
                <CourseTopicBlock
                  link={courseBlock.link}
                  imgName={courseBlock.imgName}
                  key={courseBlock.id}
                  imgSrc={courseBlock.imgSrc}
                />
              ))}
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomeSection;
