import React, { FC, memo } from 'react';
import Button from '../Button';

type Props = {
  children: React.ReactNode;
};

const IconButton: FC<Props> = ({ children }) => {
  return <Button bg="transparent">{children}</Button>;
};

export default memo(IconButton);
