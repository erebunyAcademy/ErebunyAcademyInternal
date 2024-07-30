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
import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';

const ScheduleDetails = async ({ params }: { params: { scheduleId: string } }) => {
  const scheduleData = await ScheduleResolver.getCyclicSchedule(params.scheduleId);

  const t = await getTranslations();

  return (
    <Box m={{ base: '16px', lg: '40px' }} width="100%">
      <Box fontSize={{ base: '16px', lg: '18px' }}>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('title')}:
          </Text>
          {scheduleData.title}
        </Text>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('description')}:
          </Text>
          {scheduleData.description}
        </Text>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('examType')}:
          </Text>
          {scheduleData.examType}
        </Text>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('examDay')}:
          </Text>
          {dayjs(scheduleData.examDate).format('DD/MM/YYYY')}
        </Text>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('startDay')}:
          </Text>
          {dayjs(scheduleData.startDayDate).format('DD/MM/YYYY')}
        </Text>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('endDay')}:
          </Text>
          {dayjs(scheduleData.endDayDate).format('DD/MM/YYYY')}
        </Text>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('totalHours')}:
          </Text>
          {scheduleData.totalHours}
        </Text>

        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('subject')}:
          </Text>
          {scheduleData.subject.title}
        </Text>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('courseGroup')}:
          </Text>
          {scheduleData.courseGroup.title}
        </Text>
        <Text>
          <Text as="span" fontWeight={500} mr="10px">
            {t('lecturer')}:
          </Text>
          {scheduleData.scheduleTeachers[0].teacher.user.firstName}{' '}
          {scheduleData.scheduleTeachers[0].teacher.user.lastName}
        </Text>
      </Box>
      <Divider mt="20px" />

      <Flex
        my={{ base: '15px', lg: '30px' }}
        flexDirection="column"
        gap={{ base: '15px', lg: '30px' }}>
        <Heading fontSize={{ base: '25px', lg: '30px' }} fontWeight={500} textAlign="center">
          {t('thematicPlans')}
        </Heading>
        {scheduleData.thematicPlan.map(tPlan => (
          <Box
            key={tPlan.id}
            border="1px solid #ccc"
            p={{ base: '10px', lg: '20px' }}
            fontSize="17px">
            <Text>
              {t('totalHours')}:{'  '} {tPlan.totalHours}
            </Text>
            <Text>
              {t('thematicPlanType')}:{'  '} {tPlan.type}
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
        ))}
      </Flex>

      <Divider />

      <Box maxWidth="1500px" overflow="auto" mb="40px">
        <Text
          fontSize={{ base: '20px', lg: '25px' }}
          fontWeight={500}
          my={{ base: '15px', lg: '30px' }}>
          {t('referencesUsed')}
        </Text>
        <Flex gap={{ base: '30px', md: '80px' }} flexDirection={{ base: 'column', md: 'row' }}>
          <Flex gap="30px" flexDirection="column" alignItems="flex-start">
            {scheduleData.links?.map((link: string, index: number) => (
              <Button variant="link" as="a" href={link} key={index} fontSize="16px">
                {link}
              </Button>
            ))}
          </Flex>
          <Flex gap="30px" flexDirection="column" alignItems="flex-start">
            {scheduleData.attachment.map((attachment, index: number) => (
              <Button
                fontSize="16px"
                variant="link"
                as="a"
                href={`/api/download?path=uploads/${attachment.key}`}
                key={index}>
                {attachment.title}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default ScheduleDetails;
