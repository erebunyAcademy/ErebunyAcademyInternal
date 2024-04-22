import React, { FC } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { segoe } from '@/utils/constants/fonts';

type LastSectionProps = {};

const LastSection: FC<LastSectionProps> = () => {
  return (
    <Flex as="section" flexDirection="column">
      <Heading
        className={segoe.className}
        textAlign="center"
        fontSize={{ base: '24px', sm: '28px' }}
        fontWeight={700}
        color="#222222"
        lineHeight="normal"
        fontStyle="normal"
        mb={{ base: '36px', md: '40px' }}>
        Why Persona?
      </Heading>
      <Flex gap={24} alignItems="center" flexDirection={{ base: 'column', md: 'row' }}>
        <Box
          w={{ base: '100%', md: '50%' }}
          display={{ base: 'none', sm: 'block' }}
          overflow="hidden"
          borderRadius={{ base: '16px', md: '16px 0px 0px 16px' }}>
          <Image
            src="/images/public_available/careers_img2.webp"
            width={576}
            height={402}
            alt="courses_image"
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }} mr={{ base: '0', md: '24px' }}>
          <Heading
            className={segoe.className}
            fontSize="28px"
            fontWeight={{ base: 600, md: 700 }}
            color="#222222"
            textAlign="center"
            lineHeight="36px"
            fontStyle="normal"
            mb="16px">
            Choose Persona to Ignite Minds and Shape Futures
          </Heading>
          <Text
            color="#222222"
            fontSize="16px"
            fontWeight={400}
            lineHeight="22px"
            fontStyle="normal"
            textAlign={{ base: 'left', md: 'center' }}>
            Persona Business Academy is committed to your continuous growth. Benefit from regular
            workshops, seminars, and access to resources that enhance your teaching skills and keep
            you at the forefront of educational trends.
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default LastSection;
