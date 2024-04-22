import React, { FC } from 'react';
import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import WelcomeAboutPage from './WelcomeAboutPage';

const MissionSection = dynamic(() => import('./MissionSection'));
const OurValuesSection = dynamic(() => import('./OurValuesSection'));
const OurHistorySection = dynamic(() => import('./OurHistorySection'));

type Props = {};

const AboutPage: FC<Props> = () => {
  return (
    <>
      <WelcomeAboutPage />

      <Box padding={{ base: '36px 16px 0', md: '36px 16px 0', xl: '96px 0 0 0 ' }} bg="#F6FCFF">
        <MissionSection />

        <OurValuesSection />

        <OurHistorySection />

        <Box bg="#1F1646">
          <Box
            padding={{ base: '86px 0', xl: '96px 0' }}
            color="#fff"
            maxWidth="1228px"
            gap={{
              base: '81px',
              md: '50px',
              xl: '0',
            }}
            margin="0 auto"
            display="flex"
            flexWrap="wrap"
            justifyContent={{
              base: 'center',
              xl: 'space-between',
            }}>
            <UnorderedList
              textAlign="center"
              width="305px"
              fontWeight="700"
              listStyleType="none"
              margin="0">
              <ListItem
                lineHeight={{
                  base: ' 37.24px',
                  lg: '53.64px',
                }}
                fontSize={{ base: '28px', lg: '44px' }}>
                3000+
              </ListItem>
              <ListItem
                lineHeight={{
                  base: ' 31.92px',
                  lg: '42.56px',
                }}
                fontSize={{ base: '24px', lg: '32px' }}>
                Students of PBA
              </ListItem>
            </UnorderedList>

            <UnorderedList
              textAlign="center"
              width="305px"
              fontWeight="700"
              listStyleType="none"
              margin="0">
              <ListItem
                lineHeight={{
                  base: ' 37.24px',
                  lg: '53.64px',
                }}
                fontSize={{ base: '28px', lg: '44px' }}>
                15+
              </ListItem>
              <ListItem
                lineHeight={{
                  base: ' 31.92px',
                  lg: '42.56px',
                }}
                fontSize={{ base: '24px', lg: '32px' }}>
                Total Courses
              </ListItem>
            </UnorderedList>

            <UnorderedList
              textAlign="center"
              width="305px"
              fontWeight="700"
              listStyleType="none"
              margin="0">
              <ListItem
                lineHeight={{
                  base: ' 37.24px',
                  lg: '53.64px',
                }}
                fontSize={{ base: '28px', lg: '44px' }}>
                500+
              </ListItem>
              <ListItem
                lineHeight={{
                  base: ' 31.92px',
                  lg: '42.56px',
                }}
                fontSize={{ base: '24px', lg: '32px' }}>
                Students working in this field
              </ListItem>
            </UnorderedList>

            <UnorderedList
              textAlign="center"
              width="305px"
              fontWeight="700"
              listStyleType="none"
              margin="0">
              <ListItem
                lineHeight={{
                  base: ' 37.24px',
                  lg: '53.64px',
                }}
                fontSize={{ base: '28px', lg: '44px' }}>
                650+
              </ListItem>
              <ListItem
                lineHeight={{
                  base: ' 31.92px',
                  lg: '42.56px',
                }}
                fontSize={{ base: '24px', lg: '32px' }}>
                Master LVL certified students
              </ListItem>
            </UnorderedList>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AboutPage;
