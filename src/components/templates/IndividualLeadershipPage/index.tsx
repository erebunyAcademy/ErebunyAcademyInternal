'use client';
import { FC } from 'react';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { MemberType } from '@/types/member';
import { segoe } from '@/utils/constants/fonts';

type LeadershipIndividualPageProps = {
  member: MemberType;
};

const LeadershipIndividualPage: FC<LeadershipIndividualPageProps> = ({ member }) => {
  return (
    <Container
      maxWidth={1200}
      margin="0 auto"
      my={{ base: '36px', xl: '148px' }}
      px={{ base: '16px', xl: '0' }}>
      <Flex flexDirection="column" gap="24px">
        <Flex
          flexDirection="column"
          gap={{ base: '8px', md: '14px' }}
          maxWidth="387px"
          textAlign="center"
          margin={{ base: '0 auto', lg: '0' }}>
          <Heading
            className={segoe.className}
            color="#222"
            fontSize="28px"
            fontWeight={{ base: 600, md: 700 }}
            fontStyle="normal"
            lineHeight="36px">
            {member.firstName} {member.lastName}
          </Heading>
          <Text
            color="#5b5b5b"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            lineHeight="22px">
            {member.position}
            {member.founder}
          </Text>
        </Flex>
        <Flex
          gap="20px"
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
          alignItems="center"
          justifyContent="center">
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            margin={{ base: '0 auto', lg: '0' }}>
            <Box
              maxW={{ base: '100%', md: '387px' }}
              borderRadius="10.556px 10.556px 70.374px 10.556px"
              overflow="hidden"
              marginBottom="24px">
              <Image
                width={387}
                height={332}
                src={member.avatarSrc}
                alt={`${member.firstName} ${member.lastName} `}
              />
            </Box>
            <Flex justifyContent="center">
              <Text
                as={Link}
                href={member.linkedinAccount}
                textAlign="center"
                display="inline-block"
                fontSize="16px"
                fontWeight={400}
                color="#222"
                borderBottom="1px solid"
                borderColor="#222"
                paddingBottom="2px"
                _hover={{
                  color: '#5B5B5B',
                  borderColor: '#5B5B5B',
                }}>
                View Linkedin page
              </Text>
            </Flex>
          </Box>

          <Box width="793px" alignSelf="flex-start">
            <Text
              color="#000"
              fontSize="16px"
              fontWeight={400}
              fontStyle="normal"
              lineHeight="22px"
              whiteSpace="pre-line">
              {member.biography}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};

export default LeadershipIndividualPage;
