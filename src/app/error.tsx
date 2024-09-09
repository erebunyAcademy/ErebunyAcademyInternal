'use client';
import { useEffect } from 'react';
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import ErrorImage from '@/icons/error_img.jpg';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container padding="0" maxWidth="1500px" margin="0 auto">
      <Flex mt="70px" width="100%" direction="column" alignItems="center" justifyContent="center">
        <Box
          width={{ base: '343px', sm: '400px', md: '600px', lg: '700px' }}
          height="auto"
          position="relative">
          <Image src={ErrorImage} alt="Not Found" width={700} height={400} objectFit="cover" />
        </Box>
        <Box
          padding="16px"
          marginTop="20px"
          width={{ base: '100%', lg: '800px' }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center">
          <Heading fontSize="28px" color="#22222" fontWeight="760" lineHeight="normal">
            Something went wrong
          </Heading>
          <Text fontSize="20px" color="#696969" mt="10px">
            Please try again later
          </Text>
        </Box>
      </Flex>
    </Container>
  );
}
