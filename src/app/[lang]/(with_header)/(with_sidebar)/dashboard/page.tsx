import React from 'react';
import { Avatar, Container, Flex, Text } from '@chakra-ui/react';
import { serverSession } from '@/pages/api/auth/[...nextauth]';

const Dashboard = async () => {
  const session = await serverSession();
  console.log({ session });
  return (
    <Container maxW="80%" mt="50px">
      <Flex alignItems="center" gap="20px">
        <Avatar
          name={`${session?.user.firstName} ${session?.user.lastName}`}
          src={session?.user?.attachment?.key || ''}
          bg="#F3F4F6"
          color="#C0C0C0"
          size="xl"
        />
        <Text
          fontSize={{ base: '16px', sm: '24px' }}
          fontWeight={700}
          lineHeight="normal"
          m={{ base: '0 0 8px 0', sm: '0 0 16px 0' }}>
          {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`}
        </Text>
      </Flex>
      <Flex></Flex>
    </Container>
  );
};

export default Dashboard;
