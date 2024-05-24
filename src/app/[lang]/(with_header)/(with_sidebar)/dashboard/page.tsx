import React from 'react';
import { Avatar, Box, Container, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { generateUserAvatar } from '@/utils/helpers/aws';
import { getUserData } from '@/utils/helpers/user';

const Dashboard = async () => {
  const session = await serverSession();
  const t = await getTranslations();

  if (!session?.user) {
    return null;
  }

  const userData = getUserData(session.user);

  return (
    <Container maxW={{ base: '95%', md: '80%' }} mt="50px">
      <Box
        bg="#319795"
        maxW="100%"
        height="150px"
        borderRadius="25px"
        backgroundPosition="50%"
        backgroundRepeat="no-repeat"
        position="relative">
        <Flex
          alignItems="center"
          gap="20px"
          w="90%"
          left="5%"
          transform="translateY(50%)"
          position="absolute"
          backdropFilter="saturate(200%) blur(50px)"
          boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
          borderRadius="20px"
          background="hsla(0,0%,100%,.8)"
          p="24px">
          <Avatar
            name={`${session?.user.firstName} ${session?.user.lastName}`}
            src={generateUserAvatar(session.user)}
            bg="#F3F4F6"
            color="#C0C0C0"
            size="xl"
          />
          <Text fontSize={{ base: '18px', sm: '24px' }} fontWeight={700} lineHeight="normal">
            {`${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`}
          </Text>
        </Flex>
      </Box>
      <Box
        maxW="1116px"
        m="100px auto 0 auto"
        p="20px"
        borderRadius="25px"
        border="2px solid #319795">
        <Text
          fontSize={{ base: '18px', sm: '30px' }}
          fontWeight={700}
          color="#1f2733"
          m="0 0 30px 10px">
          Profile Information
        </Text>
        <Flex>
          <UnorderedList>
            {userData.map(field => (
              <ListItem
                key={field.id}
                display="flex"
                color="#1f2733"
                fontSize={{ base: '16px', sm: '20px' }}>
                <Text as="span" color="#1f2733" fontWeight={700} lineHeight="normal" mr="20px">
                  {t(field.title)}:
                </Text>
                <Text color="#718096">{field.value}</Text>
              </ListItem>
            ))}
          </UnorderedList>
        </Flex>
      </Box>
    </Container>
  );
};

export default Dashboard;
