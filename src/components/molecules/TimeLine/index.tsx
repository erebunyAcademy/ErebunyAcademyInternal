'use client';
import React, { FC } from 'react';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/atoms';
import { KidsCourseItemModel } from '@/models/kids-course.model';
import { OfflineCourseItemModel } from '@/models/offline-course.model';

const Line = dynamic(() => import('./Line'), { ssr: false });

type TimeLineProps = {
  offlineCourse: KidsCourseItemModel | OfflineCourseItemModel;
  onOpen: () => void;
  selectStartTimeHandler: (startTime: string) => void;
};

const getFormattedDate = (date: Date, opt: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', opt).format(date);

const TimeLine: FC<TimeLineProps> = ({ offlineCourse, onOpen, selectStartTimeHandler }) => {
  return (
    <Box marginBottom={{ base: '36px ', lg: ' 148px' }}>
      <Container maxWidth="895px" margin="0 auto" padding="0" color="#222222">
        <Heading
          as="h2"
          margin={{ base: '0 0 16px 0', lg: '0 0 40px 0' }}
          textAlign="center"
          fontSize={{ base: '28px', lg: '32px' }}
          lineHeight={{ base: '37.24px', lg: '42.56px' }}>
          Course Timeline
        </Heading>
        <Line entryLevel={offlineCourse.entryLevel} courseLevel={offlineCourse.courseLevel} />
        <Flex justifyContent="center" gap="20px" flexWrap="wrap">
          {offlineCourse.timeLine?.startDates.map((value, idx) => {
            const date = new Date(value);
            return (
              <Box
                key={`${date.toDateString()}/${idx}`}
                borderRadius="15px"
                width="285px"
                boxShadow="0px 4px 6px 0px #0000000F"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="8px"
                padding="23px 47px">
                <Text as="p" margin="0" fontWeight="700" fontSize="24px" lineHeight="31.92px">
                  {getFormattedDate(date, { month: 'long', day: 'numeric' })}
                </Text>
                <Text as="p" lineHeight="21.28px" fontSize="16px" fontWeight="400" margin="0">
                  {getFormattedDate(date, { weekday: 'long' })}
                </Text>
                <Text as="p" lineHeight="21.28px" fontSize="16px" fontWeight="400" margin="0">
                  {getFormattedDate(date, { hour: 'numeric', minute: 'numeric' })}
                </Text>
                <Box width="100%" mt="8px">
                  <Button
                    color="#3CB4E7"
                    padding="12px 24px"
                    height="37px"
                    width="100%"
                    border="1px solid #3CB4E7"
                    lineHeight="21.28px"
                    fontSize="16px"
                    onClick={() => selectStartTimeHandler(date.toString())}
                    background="transparent">
                    Enroll
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Flex>
        <Flex flexDirection="column" alignItems="center" gap="16px" mt="24px">
          <Text fontSize="18px" lineHeight="18px" margin="0" as="span">
            Don't see a time that works for you?
          </Text>
          <Text
            fontSize="18px"
            lineHeight="18px"
            margin="0"
            as="button"
            onClick={onOpen}
            borderBottom="1px solid #222"
            pb="2px"
            transition="all 0.2s"
            _hover={{
              color: '#5B5B5B',
              borderColor: '#5B5B5B',
            }}>
            Request another time
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default TimeLine;
