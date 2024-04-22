import React, { FC } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { segoe } from '@/utils/constants/fonts';

type LogInSectionProps = {
  description: string;
  children: any[];
};

const LogInSection: FC<LogInSectionProps> = ({ description, children }) => {
  return (
    <Box as="section" maxWidth="793px" margin={{ base: '36px auto 36px', md: '64px auto 0' }}>
      <Text
        margin="0"
        whiteSpace="pre-line"
        color="#222222"
        fontSize="16px"
        fontWeight={400}
        lineHeight="normal"
        fontStyle="normal"
        mb="50px">
        {description}
      </Text>
      {children.map(child => (
        <Box key={child.id}>
          {child.imgSrc && (
            <Box position="relative" width="100%" height="300px">
              <Image
                src={child.imgSrc}
                alt={child.title}
                fill
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
          )}

          <Heading
            margin={{
              base: '16px 0 16px 0',
              md: '24px 0 24px 0 ',
            }}
            textAlign={{ base: 'center', lg: 'left' }}
            fontSize={{ base: '28px ', sm: '28px ', md: '32px ', lg: ' 32px', xl: ' 32px' }}
            lineHeight="42.56px"
            fontWeight="700"
            className={segoe.className}>
            {child.title}
          </Heading>
          <Text
            whiteSpace="pre-line"
            margin="0"
            color="#222222"
            fontSize="16px"
            fontWeight={400}
            lineHeight="normal"
            fontStyle="normal"
            mb="50px">
            {child.description}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default LogInSection;
