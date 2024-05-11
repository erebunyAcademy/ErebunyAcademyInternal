import React from 'react';
import { Avatar, Container, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { getUserData } from '@/utils/helpers/user';

const Dashboard = async () => {
  const session = await serverSession();

  if (!session?.user) {
    return null;
  }
  const userData = getUserData(session.user);

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
        <UnorderedList w="500px">
          {userData.map(field => (
            <ListItem key={field.id} display="flex" justifyContent="space-between">
              <Text
                as="span"
                fontSize={{ base: '16px', sm: '24px' }}
                fontWeight={700}
                lineHeight="normal">
                {field.title}:
              </Text>
              {field.value}
            </ListItem>
          ))}
        </UnorderedList>
      </Flex>
    </Container>
  );
};

export default Dashboard;
