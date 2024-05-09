'use client';
import { FC, memo } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { languages, Locale } from '@/i18n';
import Armenian from '@/icons/armenian.svg';

interface Props {
  lang: Locale;
}

const LanguagePicker: FC<Props> = ({ lang }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLanguage = (pathname: string, locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return `${segments.join('/')}?${new URLSearchParams(searchParams?.toString())}`;
  };

  return (
    <Box width="100px">
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="transparent">
          <Armenian /> {lang}
        </MenuButton>
        <MenuList>
          {Object.keys(languages).map(option => (
            <MenuItem
              key={option}
              onClick={() => {
                changeLanguage(pathname!, option);
              }}
              icon={
                <Box as="span" mr={2}>
                  <Armenian />
                </Box>
              }>
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default memo(LanguagePicker);
