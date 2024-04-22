import React, { FC, memo } from 'react';
import { Box, BoxProps, HStack, StackProps } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  data: Array<{ href: string; title: string }>;
  children: React.ReactNode;
  boxProps: BoxProps;
  linkProps?: StackProps;
}

const AuthBox: FC<Props> = ({ data, children, boxProps = {}, linkProps = {} }) => {
  const pathname = usePathname();

  return (
    <Box
      boxShadow={{ base: 'unset', md: '0px 4px 8px 0px rgba(0, 0, 0, 0.10)' }}
      background={'white'}
      borderRadius={{ base: 'unset', md: 12 }}
      paddingY={{ base: 'unset', md: 32 }}
      paddingX={{ base: 16, md: 32 }}
      width={{ base: 375, md: 400 }}
      {...boxProps}>
      <HStack spacing="20px" paddingBottom={32} {...linkProps}>
        {data.map(({ href, title }) => (
          <Link
            key={href}
            as={NextLink}
            href={href}
            color="grey.300"
            fontSize={20}
            lineHeight="normal"
            _hover={{ textDecoration: 'none' }}
            fontWeight={pathname === href || pathname === '#' ? 600 : 400}
            fontStyle="normal">
            {title}
          </Link>
        ))}
      </HStack>
      {children}
    </Box>
  );
};

export default memo(AuthBox);
