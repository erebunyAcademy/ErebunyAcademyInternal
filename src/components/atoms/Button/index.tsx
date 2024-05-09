import React, { FC, memo, ReactNode } from 'react';
import { ButtonProps, Button as ChakraButton } from '@chakra-ui/react';

interface SharedButtonProps extends ButtonProps {
  children: ReactNode;
  href?: string;
  bgHover?: string;
}

const Button: FC<SharedButtonProps> = ({ children, ...props }) => {
  return (
    <ChakraButton
      color="#fff"
      _hover={{
        bg: props.bgHover || '#BABABA',
        color: '#fff',
      }}
      _focus={{
        bg: '#BABABA',
        color: '#222',
      }}
      _focusVisible={{
        bg: '#BABABA',
        color: '#222',
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
