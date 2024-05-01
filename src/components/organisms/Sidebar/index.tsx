'use client';
import React, { FC, memo, PropsWithChildren } from 'react';
import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FiHome, FiTrendingUp } from 'react-icons/fi';
import { OFFLINE_COURSES_ROUTE, ONLINE_COURSES_ROUTE } from '@/utils/constants/routes';
import MobileNav from './MobileNav';
import SidebarContent from './SidebarContent';

export interface LinkItemChildren {
  title: string;
  href: string;
}
export interface LinkItemProps {
  name: string;
  icon: IconType;
  children: LinkItemChildren[];
}

const linkItems: LinkItemProps[] = [
  {
    name: 'Common',
    icon: FiHome,
    children: [
      { title: 'All Users', href: '' },
      { title: 'Jobs', href: '' },
    ],
  },
  {
    name: 'Courses',
    icon: FiTrendingUp,
    children: [
      { title: 'Online', href: ONLINE_COURSES_ROUTE },
      { title: 'Offline', href: OFFLINE_COURSES_ROUTE },
      { title: 'Instructors', href: '' },
    ],
  },
  {
    name: 'Form',
    icon: FiTrendingUp,
    children: [{ title: 'Applicants', href: '' }],
  },
];

const Sidebar: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg="#ffffff">
      <SidebarContent
        onClose={onClose}
        linkItems={linkItems}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} linkItems={linkItems} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>{children}</Box>
    </Box>
  );
};
export default memo(Sidebar);
