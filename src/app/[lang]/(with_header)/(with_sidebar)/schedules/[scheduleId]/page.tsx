'use client';
import React from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { ScheduleService } from '@/api/services/schedule.service';
import NoDataFound from '@/components/molecules/NoDataFound';
import { periodListData, weekendDayList } from '@/utils/constants/common';
import { GetScheduleByIdModel } from '@/utils/models/schedule';

const ScheduleDetails = ({ params }: { params: { scheduleId: string } }) => {
  const t = useTranslations();

  const { data: scheduleData } = useQuery<GetScheduleByIdModel>({
    queryKey: ['cyclic-schedule'],
    queryFn: () => ScheduleService.getScheduleById(params.scheduleId),
  });

  return (
    <Box m={{ base: '16px', lg: '40px' }} width="100%">
      <Box fontSize={{ base: '16px', lg: '18px' }} width="100%" color="#1A202C" p="10px">
        <Heading
          fontSize={{ base: '25px', lg: '30px' }}
          fontWeight={500}
          textAlign="center"
          mb="20px">
          {t('generalInfo')}
        </Heading>
        <Table
          overflowX="auto"
          variant="simple"
          mt="10px"
          width="100%"
          display="flex"
          gap={{ base: '10px', lg: '100px' }}
          flexDirection={{ base: 'column', lg: 'row' }}>
          <Tbody>
            <Tr>
              <Th>{t('title')}:</Th>
              <Td>{scheduleData?.title}</Td>
            </Tr>
            <Tr>
              <Th>{t('description')}:</Th>
              <Td>{scheduleData?.description}</Td>
            </Tr>
            <Tr>
              <Th>{t('examType')}:</Th>
              <Td>{scheduleData?.examType}</Td>
            </Tr>
            <Tr>
              <Th>{t('academicYear')}:</Th>
              <Td>{scheduleData?.academicYear}</Td>
            </Tr>
          </Tbody>
          <Tbody>
            <Tr>
              <Th>{t('totalHours')}:</Th>
              <Td>{scheduleData?.totalHours}</Td>
            </Tr>
            <Tr>
              <Th>{t('subject')}:</Th>
              <Td>{scheduleData?.subject.title}</Td>
            </Tr>
            <Tr>
              <Th>{t('courseGroup')}:</Th>
              <Td>{scheduleData?.courseGroup.title}</Td>
            </Tr>
            <Tr>
              <Th>{t('lecturer')}:</Th>
              <Td>
                {scheduleData?.scheduleTeachers[0].teacher.user.firstName}{' '}
                {scheduleData?.scheduleTeachers[0].teacher.user.lastName}
              </Td>
            </Tr>
          </Tbody>
          {scheduleData?.type === 'CYCLIC' && (
            <Tbody>
              <Tr>
                <Th>{t('examDay')}:</Th>
                <Td>{dayjs(scheduleData?.examDate).format('DD/MM/YYYY')}</Td>
              </Tr>
              <Tr>
                <Th>{t('startDay')}:</Th>
                <Td>{dayjs(scheduleData?.startDayDate).format('DD/MM/YYYY')}</Td>
              </Tr>
              <Tr>
                <Th>{t('endDay')}:</Th>
                <Td>{dayjs(scheduleData?.endDayDate).format('DD/MM/YYYY')}</Td>
              </Tr>
            </Tbody>
          )}
        </Table>
        {scheduleData?.type === 'NON_CYCLIC' && scheduleData.availableDays.length > 0 && (
          <Table mt="50px" width="500px">
            <Thead>
              <Tr>
                <Th>{t('weekDay')}</Th>
                <Th>{t('lessonOfTheDay')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {scheduleData?.availableDays.map((day, index) => (
                <Tr key={index}>
                  <Td>{weekendDayList.find(weekDay => weekDay.id === day.dayOfWeek)?.title}</Td>
                  <Td>{periodListData.find(lesson => lesson.id === day.lessonOfTheDay)?.title}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Flex
        my={{ base: '15px', lg: '40px' }}
        flexDirection="column"
        gap={{ base: '15px', lg: '30px' }}>
        <Heading fontSize={{ base: '25px', lg: '30px' }} fontWeight={500}>
          {t('thematicPlans')}
        </Heading>

        {scheduleData?.thematicPlans?.length !== 0 ? (
          scheduleData?.thematicPlans.map(tPlan => (
            <Box
              key={tPlan.id}
              border="1px solid #ccc"
              borderRadius="15px"
              p={{ base: '10px', lg: '20px' }}
              fontSize="17px"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              bg="white"
              width="100%"
              mt="20px">
              <Text fontWeight={600} mb="10px">
                {t('totalHours')}: {tPlan.totalHours}
              </Text>
              <Text fontWeight={600} mb="10px">
                {t('thematicPlanType')}: {tPlan.type}
              </Text>
              <Table mt="15px">
                <Thead>
                  <Tr>
                    <Th>{t('description')}</Th>
                    <Th>{t('hours')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tPlan.thematicPlanDescription.map(desc => (
                    <Tr key={desc.id}>
                      <Td>{desc.title}</Td>
                      <Td>{desc.hour}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ))
        ) : (
          <NoDataFound />
        )}
      </Flex>

      <Divider />

      <Box maxWidth="1500px" overflow="auto" mb="40px">
        <Text
          fontSize={{ base: '20px', lg: '25px' }}
          fontWeight={500}
          my={{ base: '15px', lg: '30px' }}>
          {t('referencesUsed')}
        </Text>
        {scheduleData?.attachment.length !== 0 || scheduleData?.links.length !== 0 ? (
          <Flex gap={{ base: '30px', md: '80px' }} flexDirection={{ base: 'column', md: 'row' }}>
            <Flex gap="30px" flexDirection="column" alignItems="flex-start">
              {scheduleData?.links?.map((link: string, index: number) => (
                <Button
                  variant="link"
                  as="a"
                  href={link}
                  key={index}
                  fontSize="16px"
                  target="_blank">
                  {link}
                </Button>
              ))}
            </Flex>
            <Flex gap="30px" flexDirection="column" alignItems="flex-start">
              {scheduleData?.attachment.map((attachment, index: number) => (
                <Button
                  fontSize="16px"
                  variant="link"
                  as="a"
                  target="_blank"
                  href={`/api/download?path=uploads/${attachment.key}`}
                  key={index}>
                  {attachment.title}
                </Button>
              ))}
            </Flex>
          </Flex>
        ) : (
          <NoDataFound />
        )}
      </Box>
    </Box>
  );
};

export default ScheduleDetails;
