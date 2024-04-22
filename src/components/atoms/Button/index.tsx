import React, { FC, memo, ReactNode } from 'react';
import { ButtonProps, Button as ChakraButton } from '@chakra-ui/react';

interface SharedButtonProps extends ButtonProps {
  children: ReactNode;
  href?: string;
}

const Button: FC<SharedButtonProps> = ({ children, ...props }) => {
  return (
    <ChakraButton
      bg="#3CB4E7"
      color="#FFFFFF"
      _hover={{
        bg: 'blue.400',
        color: '#FFFFFF',
      }}
      _focus={{
        bg: 'blue.500',
        color: '#FFFFFF',
      }}
      _focusVisible={{
        bg: 'blue.500',
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
