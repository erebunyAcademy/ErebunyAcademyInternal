import { FC, memo, useCallback, useEffect, useRef } from 'react';
import {
  Accordion,
  Avatar,
  Box,
  Collapse,
  Flex,
  IconButton,
  Stack,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import CloseIcon from '/public/icons/close_icon.svg';
import BurgerMenuIcon from '/public/icons/menu.svg';
import { Button } from '@/components/atoms';
import { HOMEPAGE_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/utils/constants/routes';
import { generateAWSUrl } from '@/utils/helpers/aws';
import DesktopNav from './DesktopNavigation';
import MobileNav from './MobileNav';
import ProfileMenu from './ProfileMenu';
import ProfileNavItem from './ProfileNavItem';

type HeaderProps = {
  user: User | null;
};

const Header: FC<HeaderProps> = ({ user }) => {
  const { isOpen: isMenuOpen, onToggle: toggleMenuDropdown, onClose: closeMenu } = useDisclosure();
  const {
    isOpen: isUserProfileOpen,
    onToggle: toggleUserDropdown,
    onClose: closeUserProfile,
  } = useDisclosure();
  const { data } = useSession();
  const pathname = usePathname();
  const collapseRef = useRef<HTMLDivElement>(null);
  const userCollapseRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: collapseRef,
    handler: () => {
      if (isMenuOpen) {
        closeMenu();
      }
    },
  });

  const handleClick = useCallback(
    (event: any) => {
      if (
        userCollapseRef.current &&
        !userCollapseRef.current.contains(event.target) &&
        isUserProfileOpen
      ) {
        closeUserProfile();
      }
    },
    [closeUserProfile, isUserProfileOpen],
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  const toggleUserProfile = useCallback(() => {
    toggleUserDropdown();
  }, [toggleUserDropdown]);

  const toggleMenu = useCallback(() => {
    toggleMenuDropdown();
  }, [toggleMenuDropdown]);

  return (
    <Box
      borderBottom={1}
      borderStyle={'solid'}
      borderColor="#F9FAFB"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="#FFF"
      zIndex={1000}>
      <Flex
        minH={'60px'}
        py={{ base: 2 }}
        maxWidth={1200}
        margin="0 auto"
        px={{ base: 4 }}
        align={'center'}>
        <Flex flex={{ base: 1 }} justifyContent="space-between" px={{ base: '10px' }}>
          <Link href={HOMEPAGE_ROUTE}>
            <Flex alignItems="center" height="100%">
              <Image
                src="/icons/logo_persona.svg"
                width={135}
                height={27}
                alt="persona_logo"
                priority
                style={{ objectFit: 'contain', zIndex: 1000 }}
              />
            </Flex>
          </Link>

          <Flex display={{ base: 'none', lg: 'flex' }}>
            <DesktopNav navItems={[]} onClose={closeMenu} />
          </Flex>

          <Flex
            display={{ base: 'block', lg: 'none' }}
            marginLeft="auto"
            mr="16px"
            alignItems="center"
            justifyContent="center"
            alignSelf="center">
            {user && (
              <Avatar
                name={`${user?.firstName} ${user?.lastName}`}
                src={user?.avatar ? generateAWSUrl(user.avatar) : ''}
                bg="#F3F4F6"
                color="#C0C0C0"
                cursor="pointer"
                size="xs"
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={toggleUserProfile}
              />
            )}
          </Flex>
          <Flex display={{ base: 'flex', lg: 'none' }}>
            <IconButton
              width="25px"
              _focus={{
                bg: 'transparent',
              }}
              _hover={{
                bg: 'transparent',
              }}
              onClick={toggleMenu}
              bg="transparent"
              aria-label={'Toggle Navigation'}
              icon={isMenuOpen || isUserProfileOpen ? <CloseIcon /> : <BurgerMenuIcon />}
            />
          </Flex>
          {user || data?.user ? (
            <Box display={{ base: 'none', lg: 'flex' }}>
              <ProfileMenu user={user} />
            </Box>
          ) : (
            <Stack flexDirection="row" alignItems="center" display={{ base: 'none', lg: 'flex' }}>
              <Link href={`${SIGN_IN_ROUTE}?callback_url=${pathname}`}>
                <Button
                  borderRadius={6}
                  fontSize={14}
                  width={90}
                  height={38}
                  fontWeight={600}
                  bg="#fff"
                  color="#3CB4E7"
                  border="1px solid #3CB4E7">
                  Log In
                </Button>
              </Link>
              <Link href={SIGN_UP_ROUTE}>
                <Button borderRadius={6} fontSize={14} fontWeight={600} height={38} width={127}>
                  Get Started
                </Button>
              </Link>
            </Stack>
          )}
        </Flex>
      </Flex>

      <Collapse in={isMenuOpen} animateOpacity ref={collapseRef}>
        <MobileNav navItems={[]} user={user || data?.user || null} onClose={closeMenu} />
      </Collapse>

      <Collapse in={isUserProfileOpen} animateOpacity ref={userCollapseRef}>
        <Accordion allowToggle defaultIndex={0}>
          <ProfileNavItem user={user || data?.user || null} onClose={closeUserProfile} />
        </Accordion>
      </Collapse>
    </Box>
  );
};
export default memo(Header);
