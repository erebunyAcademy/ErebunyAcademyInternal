import React, { FC } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';

type WelcomeSectionProps = {
  title: string;
};

const WelcomeSection: FC<WelcomeSectionProps> = ({ title }) => {
  return (
    <Box
      as="section"
      bg="#F6FCFF"
      py={{ base: '36px', md: '64px' }}
      borderRadius={{ base: '0px 0px 16px 16px', md: '0px 0px 72px 72px' }}>
      <Container maxWidth={1200} margin="0 auto" px={{ base: '16px', xl: '0' }}>
        <Box maxW="794px" textAlign="center" margin="0 auto" pb={{ base: '16px', md: '32px' }}>
          <Heading
            color="#222222"
            fontSize={{ base: '28px', sm: '44px' }}
            fontWeight={{ base: 600, md: 700 }}
            lineHeight="normal"
            fontStyle="normal">
            {title}
          </Heading>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomeSection;
