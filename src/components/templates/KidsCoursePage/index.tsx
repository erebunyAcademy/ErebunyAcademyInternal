'use client';
import React, { FC, useCallback, useState } from 'react';
import {
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
import { KidsCourseService } from '@/api/services/KidsCourseService';
import { Button, Loading } from '@/components/atoms';
import ApplyCourse from '@/components/molecules/ApplyCourse';
import BenefitCard from '@/components/molecules/BenefitCard';
import KidCourseInstructor from '@/components/molecules/KidCourseInstructor';
import KidCourseParentsOpinion from '@/components/molecules/KidCourseParentsOpinion';
import RequestAnotherTimeModal from '@/components/molecules/RequetAnotherTImeModal';
import TimeLine from '@/components/molecules/TimeLine';
import { KidsCourseItemModel } from '@/models/kids-course.model';
import { benefitData } from '@/utils/constants/benefits';
import { segoe } from '@/utils/constants/fonts';
import { generateAWSUrl } from '@/utils/helpers/common';
import { RequestAnotherTimeValidation } from '@/utils/validation/offline-course';

const Slide = dynamic(() => import('@/components/molecules/Swiper'), { ssr: false });

type KidsCoursePageProps = {
  kidsCourse: KidsCourseItemModel;
};

const KidsCoursePage: FC<KidsCoursePageProps> = ({ kidsCourse }) => {
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate, isLoading } = useMutation<
    boolean,
    { message: string },
    RequestAnotherTimeValidation
  >(data => KidsCourseService.requestTime(kidsCourse.id, data), {
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
                fontSize={{ base: '28px', lg: '44px' }}>
                {kidsCourse.title}
              </Heading>

              <Box lineHeight="18.75px" fontSize="16px" mb="24px">
                <Text as="p" margin="0" lineHeight="18.75px" fontSize="16px">
                  {kidsCourse.subTitle}
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
                  href={generateAWSUrl(kidsCourse.pdf)}
                  target="_blank"
                  fontWeight="400"
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
                  _hover={{
                    bg: 'transparent',
                  }}
                  color="#1F1646">
                  View program
                </Text>
              </Flex>
            </Box>

            <Box maxW="590px">
              <Box width="100%">
                <Image
                  src={generateAWSUrl(kidsCourse.coverPhoto)}
                  alt="Graphic Design"
                  width={590}
                  height={334}
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
              {kidsCourse.language}
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
              {kidsCourse.ageLimit}
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
              {kidsCourse.totalDuration} months
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
              {kidsCourse.courseLevel}
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
              {kidsCourse.graduatedStudentsCount} students
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
              {kidsCourse.price}
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
        <Box padding={{ base: '0 16px', lg: '0' }} margin="0 auto" maxWidth="793px" color="#222222">
          <Heading
            margin={{
              base: '0 0 16px 0',
              sm: '0 0 16px 0 ',
            }}
            textAlign="center"
            fontSize={{ base: '28px ', md: '32px ' }}
            lineHeight="42.56px"
            fontWeight="700"
            className={segoe.className}>
            Description
          </Heading>
          <Text as="p" margin="0" fontSize="16px" lineHeight="24px" fontWeight="400">
            {kidsCourse.description}
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
                Your Child Will Learn
              </Heading>
              <Flex
                gap={{ base: '16px', xl: '29px' }}
                flexWrap="wrap"
                justifyContent="center"
                maxWidth="803px">
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
                  {kidsCourse.whatYouWillLearn.map((learning: string, index: number) => (
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
          </Flex>
        </Box>
      </Box>
      {kidsCourse.timeLine && (
        <TimeLine
          offlineCourse={kidsCourse}
          onOpen={() => {
            setSelectedStartTime('');
            onOpen();
          }}
          selectStartTimeHandler={selectStartTimeHandler}
        />
      )}
      <Box
        padding={{
          base: '0 16px ',
          lg: ' 0',
        }}>
        <Container maxWidth="1246px" padding="0">
          {kidsCourse.courseInstructors.length > 0 && (
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

              <Flex flexDirection={{ base: 'column', sm: 'row' }} margin="0 auto" gap="20px">
                {kidsCourse.courseInstructors.map(instructor => (
                  <KidCourseInstructor key={instructor.id} instructor={instructor} />
                ))}
              </Flex>
            </Box>
          )}

          <Box marginBottom="148px">
            <Flex justifyContent="center" mb="40px" flexWrap="wrap" gap="8px">
              <Text
                textAlign="center"
                as="span"
                color="#5B5B5B"
                fontFamily={segoe.className}
                fontSize="32px"
                fontStyle="normal"
                fontWeight={700}
                lineHeight="normal">
                Benefits of learning to design
              </Text>
              <Text
                as="span"
                textAlign="center"
                color="#222"
                fontFamily={segoe.className}
                fontSize="32px"
                fontStyle="normal"
                fontWeight={700}
                lineHeight="normal">
                for Kids
              </Text>
            </Flex>

            <Flex gap="20px" flexWrap="wrap" justifyContent="center">
              {benefitData.map(benefit => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </Flex>
          </Box>
          <Box my="148px">
            <KidCourseParentsOpinion />
          </Box>
          <Box>
            <Slide
              offlineCourseVideo={kidsCourse.offlineCourseVideos}
              courseName={kidsCourse.title}
            />
          </Box>
          <Box marginBottom={{ base: '36px ', lg: ' 148px' }} mt="148px">
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

            <Box maxWidth="1200px" margin="0 auto" color="#C0C0C0" as="section" id="apply-course">
              <ApplyCourse offlineCourseId={kidsCourse.id} />
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

export default KidsCoursePage;
