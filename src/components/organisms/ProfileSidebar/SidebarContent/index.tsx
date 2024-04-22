import { FC, memo } from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { linkItems } from '@/utils/constants/routes';
import NavItem from '../NavItem';

interface SidebarProps extends BoxProps {}

const SidebarContent: FC<SidebarProps> = props => {
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
