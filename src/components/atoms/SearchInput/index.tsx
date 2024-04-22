import { Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import InputSearchIcon from '/public/icons/search_icon.svg';
import { useSearchParams } from 'next/navigation';
import useQueryParams from '@/hooks/useQueryParam';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const SearchInput = () => {
  const { addSingleSearchParam } = useQueryParams();
  const searchParams = useSearchParams()!;
  const updatedSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  const [search, setSearch] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      addSingleSearchParam({ filterBy: 'q', value });
    }, 300),
    [addSingleSearchParam],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearchHandler(e.target.value);
  };

  useEffect(() => {
    const searchParam = updatedSearchParams.get('q');
    if (searchParam) {
      setSearch(searchParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          value={search}
          onChange={handleChange}
        />
        <InputRightElement width="45px" cursor="pointer">
          <InputSearchIcon />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;

const debounce = <T extends any[]>(func: (...args: T) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: T) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
