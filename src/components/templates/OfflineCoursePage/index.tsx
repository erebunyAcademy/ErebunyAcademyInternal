'use client';
import React, { FC, useCallback, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { OfflineCourseService } from '@/api/services/OfflineCourseService';
import { Button, Loading } from '@/components/atoms';
import ApplyCourse from '@/components/molecules/ApplyCourse';
import RequestAnotherTimeModal from '@/components/molecules/RequetAnotherTImeModal';
import TimeLine from '@/components/molecules/TimeLine';
import { OfflineCourseItemModel } from '@/models/offline-course.model';
import { segoe } from '@/utils/constants/fonts';
import { generateAWSUrl } from '@/utils/helpers/common';
import { RequestAnotherTimeValidation } from '@/utils/validation/offline-course';

const Slide = dynamic(() => import('@/components/molecules/Swiper'), { ssr: false });
const StudentCommentSlide = dynamic(() => import('@/components/molecules/StudentCommentsSlide'), {
  ssr: false,
});

type OfflineCoursePageProps = {
  offlineCourse: OfflineCourseItemModel;
};

const OfflineCoursePage: FC<OfflineCoursePageProps> = ({ offlineCourse }) => {
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate, isLoading } = useMutation<
    boolean,
    { message: string },
    RequestAnotherTimeValidation
  >(data => OfflineCourseService.requestTime(offlineCourse.id, data), {
    onSuccess: () => {
      onClose();
      setSelectedStartTime('');
      toast({ title: 'Your request was successfully sent', status: 'success' });
    },
  });

  const timeSubmitHandler = useCallback(
    (data: RequestAnotherTimeValidation) => {
      mutate({ ...data, startTime: selectedStartTime || data.startTime });
    },
    [mutate, selectedStartTime],
  );

  const selectStartTimeHandler = useCallback(
    (startTime: string) => {
      setSelectedStartTime(startTime);
      onOpen();
    },
    [onOpen],
  );
  return (
    <>
      {isLoading && <Loading />}
      <Box
        borderRadius="0 0 72px 72px"
        bg="#F6FCFF"
        padding={{
          base: '0 16px ',
          lg: ' 0',
        }}>
        <Container maxW="1200px" padding="0 0 82px 0" position="relative">
          <Flex
            gap={{
              base: '24px',
              lg: '122px',
            }}
            justifyContent="center"
            alignItems="center"
            padding="24px 0"
            flexWrap={{
              base: 'wrap-reverse',
              lg: 'nowrap',
            }}>
            <Box maxW="488px" color="#222222" textAlign="center">
              <Heading
                margin="0  0 8px 0"
                as="h2"
                color="#1F1646"
                lineHeight={{
                  base: '34.13px',
                  lg: '53.64px',
                }}
                textAlign="center"
                fontSize={{ base: '28px', lg: '44px' }}>
                {offlineCourse.title}
              </Heading>
              <Box lineHeight="18.75px" fontSize="16px" mb="24px">
                <Text as="p" margin="0" lineHeight="18.75px" fontSize="16px">
                  {offlineCourse.subTitle}
                </Text>
              </Box>

              <Flex gap="16px" alignItems="center" justifyContent="center" flexWrap="wrap">
                <Text
                  bg="transparent"
                  as={Link}
                  href="#apply-course"
                  border=" 1px solid #3CB4E7"
                  color="#3CB4E7"
                  fontWeight="700"
                  lineHeight="21.28px"
                  fontSize="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="6px"
                  height="37px"
                  width="124px">
                  Apply now
                </Text>
                <Text
                  padding="16px 0"
                  as="a"
                  href={generateAWSUrl(offlineCourse.pdf)}
                  target="_blank"
                  fontWeight="400"
                  height="100%"
                  display="flex"
                  lineHeight="21.28px"
                  fontSize="16px"
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
                  borderBottom="1px solid transparent"
                  color="#1F1646"
                  p={0}
                  transition="all 0.2s"
                  _hover={{
                    color: '#5B5B5B',
                    borderBottom: '1px solid #5B5B5B',
                  }}>
                  View program
                </Text>
              </Flex>
            </Box>

            <Box maxW="590px">
              <Box width="100%">
                <Image
                  src={generateAWSUrl(offlineCourse.coverPhoto)}
                  alt="Graphic Design"
                  width={590}
                  height={334}
                  style={{
                    borderRadius: '12px',
                    height: '334px',
                    width: '590px',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box
        maxWidth="1200px"
        position="relative"
        display="flex"
        margin="0 auto"
        flexWrap="wrap"
        gap="20px"
        transform="translateY(-80px)"
        justifyContent="center">
        <Flex
          boxShadow="0px 15px 20px 0px #0000000D"
          alignItems="center"
          flexWrap="wrap"
          justifyContent="center"
          bg="#fff"
          gap="16px"
          padding="32px"
          borderRadius="12px"
          width="753px">
          <UnorderedList
            paddingRight="16px"
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            gap="8px"
            borderRight="1px solid #C0C0C0">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Language
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              {offlineCourse.language}
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            paddingRight="16px"
            flexDirection="column"
            gap="8px"
            borderRight="1px solid #C0C0C0">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Age
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              {offlineCourse.ageLimit}
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            gap="8px"
            paddingRight={{
              base: '0',
              sm: '16px',
            }}
            borderRight={{
              base: 'none',
              sm: '1px solid #C0C0C0',
            }}>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Duration
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              {offlineCourse.totalDuration} months
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            paddingRight="16px"
            display="flex"
            flexDirection="column"
            gap="8px"
            borderRight="1px solid #C0C0C0">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Level
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              {offlineCourse.courseLevel}
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            gap="8px"
            paddingRight={{
              base: '0',
              sm: '16px',
            }}
            borderRight={{
              base: 'none',
              sm: '1px solid #C0C0C0',
            }}>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Certificate
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              By level
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            gap="8px">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Course ended
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              {offlineCourse.graduatedStudentsCount} students
            </ListItem>
          </UnorderedList>
        </Flex>

        <Flex
          boxShadow="0px 15px 20px 0px #0000000D"
          flexDirection="column"
          width="426px"
          alignItems="center"
          gap="16px"
          padding=" 16px 32px"
          borderRadius="12px"
          bg="#fff">
          <Flex alignItems="center" gap="16px">
            <Text fontWeight="400" fontSize="16px" margin="0" lineHeight="18.75px">
              Course fee
            </Text>
            <Text
              fontWeight="700"
              lineHeight="37.24px"
              as="p"
              fontSize="28px"
              margin="0"
              display="flex"
              alignItems="center">
              {offlineCourse.price}
              <Image src="/icons/dram.svg" alt="dram" width={18} height={18} /> /
              <Text fontWeight="400" fontSize="16px" lineHeight="21.28px" as="span" margin="0">
                month
              </Text>
            </Text>
          </Flex>

          <Box display="flex" gap="16px" alignItems="center">
            <Box height="53px" width={{ base: '239px', lg: '322px' }}>
              <Button
                padding="16px 32px"
                width="100%"
                height="100%"
                fontSize="16px"
                lineHeight="21.28px">
                Buy Now
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>

      <Box marginBottom={{ base: '36px ', lg: ' 148px' }}>
        <Box
          padding={{ base: '0 16px', sm: '0 16px', md: '0 16px', lg: '0', xl: '0' }}
          margin="0 auto"
          maxWidth="793px"
          color="#222222">
          <Heading
            margin={{
              base: '0 0 16px 0',
              md: '0 0 24px 0 ',
            }}
            textAlign="center"
            fontSize={{ base: '28px ', sm: '28px ', md: '32px ', lg: ' 32px', xl: ' 32px' }}
            lineHeight="42.56px"
            fontWeight="700"
            className={segoe.className}>
            Description
          </Heading>
          <Text as="p" margin="0" fontSize="16px" lineHeight="24px" fontWeight="400">
            {offlineCourse.description}
          </Text>
        </Box>
      </Box>
      <Box
        padding={{
          base: '0 16px',
          lg: '0',
        }}
        maxWidth="100%"
        marginBottom={{ base: '36px ', lg: ' 148px' }}>
        <Box marginLeft="auto" maxWidth="1560px">
          <Flex alignItems="center" gap="20px" flexWrap="wrap" justifyContent="center">
            <Box width="803px">
              <Heading
                as="h2"
                textAlign={{
                  base: 'center',
                  lg: 'left',
                }}
                margin="0 0 24px 0"
                fontSize="28px"
                lineHeight="37.24px">
                What you will Learn
              </Heading>
              <Flex gap={{ base: '16px', xl: '29px' }} flexWrap="wrap" justifyContent="center">
                <UnorderedList
                  display="grid"
                  gridTemplateColumns={{
                    base: '1fr',
                    sm: '1fr 1fr',
                  }}
                  margin="0"
                  gap="16px"
                  lineHeight="24px"
                  fontWeight="400"
                  fontSize="16px"
                  listStyleType="0"
                  color="#222222"
                  width="100%">
                  {offlineCourse.whatYouWillLearn.map((learning: string, index: number) => (
                    <ListItem
                      key={index}
                      display="flex"
                      alignItems="flex-start"
                      gap="12px"
                      width="100%">
                      <Image src="/icons/confirm_icon.svg" alt="Confirm" width={24} height={24} />
                      {learning}
                    </ListItem>
                  ))}
                </UnorderedList>
              </Flex>
            </Box>

            <Box
              width="361px"
              display="flex"
              justifyContent={{
                base: 'center ',
                xl: 'flex-start',
              }}
              padding="16px 0 16px 16px"
              bg="#F6FCFF"
              flexGrow="2"
              height="236px">
              <Box width="361px" height="204px" position="relative">
                <Image
                  src={generateAWSUrl(offlineCourse.whatYouWillLearnPhoto)}
                  alt="Learn Img"
                  style={{
                    objectFit: 'cover',
                  }}
                  fill
                />
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
      {!!offlineCourse.timeLine && (
        <TimeLine
          offlineCourse={offlineCourse}
          onOpen={onOpen}
          selectStartTimeHandler={selectStartTimeHandler}
        />
      )}
      <Box
        padding={{
          base: '0 16px ',
          lg: ' 0',
        }}>
        <Container maxWidth="1246px" padding="0">
          <Box color="#222222" marginBottom={{ base: '36px ', lg: ' 148px' }}>
            <Heading
              textAlign="center"
              as="h2"
              lineHeight={{
                base: '31.92px',
                md: '37.24px ',
              }}
              margin={{
                base: '0 0 16px 0',
                lg: '0 0 40px 0',
              }}
              fontSize={{ base: '24px', lg: '32px' }}
              fontWeight="700">
              Course instructors
            </Heading>

            <Flex
              margin="0 auto"
              gap="20px"
              justifyContent="center"
              justifyItems="center"
              alignItems="center"
              flexDirection={{ base: 'column', md: 'row' }}>
              {offlineCourse.courseInstructors.map((instructor, index: number) => (
                <>
                  <Box key={index} maxWidth="590px">
                    <Flex
                      mb="24px"
                      borderRadius="12px"
                      flexDirection="column"
                      gap="16px"
                      alignItems="center"
                      bg="#ECF7FC"
                      padding="48px">
                      <Box>
                        <Image
                          src="/icons/quote.svg"
                          alt="comma"
                          width={24.5}
                          height={19.9}
                          style={{
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                      <Text
                        textAlign="center"
                        margin="0"
                        as="span"
                        lineHeight={{
                          base: '18.75px ',
                          lg: '21.28px',
                        }}
                        fontSize="16px">
                        {instructor.about}
                      </Text>
                    </Flex>

                    <Flex flexDirection="column" alignItems="center" gap="8px">
                      <Box
                        width={74}
                        height={74}
                        position="relative"
                        borderRadius="50%"
                        overflow="auto">
                        <Image
                          src={generateAWSUrl(instructor.avatar)}
                          alt={[instructor.firstName, instructor.lastName].join(' ')}
                          fill
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                      </Box>

                      <UnorderedList
                        borderBottom="1px solid #E9E8ED"
                        margin="0"
                        display="flex"
                        fontSize="16px"
                        flexDirection="column"
                        alignItems="center">
                        <ListItem mb="8px" lineHeight="16px" fontWeight="600" as="span">
                          {instructor.firstName} {instructor.lastName}
                        </ListItem>
                        <ListItem
                          mb="8px"
                          as="span"
                          color="#5B5B5B"
                          lineHeight="21.28px"
                          fontWeight="400">
                          {instructor.profession}
                        </ListItem>
                      </UnorderedList>

                      <UnorderedList
                        margin="0"
                        display="flex"
                        flexDirection="column"
                        alignItems="center">
                        <ListItem as="span" fontSize="16px" lineHeight="21.28px" fontWeight="400">
                          Enrolled:
                          <Text as="span" fontWeight="700">
                            {instructor.enrolledStudentsCount}
                          </Text>
                        </ListItem>
                        <ListItem as="span" fontSize="16px" lineHeight="21.28px" fontWeight="400">
                          Graduated:
                          <Text as="span" fontWeight="700">
                            {instructor.graduatedStudentsCount}
                          </Text>
                        </ListItem>
                      </UnorderedList>
                    </Flex>
                  </Box>
                </>
              ))}
            </Flex>
          </Box>
          <Slide
            offlineCourseVideo={offlineCourse.offlineCourseVideos}
            courseName={offlineCourse.title}
          />

          <Box marginBottom={{ base: '36px ', lg: ' 148px' }}>
            <Box
              textAlign="center"
              maxW="673px"
              margin={{
                base: '0 auto 20px',
                md: '0 auto 40px ',
              }}>
              <Heading
                color="#222222"
                as="h2"
                margin={{
                  base: '0 0 16px 0',
                  md: '0 0 24px 0 ',
                }}
                fontWeight="700"
                lineHeight={{
                  base: '31.92px',
                  sm: '31.92px',
                  md: '37.24px ',
                }}
                fontSize={{ base: '24px', md: '32px ' }}>
                Chart Your Course to Certification: Your Gateway to Success
              </Heading>
              <Text
                color="#747474"
                as="p"
                margin="0"
                lineHeight="24px"
                fontSize="16px"
                fontWeight="400">
                Empower Your Journey: Transform Learning into Achievement with Certificates Earned
                After Each Course Completion. Elevate Your Expertise and Showcase Your Skills with
                Pride
              </Text>
            </Box>

            <Flex
              maxW="1200px"
              margin="0 auto"
              gap={{ base: '20px', md: '67px' }}
              flexWrap="wrap"
              justifyContent="center">
              <Box width="590px">
                <Accordion
                  maxWidth="590px"
                  display="flex"
                  flexDirection="column"
                  gap="16px"
                  allowMultiple>
                  <AccordionItem
                    boxShadow="0px 2px 4px 0px #0000001F"
                    borderRadius="12px"
                    padding="24px"
                    border="none">
                    <AccordionButton
                      padding="0"
                      _hover={{ background: 'trnsparents' }}
                      display="flex"
                      alignItems="center"
                      gap="8px">
                      <Box>
                        <Image
                          src="/icons/result_course_icon.svg"
                          alt="Icon"
                          width={32}
                          height={32}
                        />
                      </Box>

                      <Box
                        as="span"
                        padding="0"
                        flex="1"
                        fontSize="24px"
                        fontWeight="700"
                        textAlign="left"
                        lineHeight="31.92px">
                        1. Advanced courses
                      </Box>
                    </AccordionButton>
                    <AccordionPanel
                      maxWidth="502px"
                      padding="0"
                      ml="auto"
                      lineHeight="18.75px"
                      color="#5B5B5B">
                      Dive into Excellence with Our Advanced Courses. Elevate Your Skills, Expand
                      Your Knowledge, and Propel Your Career Forward. The Future of Mastery Begins
                      Here
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    boxShadow="0px 2px 4px 0px #0000001F"
                    borderRadius="12px"
                    padding="24px"
                    border="none">
                    <h2>
                      <AccordionButton
                        padding="0"
                        _hover={{ background: 'transparent' }}
                        display="flex"
                        alignItems="center"
                        gap="8px">
                        <Box>
                          <Image
                            src="/icons/result_course_icon.svg"
                            alt="Icon"
                            width={32}
                            height={32}
                          />
                        </Box>

                        <Box
                          as="span"
                          padding="0"
                          flex="1"
                          fontSize="24px"
                          fontWeight="700"
                          textAlign="left"
                          lineHeight="31.92px">
                          2. Difficult exam period
                        </Box>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      maxWidth="502px"
                      padding="0"
                      ml="auto"
                      lineHeight="18.75px"
                      color="#5B5B5B">
                      A Time of Challenge and Triumph. , Conquer the Material, and Emerge Stronger.
                      Your Success Journey Begins in the Exam Hall
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    boxShadow="0px 2px 4px 0px #0000001F"
                    borderRadius="12px"
                    padding="24px"
                    border="none">
                    <h2>
                      <AccordionButton
                        padding="0"
                        _hover={{ background: 'trnsparents' }}
                        display="flex"
                        alignItems="center"
                        gap="8px">
                        <Box>
                          <Image
                            src="/icons/result_course_icon.svg"
                            alt="Icon"
                            width={32}
                            height={32}
                          />
                        </Box>

                        <Box
                          as="span"
                          padding="0"
                          flex="1"
                          fontSize="24px"
                          fontWeight="700"
                          textAlign="left"
                          lineHeight="31.92px">
                          3.Graduation
                        </Box>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      maxWidth="502px"
                      padding="0"
                      ml="auto"
                      lineHeight="18.75px"
                      color="#5B5B5B">
                      A Journey Fulfilled, a Chapter Completed. Graduation is the Celebration of
                      Hard Work, Growth, and the Beginning of New Horizons. Here's to the Graduates
                      – Your Future Awaits
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>

              <Box maxW="590px">
                <Box width="100%">
                  <Image
                    src={generateAWSUrl(offlineCourse.graduationPhoto)}
                    alt="Students"
                    width={543}
                    height={374}
                    style={{
                      width: 543,
                      height: 374,
                      objectFit: 'cover',
                      borderRadius: '16px',
                    }}
                  />
                </Box>
              </Box>
            </Flex>
          </Box>
          <StudentCommentSlide comments={offlineCourse.comments} />
          <Box
            marginBottom={{ base: '36px ', lg: ' 148px' }}
            marginTop={{ base: '30px' }}
            id="apply-course"
            scrollMarginTop="90px">
            <Heading
              textAlign="center"
              color="#222222"
              as="h2"
              margin={{
                base: '0 0 16px 0',
                md: '0 0 40px 0',
              }}
              fontWeight="700"
              lineHeight={{
                base: '31.92px',
                md: '37.24px ',
              }}
              fontSize={{ base: '24px', md: '32px ' }}>
              Apply for course
            </Heading>
            <Box maxWidth="1200px" margin="0 auto" color="#C0C0C0" as="section">
              <ApplyCourse offlineCourseId={offlineCourse.id} />
            </Box>
          </Box>
        </Container>
      </Box>
      <RequestAnotherTimeModal
        isOpen={isOpen}
        onClose={onClose}
        timeSubmitHandler={timeSubmitHandler}
        selectedStartTime={selectedStartTime}
        resetSelectedStartTime={() => {
          setSelectedStartTime('');
        }}
      />
    </>
  );
};

export default OfflineCoursePage;
