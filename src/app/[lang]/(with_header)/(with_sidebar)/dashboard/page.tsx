import React from 'react';
import { Avatar, Container, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { serverSession } from '@/pages/api/auth/[...nextauth]';

const Dashboard = async () => {
  const session = await serverSession();
  console.log({ session });
  return (
    <Container maxW={{ base: '95%', md: '80%' }} mt="50px">
      <Flex alignItems="center" gap="20px">
        <Avatar
          name={`${session?.user.firstName} ${session?.user.lastName}`}
          src={session?.user?.attachment?.key || ''}
          bg="#F3F4F6"
          color="#C0C0C0"
          size="xl"
        />
        <Text fontSize={{ base: '16px', sm: '24px' }} fontWeight={700} lineHeight="normal">
          {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`}
        </Text>
      </Flex>
      <Flex mt="100px">
        <UnorderedList styleType="none" width="500px">
          <ListItem display="flex" justifyContent="space-between">
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Email:
            </Text>
            {session?.user.email}
          </ListItem>
          <ListItem display="flex" justifyContent="space-between">
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Address:
            </Text>
            {session?.user.address}
          </ListItem>
          <ListItem display="flex" justifyContent="space-between">
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Country:
            </Text>
            {session?.user.country}
          </ListItem>
          <ListItem display="flex" justifyContent="space-between">
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              State:
            </Text>
            {session?.user.state}
          </ListItem>
          <ListItem display="flex" justifyContent="space-between">
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              City:
            </Text>
            {session?.user.city}
          </ListItem>
          <ListItem display="flex" justifyContent="space-between">
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Student grade:
            </Text>
            {session?.user.student?.studentGrade.title}
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Student grade group:
            </Text>
            {session?.user.student?.studentGradeGroup.title}
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Faculty:
            </Text>
            {session?.user.student?.faculty.title}
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Profession:
            </Text>
            {session?.user.teacher?.profession}
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Workplace:
            </Text>
            {session?.user.teacher?.workPlace}
          </ListItem>
          <ListItem>
            <Text
              as="span"
              fontSize={{ base: '16px', sm: '24px' }}
              fontWeight={700}
              lineHeight="normal">
              Scientific Activity:
            </Text>
            {session?.user.teacher?.scientificActivity}
          </ListItem>
        </UnorderedList>
      </Flex>
    </Container>
  );
};

export default Dashboard;
