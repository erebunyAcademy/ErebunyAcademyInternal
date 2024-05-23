import { FC, memo } from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/react';
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
          <NavItem key={link.name} icon={link.icon} href={link.href} lang={lang}>
            {t(link.name)}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};

export default memo(SidebarContent);
