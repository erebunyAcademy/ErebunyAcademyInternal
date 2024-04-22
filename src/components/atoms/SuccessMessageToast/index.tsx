import React, { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Image from 'next/image';

type SuccessMessageToastProps = {};

const SuccessMessageToast: FC<SuccessMessageToastProps> = () => {
  return (
    <Box
      margin={{
        base: '0 auto',
        xl: ' 0 0 0 auto',
      }}
      maxWidth="459px"
      height="56px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="1px solid"
      borderColor="#059669"
      borderRadius="6px"
      padding="16px 28px">
      <Image width={24} height={24} src="/icons/check_circle_icon.svg" alt="Image" />
      <Text margin="0 0 0 10px" color="#059669" fontSize="16px" fontWeight="500" lineHeight="24px">
        Thank you for your message. It has been sent.
      </Text>
    </Box>
  );
};

export default SuccessMessageToast;
