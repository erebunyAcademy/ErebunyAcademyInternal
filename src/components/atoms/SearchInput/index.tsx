import React from 'react';
import { Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import InputSearchIcon from '@/icons/search_icon.svg';

const SearchInput = () => {
  return (
    <Flex
      width={{ base: '343px', sm: '794px' }}
      margin="0 auto"
      flexDirection="column"
      alignItems="center">
      <InputGroup>
        <Input
          placeholder="What are you looking for?"
          borderRadius="12px"
          border="1px solid #F9FAFB"
          background="#FFF"
          color="#C0C0C0"
          fontSize="16px"
          fontWeight={400}
          padding="12px 16px"
          value=""
          onChange={() => {}}
        />
        <InputRightElement width="45px" cursor="pointer">
          <InputSearchIcon />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
