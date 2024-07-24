import { FC, Fragment, memo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  Flex,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { Locale } from '@/i18n';
import { LinkItemProps } from '@/utils/helpers/permissionRoutes';
import NavItem from '../NavItem';

interface SidebarProps extends BoxProps {
  linkItems: LinkItemProps[];
  lang: Locale;
}

const SidebarContent: FC<SidebarProps> = ({ linkItems, lang, ...props }) => {
  const t = useTranslations();
  return (
    <Box borderRight="1px" borderColor="#F9FAFB" pos="fixed" h="full" {...props} overflowY="auto">
      <Flex padding="64px 46px" flexDirection="column">
        {linkItems.map(link => (
          <Fragment key={link.id}>
            {link.isExpandable ? (
              <Accordion allowToggle>
                <AccordionItem border="none">
                  <AccordionButton
                    p={0}
                    border="none"
                    paddingLeft={24}
                    marginBottom="10px"
                    borderRadius="9px"
                    _hover={{
                      bg: '#F3F4F6',
                      color: '#222',
                    }}
                    height="52px">
                    <Flex
                      align="center"
                      p="4"
                      mx="4"
                      height="100%"
                      borderRadius="lg"
                      role="group"
                      cursor="pointer"
                      display="flex"
                      gap="10px">
                      {link.icon}
                      {t(link.name)}
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    {link.children?.map(cl => (
                      <Box key={cl.id} borderRadius="9px" height="52px" display="flex" width="100%">
                        <NavItem icon={cl.icon} href={cl.href} lang={lang}>
                          {t(cl.name)}
                        </NavItem>
                      </Box>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ) : (
              <NavItem icon={link.icon} href={link.href} lang={lang}>
                {t(link.name)}
              </NavItem>
            )}
          </Fragment>
        ))}
      </Flex>
    </Box>
  );
};

export default memo(SidebarContent);
