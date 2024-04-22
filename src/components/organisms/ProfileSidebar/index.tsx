import React, { memo } from 'react';
import { Box, Drawer, DrawerContent } from '@chakra-ui/react';
import SidebarContent from './SidebarContent';

const SimpleSidebar = () => {
  return (
    <Box minH="100%">
      <SidebarContent display={{ base: 'none', md: 'block' }} width="360px" />
      <Drawer
        isOpen={false}
        placement="left"
        size="lg"
        returnFocusOnClose={false}
        onClose={() => {}}>
        <DrawerContent>
          <SidebarContent />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default memo(SimpleSidebar);
