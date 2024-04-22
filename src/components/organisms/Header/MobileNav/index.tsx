import { FC, memo } from 'react';
import { Accordion, Box, Flex, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'next-auth';
import { Button } from '@/components/atoms';
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/utils/constants/routes';
import { NavItem } from '@/utils/models/header';
import MobileNavItem from '../MobileNavItem';

interface MobileNavProps {
  navItems: NavItem[];
  user: User | null;
  onClose: () => void;
}
const MobileNav: FC<MobileNavProps> = ({ navItems, user, onClose }) => {
  const pathname = usePathname();

  return (
    <Stack>
      <Accordion allowToggle>
        <Box px={16}>
          {navItems.map((navItem: NavItem, i: number) => (
            <MobileNavItem key={i} {...navItem} onClose={onClose} />
          ))}
          {!user && (
            <Flex flexDirection="column" gap={16} pb="50px" pt={24}>
              <Link href={`${SIGN_IN_ROUTE}?callback_url=${pathname}`}>
                <Button
                  borderRadius={6}
                  fontSize={14}
                  width="100%"
                  height={38}
                  fontWeight={600}
                  bg="#fff"
                  color="#3CB4E7"
                  border="1px solid #3CB4E7">
                  Log In
                </Button>
              </Link>
              <Link href={SIGN_UP_ROUTE}>
                <Button borderRadius={6} fontSize={14} fontWeight={600} height={38} width="100%">
                  Get Started
                </Button>
              </Link>
            </Flex>
          )}
        </Box>
      </Accordion>
    </Stack>
  );
};
export default memo(MobileNav);
