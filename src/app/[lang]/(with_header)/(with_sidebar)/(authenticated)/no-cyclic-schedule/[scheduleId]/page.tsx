import React from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';

const ScheduleDetails = async ({ params }: { params: { scheduleId: string } }) => {
  const scheduleData = await ScheduleResolver.getNoCyclicSchedule(params.scheduleId);

  return (
    <Box>
      <Text> Title: {scheduleData.title} </Text>
      <Text> Description: {scheduleData.description} </Text>
      <Text> Exam type : {scheduleData.examType} </Text>
      <Text> Total hours : {scheduleData.totalHours}</Text>
      <Text> Subject : {scheduleData.subject.title}</Text>
      <Text> Course group : {scheduleData.courseGroup.title}</Text>
      <Text>
        Lecturer : {scheduleData.scheduleTeachers[0].teacher.user.firstName}{' '}
        {scheduleData.scheduleTeachers[0].teacher.user.lastName}{' '}
      </Text>

      <Divider />

      <Flex my="30px" flexDirection="column" gap="100px">
        <Text textAlign="center"> Thematic plans </Text>
        {scheduleData.thematicPlan.map(tPlan => (
          <Box key={tPlan.id} border="1px solid #ccc">
            <Text> Title: {tPlan.title}</Text>
            <Text>Total hours: {tPlan.totalHours}</Text>
            <Text>Thematic plan type: {tPlan.type}</Text>
            <Table>
              <Thead>
                <Tr>
                  <Th>Description</Th>
                  <Th>Hour</Th>
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

      <Box>
        <Text textAlign="center">References used for material </Text>
        <Flex justifyContent="space-between">
          <Flex gap="30px" flexDirection="column">
            {scheduleData.links?.map((link: string, index: number) => (
              <Button variant="link" as="a" href={link} key={index}>
                {link}
              </Button>
            ))}
          </Flex>
          <Flex gap="30px" flexDirection="column">
            {scheduleData.attachment.map((attachment, index: number) => (
              <Button
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
