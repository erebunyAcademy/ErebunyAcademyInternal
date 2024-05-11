'use client';
import { memo, ReactNode } from 'react';
import { Box, Flex, FlexProps } from '@chakra-ui/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Locale } from '@/i18n';
import { ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

interface NavItemProps extends FlexProps {
  icon: ReactNode;
  children: React.ReactNode;
  href: string | undefined;
  lang: Locale;
}
const NavItem = ({ href, icon, children, lang, ...rest }: NavItemProps) => {
  return (
    <Box
      as={Link}
      href={href || ''}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      paddingLeft={24}
      marginBottom="10px"
      borderRadius="9px"
      _hover={{
        bg: '#F3F4F6',
        color: '#222',
      }}
      height="52px"
      {...(href
        ? {}
        : { onClick: () => signOut({ callbackUrl: languagePathHelper(lang, ROUTE_SIGN_IN) }) })}>
      <Flex
        align="center"
        p="4"
        mx="4"
        height="100%"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        display="flex"
        gap="10px"
        {...rest}>
        {icon}
        {children}
      </Flex>
    </Box>
  );
};

export default memo(NavItem);
