import { FC, memo, useCallback, useRef } from 'react';
import {
  Accordion,
  Avatar,
  Box,
  Collapse,
  Flex,
  Stack,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/atoms';
import { HOMEPAGE_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/utils/constants/routes';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { LinkItemProps } from '@/utils/helpers/permissionRoutes';
import ProfileMenu from './ProfileMenu';
import ProfileNavItem from './ProfileNavItem';

type HeaderProps = {
  user: User | null;
  linkItems: LinkItemProps[];
};

const Header: FC<HeaderProps> = ({ user, linkItems }) => {
  const {
    isOpen: isUserProfileOpen,
    onToggle: toggleUserDropdown,
    onClose: closeUserProfile,
  } = useDisclosure();
  const { data } = useSession();
  const pathname = usePathname();
  const userCollapseRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: userCollapseRef,
    handler: () => {
      if (isUserProfileOpen) {
        closeUserProfile();
      }
    },
  });

  const toggleUserProfile = useCallback(() => {
    toggleUserDropdown();
  }, [toggleUserDropdown]);

  return (
    <Box
      borderBottom={2}
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
                src="/icons/college_main_icon.svg"
                width={35}
                height={35}
                alt="College icon"
                priority
                style={{ objectFit: 'contain', zIndex: 1000 }}
              />
            </Flex>
          </Link>
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
          {user || data?.user ? (
            <Box display={{ base: 'none', lg: 'flex' }}>
              <ProfileMenu user={user} linkItems={linkItems} />
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
                  Sign in
                </Button>
              </Link>
              <Link href={SIGN_UP_ROUTE}>
                <Button borderRadius={6} fontSize={14} fontWeight={600} height={38} width={127}>
                  Sign Up
                </Button>
              </Link>
            </Stack>
          )}
        </Flex>
      </Flex>

      <Collapse in={isUserProfileOpen} animateOpacity>
        <Accordion allowToggle defaultIndex={0}>
          <ProfileNavItem
            user={user || data?.user || null}
            onClose={closeUserProfile}
            linkItems={linkItems}
          />
        </Accordion>
      </Collapse>
    </Box>
  );
};
export default memo(Header);
