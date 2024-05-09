import React, { FC, PropsWithChildren } from 'react';
import { IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import DotsIcon from '@/icons/dots-horizontal.svg';

type ActionButtonsProps = {};

const ActionButtons: FC<PropsWithChildren<ActionButtonsProps>> = ({ children }) => {
  return (
    <Menu>
      <MenuButton as={IconButton} icon={<DotsIcon />} colorScheme="gray" />
      <MenuList>{children}</MenuList>
    </Menu>
  );
};

export default ActionButtons;
