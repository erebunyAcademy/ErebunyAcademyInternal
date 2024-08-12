import React, { ElementType, forwardRef } from 'react';
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  Icon,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

interface CustomInputProps extends ChakraInputProps {
  icon?: ElementType;
}

const Input = forwardRef<HTMLInputElement, CustomInputProps>(({ icon, ...props }, ref) => (
  <InputGroup>
    <ChakraInput
      ref={ref}
      {...props}
      readOnly
      border="1px solid #D8D8D8"
      borderRadius={0}
      bg="#F5F5F5"
      placeholder="Select date range"
      _placeholder={{ color: 'gray.500' }}
    />
    {icon && (
      <InputRightElement>
        <Icon as={icon} color="gray.500" />
      </InputRightElement>
    )}
  </InputGroup>
));

Input.displayName = 'CustomInput';

export default Input;
