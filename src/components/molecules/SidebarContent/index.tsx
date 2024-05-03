import { FC, memo } from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { LinkItemProps } from '@/utils/helpers/permissionRoutes';
import NavItem from '../NavItem';

interface SidebarProps extends BoxProps {
  linkItems: LinkItemProps[];
}

const SidebarContent: FC<SidebarProps> = ({ linkItems, ...props }) => {
  return (
    <Box borderRight="1px" borderColor="#F9FAFB" pos="fixed" h="full" {...props}>
      <Flex padding="64px 46px" flexDirection="column">
        {linkItems.map(link => (
          <NavItem key={link.name} icon={link.icon} href={link.href}>
            {link.name}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};

export default memo(SidebarContent);
