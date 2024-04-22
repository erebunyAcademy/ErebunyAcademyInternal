import React, { FC } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';

type FirstSectionProps = {};

const FirstSection: FC<FirstSectionProps> = () => {
  return (
    <Flex as="section" flexDirection="column" gap={{ base: '20px', xl: '40px' }}>
      <Heading
        textAlign="center"
        lineHeight="normal"
        fontStyle="normal"
        color="#222222"
        fontSize={{ base: '28px', sm: '44px' }}
        fontWeight={{ base: 600, xl: 700 }}>
        Careers
      </Heading>
      <Flex gap={24} flexDirection={{ base: 'column', md: 'row' }} alignItems="center">
        <Box w={{ base: '100%', md: '50%' }} ml={{ base: '0', xl: '24px' }} textAlign="center">
          <Text
            lineHeight="normal"
            fontStyle="normal"
            fontSize={24}
            fontWeight={700}
            color="#222222"
            marginBottom={16}>
            Persona careers
          </Text>
          <Text
            lineHeight="22px"
            fontStyle="normal"
            fontSize={16}
            color="#222222"
            fontWeight={400}
            textAlign={{ base: 'left', md: 'center' }}>
            At Persona Business Academy , we believe in the power of talented individuals coming
            together to drive innovation and make a positive impact. If you are passionate,
            dedicated, and eager to contribute your skills to a dynamic and collaborative
            environment, we invite you to explore the exciting career opportunities available with
            us.
          </Text>
        </Box>
        <Box
          w={{ base: '100%', md: '50%' }}
          margin="0 auto"
          borderRadius={{ base: '16px', md: '0px 16px 16px 0px' }}
          overflow="hidden">
          <Image
            src="/images/public_available/careers_img1.webp"
            width={576}
            height={402}
            alt="courses_image"
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default FirstSection;
