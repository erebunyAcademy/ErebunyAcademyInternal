import React, { FC, memo } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface LoadingProps extends BoxProps {}

const Loading: FC<LoadingProps> = ({ ...rest }) => {
  return (
    <Box {...rest}>
      <Box
        position="fixed"
        top={0}
        bottom={0}
        right={0}
        left={0}
        backgroundColor="#fff"
        opacity={0.8}
        zIndex={10}
      />
      <Box
        backgroundImage="url(/gifs/loading.gif)"
        backgroundRepeat="no-repeat"
        height="100px"
        position="fixed"
        left="50%"
        top="50%"
        transform="translate(-50%,-50%)"
        zIndex={100}
        width="100px"
      />
    </Box>
  );
};

export default memo(Loading);
