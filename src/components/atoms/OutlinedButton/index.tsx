import React, { FC, memo } from 'react';
import { Button } from '@chakra-ui/react';
import ArrowIcon from '/public/icons/arrow_right.svg';

type OutlinedButtonProps = {
  children: string;
};

const OutlinedButton: FC<OutlinedButtonProps> = ({ children }) => {
  return (
    <Button
      bg="white"
      color="#222"
      padding="16px 32px"
      height="56px"
      width="auto"
      fontWeight={700}
      border="1px solid #E5EEFF"
      fontSize="16px"
      _hover={{
        bg: 'white',
        color: '#3CB4E7',
      }}
      _focus={{
        bg: 'white',
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="8px"
      sx={{
        '& > svg': {
          transition: 'transform 0.3s',
        },
        '&:hover > svg': {
          transform: 'translateX(12px)',
        },
      }}>
      {children}
      <ArrowIcon className="outlined_btn_arrow" />
    </Button>
  );
};

export default memo(OutlinedButton);
