import { Box, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { OFFLINE_COURSES_ROUTE } from '@/utils/constants/routes';

const HaveAQuestion = () => {
  return (
    <Box
      maxWidth="100%"
      bg="#1F1646"
      margin={{ base: '0', lg: '148px 0 0 0' }}
      padding={{
        base: '40px 10px',
        lg: '40px 0',
      }}
      color="#fff">
      <Box maxW="794px" margin="0 auto" textAlign="center">
        <Heading as="h2" margin="0" pb="16px" fontSize="28px" lineHeight="34.13px">
          Is this most suitable for you?
        </Heading>
        <Text as="p" margin="0" pb="24px">
          Embrace the journey of learning with us! Register now to embark on a transformative
          educational experience that goes beyond boundaries.
        </Text>
        <Button
          as={Link}
          href={OFFLINE_COURSES_ROUTE}
          bg="#F3F4F6"
          color="#1F1646"
          height="53px"
          width="168px"
          borderRadius="6px"
          fontSize="16px"
          lineHeight="21.28px"
          border="1px solid #F3F4F6"
          fontWeight="400"
          _hover={{
            bg: 'F3F4F6',
          }}
          _focus={{
            bg: 'F3F4F6',
          }}>
          Join now
        </Button>
      </Box>
    </Box>
  );
};

export default HaveAQuestion;
