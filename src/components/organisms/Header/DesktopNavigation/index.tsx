import React, { FC, memo, useState } from "react";
import {
  Box,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import {
  FOR_KIDS_ROUTE,
  OFFLINE_COURSES_ROUTE,
} from "@/utils/constants/routes";
import DesktopSubNav from "../DesktopSubNavigation";
import { generateAWSUrl } from "@/utils/helpers/aws";

type Props = {
  navItems: [];
  onClose: () => void;
};

const DesktopNav: FC<Props> = ({ navItems, onClose }) => {
  return (
    <Stack
      direction={"row"}
      justifyContent="center"
      alignItems="center"
      gap={40}
      onMouseLeave={() => {}}
    ></Stack>
  );
};

export default memo(DesktopNav);
