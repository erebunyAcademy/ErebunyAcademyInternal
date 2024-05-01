'use client';
import { memo, useMemo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  CloseButton,
  Flex,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';

export interface LinkItemChildren {
  title: string;
  href: string;
}
export interface LinkItemProps {
  name: string;
  icon: IconType;
  children: LinkItemChildren[];
}

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
  linkItems: LinkItemProps[];
}

const SidebarContent = ({ onClose, linkItems, ...rest }: SidebarContentProps) => {
  const pathname = usePathname();

  const defaultIndex = useMemo(() => {
    const idx = linkItems.findIndex(item =>
      item.children.some(el => pathname?.startsWith(el.href)),
    );
    return [idx];
  }, [linkItems, pathname]);

  return (
    <Box
      bg="#fff"
      borderRight="1px"
      borderRightColor="gray.200"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      overflow="auto"
      h="100%"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Accordion defaultIndex={defaultIndex} allowMultiple>
        {linkItems.map((link: LinkItemProps) => (
          <AccordionItem key={link.name}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {link.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {link.children.map(subLink => (
                <Flex
                  key={subLink.href}
                  align="center"
                  onClick={onClose}
                  as={NextLink}
                  href={subLink.href}
                  p="4"
                  borderRadius="lg"
                  textDecoration="none"
                  role="group"
                  cursor="pointer"
                  bg={pathname?.startsWith(subLink.href) ? 'cyan.400' : 'unset'}
                  color={pathname?.startsWith(subLink.href) ? 'white' : 'unset'}
                  _hover={
                    !pathname?.startsWith(subLink.href)
                      ? {
                          bg: 'cyan.300',
                          color: 'white',
                        }
                      : {}
                  }
                  {...rest}>
                  {subLink.title}
                </Flex>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};
export default memo(SidebarContent);
