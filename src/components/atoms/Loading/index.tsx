import React, { FC, memo } from 'react';
import { Box, BoxProps, Spinner } from '@chakra-ui/react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

interface LoadingProps extends BoxProps {
  isLoading?: boolean;
}

const Loading: FC<LoadingProps> = ({ isLoading, ...rest }) => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  return (
    <>
      {isFetching || isMutating || isLoading ? (
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
            position="fixed"
            left="50%"
            top="50%"
            transform="translate(-50%,-50%)"
            zIndex={100}
            width="100px">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#319795"
              size="xl"
            />
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default memo(Loading);
