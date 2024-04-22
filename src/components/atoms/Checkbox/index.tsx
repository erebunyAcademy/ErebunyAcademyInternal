import React, { FC } from 'react';
import { Checkbox as ChakraCheckbox, CheckboxProps as ChakraCheckboxProps } from '@chakra-ui/react';

interface CheckboxProps extends ChakraCheckboxProps {}

const Checkbox: FC<CheckboxProps> = rest => <ChakraCheckbox {...rest} size="lg" />;

export default Checkbox;
