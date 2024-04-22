import React, { FC } from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { segoe } from '@/utils/constants/fonts';

type MissionSectionProps = {};

const MissionSection: FC<MissionSectionProps> = () => {
  return (
    <Container maxW="1200px" margin="0 auto">
      <Box className={segoe.className} maxW="784px" margin="0 auto 40px" color="#222222">
        <Heading
          margin={{ base: '0 0 16px 0', xl: '0 0 8px 0' }}
          fontSize="32px"
          lineHeight="42.56px"
          fontWeight="700"
          textAlign="center">
          Our Mission
        </Heading>
        <Text fontSize="16px" fontWeight="400" lineHeight="21.28px" margin="0">
          The mission of Persona Business Academy that encompasses learning modules such as Social
          Media Marketing (SMM), Human Resource Management (HRM), Front-End Development, and other
          related areas may include the following key objectives: to provide a multifaceted
          educational experience that equips students with a diverse skill set, to promote a global
          perspective by integrating international case studies and best practices, to prepare
          students for successful careers in their chosen fields by providing them with the
          necessary tools, resources.
        </Text>
      </Box>

      <Box mb={{ base: '36px', md: '100px', xl: '148px' }} color="#222222">
        <Box
          display="flex"
          gap="24px"
          marginBottom={{ base: '20px', md: '30px', lg: '50px', xl: '148px' }}
          flexWrap={{ base: 'wrap', xl: 'nowrap' }}
          justifyContent="center">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            textAlign={{ base: 'start', md: 'center' }}
            width="562px">
            <Heading margin="0 0 16px 0" fontWeight="700" fontSize="24px" lineHeight="31.92px">
              Innovation:
            </Heading>
            <Text margin="0" lineHeight="21.28px" fontWeight="400" fontSize="16px">
              Encourage creative thinking and a forward-looking mindset, empowering students to
              embrace new ideas and technologies within the ever-evolving business landscape.
            </Text>
          </Box>

          <Box
            display={{ base: 'none', lg: 'block' }}
            overflow="hidden"
            position="relative"
            width="576px"
            height="402px"
            borderTopRightRadius="16px"
            borderBottomRightRadius="16px">
            <Image src="/icons/about_inovation.svg" fill objectFit="cover" alt="Courses" />
          </Box>
        </Box>

        <Box
          display="flex"
          gap={24}
          marginBottom={{ base: '20px', md: '30px', lg: '50px', xl: '148px' }}
          justifyContent="center"
          flexWrap={{
            base: 'wrap-reverse',
            xl: 'nowrap',
          }}>
          <Box
            display={{ base: 'none', lg: 'block' }}
            overflow="hidden"
            position="relative"
            borderTopLeftRadius="16px"
            borderBottomLeftRadius="16px"
            width="576px"
            height="402px">
            <Image src="/icons/about_collaboration.svg" fill objectFit="cover" alt="Courses" />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            textAlign={{ base: 'start', md: 'center' }}
            width="562px">
            <Heading margin="0 0 16px 0" fontWeight="700" fontSize="24px" lineHeight="31.92px">
              Collaboration:
            </Heading>
            <Text margin="0" lineHeight="21.28px" fontWeight="400" fontSize="16px">
              Foster a collaborative environment where diverse perspectives are valued, and teamwork
              is encouraged to promote a sense of community and mutual growth.
            </Text>
          </Box>
        </Box>

        <Box
          display="flex"
          gap={24}
          justifyContent="center"
          flexWrap={{ base: 'wrap', xl: 'nowrap' }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            textAlign={{ base: 'start', md: 'center' }}
            width="562px">
            <Heading margin="0 0 16px 0" fontWeight="700" fontSize="24px" lineHeight="31.92px">
              Perspective:
            </Heading>
            <Text margin="0" lineHeight="21.28px" fontWeight="400" fontSize="16px">
              Cultivate a global mindset and awareness, preparing students to thrive in an
              interconnected world and to address business challenges on both local and
              international scales.
            </Text>
          </Box>

          <Box
            display={{ base: 'none', lg: 'block' }}
            overflow="hidden"
            position="relative"
            borderTopRightRadius="16px"
            borderBottomRightRadius="16px"
            width="576px"
            height="402px">
            <Image src="/icons/about_perspective.svg" objectFit="cover" fill alt="Courses" />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default MissionSection;
