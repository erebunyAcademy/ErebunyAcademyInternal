import React, { FC, memo } from 'react';
import { Stack } from '@chakra-ui/react';

type Props = {
  navItems: [];
  onClose: () => void;
};

const DesktopNav: FC<Props> = () => {
  return (
    <Stack
      direction={'row'}
      justifyContent="center"
      alignItems="center"
      gap={40}
      onMouseLeave={() => {}}></Stack>
  );
};

export default memo(DesktopNav);
