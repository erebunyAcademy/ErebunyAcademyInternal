import React, { FC } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { Button } from '@/components/atoms';

type AboutAuthorProps = {};

const AboutAuthor: FC<AboutAuthorProps> = () => {
  return (
    <Box as="section" maxWidth="1200px" margin="0 auto">
      <Heading
        mb={{ base: '16px', md: '40px' }}
        textAlign="center"
        lineHeight="37.24px"
        fontWeight={{ base: 600, md: 700 }}
        fontSize="28px"
        color="#000000">
        About the author(s)
      </Heading>
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        height="auto"
        p={{ base: '16px', sm: '0' }}>
        <Box
          borderRadius={{ base: '16px', md: '36px' }}
          overflow="hidden"
          position="relative"
          width={{ base: '94px', sm: '487px' }}
          height={{ base: '94px', sm: '406px' }}>
          <Image
            src="/images/public_available/articles_user_img.jpg"
            alt="Author image"
            fill
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Box>
        <Box
          backgroundColor="#F9FAFB"
          borderRadius={{ base: '0', sm: '10px 70px 10px 10px' }}
          flexBasis={{ base: 'auto', md: 713 }}
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          fontSize="16px"
          lineHeight="normal"
          fontStyle="normal"
          padding={{ base: '16px', md: '44px 105px 38px 21px' }}
          gap={{ base: '8px', sm: '16px' }}>
          <Text as="span" color="#222222" fontWeight={700}>
            Name Surname
          </Text>

          <Text
            as="span"
            color="#5B5B5B"
            fontWeight={400}
            textAlign={{ base: 'left', md: 'center' }}>
            Lorem ipsum dolor sit consectetur sed do eiuNext, apply this class to your
            component:Lorem ipsum dolor sit consectetur sed do Lorem ipsum dolor sit consectetur sed
            do Lorem ipsum dolor sit , consectetur sed do Lorem ipsum dolor sit , consectetur sed do
            Lorem ipsum dolor sit consectetur sed do Lorem ipsum dolor sit consectetur sed do Lorem
            ipsum dolor sit consectetur sed do dolor sit , consectetur sed do Lorem ipsum dolor sit
            consectetur sed do Lorem ipsum dolor sit consectetur sed do Lorem ipsum dolor sit
            consectetur sed do
          </Text>

          <Button
            display={{ base: 'block', sm: 'none' }}
            width="auto"
            color="#222222"
            bg="white"
            variant="link"
            _hover={{ bg: '#white' }}
            _active={{
              bg: '#white',
            }}
            _focus={{
              bg: '#white',
            }}>
            Read more
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default AboutAuthor;
