import { Box, Text } from '@chakra-ui/react';
import Image from 'next/image';

const NoDataFound = () => {
  return (
    <Box display="flex" mt="20px" flexDir="column" width="100%" alignItems="center">
      <Box
        display="flex"
        mb="20px"
        width="180px"
        height="180px"
        justifyContent="center"
        position="relative">
        <Image fill alt="Error" src="/icons/pba_credit_icon.svg" />
      </Box>
      <Text fontSize="24px" m="0" fontWeight="700" as="span">
        No Data Found
      </Text>
    </Box>
  );
};

export default NoDataFound;
