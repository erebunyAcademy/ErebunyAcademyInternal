import React, { FC } from 'react';
import { Text } from '@chakra-ui/react';
import ArrowRightIcon from '@/icons/not_found_icon.svg';

type MovableButtonProps = {
  btnText: string;
  fill?: string;
  fillHover?: string;
};

const MovableButton: FC<MovableButtonProps> = ({
  btnText,
  fill = '#FF6131',
  fillHover = '#E6572C',
}) => {
  return (
    <Text
      color={fill}
      fontSize="16px"
      _hover={{
        color: fillHover,
        fill: fillHover,
      }}
      fontWeight="700"
      lineHeight="21.28px"
      margin="0"
      display="flex"
      fill={fill}
      alignItems="center"
      gap="8px"
      sx={{
        '& > svg': {
          marginLeft: '8px',
        },
        '&:hover > svg': {
          transform: 'translateX(12px)',
          fill: fillHover,
        },
      }}>
      {btnText}
      <ArrowRightIcon
        style={{
          transition: 'all 0.3s',
          marginLeft: '8px',
          fill: 'inherit',
        }}
      />
    </Text>
  );
};

export default MovableButton;
