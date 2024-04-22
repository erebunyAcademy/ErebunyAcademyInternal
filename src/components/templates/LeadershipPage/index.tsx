import React, { FC } from 'react';
import {
  Button,
  Container,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { exLeadershipData, teachersData, teamData } from '@/types/member';
import { segoe } from '@/utils/constants/fonts';
import TeamMembers from './TeamMembers';
import WelcomeLeadershipPage from './WelcomeLeadershipPage';

type Props = {};

const LeadershipPage: FC<Props> = () => {
  return (
    <>
      <Container maxWidth={1201} margin="0 auto" px={{ base: '16px', xl: '0px' }}>
        <WelcomeLeadershipPage />

        <Flex
          alignItems="center"
          flexDirection="column"
          fontStyle="normal"
          lineHeight="normal"
          marginY={{ base: '36px', md: '80px', xl: '148px' }}>
          <Heading
            className={segoe.className}
            color="#000"
            fontWeight={700}
            lineHeight={{ base: '36px', md: 'normal' }}
            fontSize={{ base: '28px', md: '32px' }}
            marginBottom={{ base: '16px', md: '20px' }}>
            Meet our Team
          </Heading>
          <Tabs width="100%" position="relative" variant="unstyled">
            <TabList
              width="343px"
              margin="0 auto"
              display="flex"
              justifyContent="center"
              gap="32px"
              marginBottom={{ base: '16px', md: '40px' }}>
              <Tab
                color="#5B5B5B"
                fontSize="14px"
                fontStyle="normal"
                lineHeight="20px"
                fontWeight={600}
                _selected={{ color: '#3CB4E7', borderBottom: '2px solid #3CB4E7' }}>
                Ex leadership
              </Tab>
              <Tab
                color="#5B5B5B"
                fontSize="14px"
                fontStyle="normal"
                lineHeight="20px"
                fontWeight={600}
                _selected={{ color: '#3CB4E7', borderBottom: '2px solid #3CB4E7' }}>
                Teachers
              </Tab>
              <Tab
                color="#5B5B5B"
                fontSize="14px"
                fontStyle="normal"
                lineHeight="20px"
                fontWeight={600}
                _selected={{ color: '#3CB4E7', borderBottom: '2px solid #3CB4E7' }}>
                Team
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <TeamMembers data={exLeadershipData} />
              </TabPanel>
              <TabPanel>
                <TeamMembers data={teachersData} />
              </TabPanel>
              <TabPanel>
                <TeamMembers data={teamData} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Container>

      <Flex px={{ base: '10px', xl: '0px' }} backgroundColor="#1f1646" py="40px" flexShrink={0}>
        <Flex
          alignItems="center"
          flexDirection="column"
          width="732px"
          margin="0 auto"
          color="#ffffff"
          fontStyle="normal">
          <Text fontSize={{ base: '24px', sm: '28px' }} fontWeight={700} lineHeight="36px">
            Join Our Team
          </Text>
          <Text
            fontSize="16px"
            fontWeight={400}
            textAlign="center"
            lineHeight="22px"
            margin="16px 0 24px 0">
            We are always on the lookout for great talent. Want to join us on our mission to help
            great teams grow? Check out our openings to see where you fit in.
          </Text>
          <Button
            as={Link}
            href="/careers"
            backgroundColor="#fff"
            color="#1f1646"
            padding="16px 32px"
            borderRadius="6px"
            _hover={{ bg: '#F3F4F6', color: '#1f1646' }}
            _focus={{ bg: '#E9E9E9', color: '#1f1646' }}>
            Apply now
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default LeadershipPage;
