import React, { FC, memo, ReactNode } from 'react';
import { ButtonProps, Button as ChakraButton } from '@chakra-ui/react';

interface SharedButtonProps extends ButtonProps {
  children: ReactNode;
  href?: string;
}

const Button: FC<SharedButtonProps> = ({ children, ...props }) => {
  return (
    <ChakraButton
      bg="#38B2AC"
      color="#FFFFFF"
      _hover={{
        bg: '#319795',
        color: '#FFFFFF',
      }}
      _focus={{
        bg: '#2C7A7B',
        color: '#FFFFFF',
      }}
      _focusVisible={{
        bg: '#2C7A7B',
        color: '#FFFFFF',
      }}
      _disabled={{
        bg: 'grey.50',
        color: 'grey.200',
        cursor: 'not-allowed',
      }}
      {...props}>
      {children}
    </ChakraButton>
  );
};

export default memo(Button);
