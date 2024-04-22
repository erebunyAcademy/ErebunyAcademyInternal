import React, { FC, memo, ReactNode } from 'react';
import { Box, Button } from '@chakra-ui/react';
import RemoveIcon from '/public/icons/remove.svg';

type RemovableButtonProps = {
  children: ReactNode;
  removeQueryParamHandler: () => void;
};

const RemovableButton: FC<RemovableButtonProps> = ({ children, removeQueryParamHandler }) => (
  <Button
    width="auto"
    height="38px"
    display="flex"
    alignItems="center"
    borderRadius="6px"
    border="1px solid #F3F4F6"
    backgroundColor="#fff"
    _hover={{
      bg: '#F9FAFB',
    }}
    _focus={{
      bg: '#fff',
    }}
    lineHeight="22px"
    px={16}>
    {children}
    <Box
      as="span"
      ml={8}
      onClick={removeQueryParamHandler}
      display="flex"
      alignItems="center">
      <RemoveIcon />
    </Box>
  </Button>
);

export default memo(RemovableButton);
