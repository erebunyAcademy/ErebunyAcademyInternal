'use client';
import { FC, useCallback, useRef } from 'react';
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
import Link from 'next/link';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import LanguagePicker from '@/components/molecules/LanguagePicker';
import { Locale } from '@/i18n';
import LogoIcon from '@/icons/college_main_icon.svg';
import { HOMEPAGE_ROUTE } from '@/utils/constants/routes';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { languagePathHelper } from '@/utils/helpers/language';
import { LinkItemProps } from '@/utils/helpers/permissionRoutes';
import { Maybe } from '@/utils/models/common';
import ProfileMenu from './ProfileMenu';
import ProfileNavItem from './ProfileNavItem';

type HeaderProps = {
  user: Maybe<User>;
  linkItems?: LinkItemProps[];
  lang: Locale;
};

const Header: FC<HeaderProps> = ({ user, linkItems, lang }) => {
  const {
    isOpen: isUserProfileOpen,
    onToggle: toggleUserDropdown,
    onClose: closeUserProfile,
  } = useDisclosure();
  const { data } = useSession();
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
          <Link href={languagePathHelper(lang, HOMEPAGE_ROUTE)}>
            <Flex alignItems="center" height="100%">
              <LogoIcon width={40} height={40} />
            </Flex>
          </Link>
          <Flex
            display={{ base: 'block', lg: 'none' }}
            marginLeft="auto"
            mr="16px"
            alignItems="center"
            justifyContent="center"
            alignSelf="center">
            {!!user && (
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
          {(user || data?.user) && linkItems && (
            <Box display={{ base: 'none', lg: 'flex' }}>
              <ProfileMenu user={user} linkItems={linkItems} />
            </Box>
          )}
          <Stack>
            <LanguagePicker lang={lang} />
          </Stack>
        </Flex>
      </Flex>
      <Collapse in={isUserProfileOpen} animateOpacity>
        <Accordion allowToggle defaultIndex={0}>
          <ProfileNavItem
            user={user || data?.user || null}
            onClose={closeUserProfile}
            linkItems={linkItems!}
          />
        </Accordion>
      </Collapse>
    </Box>
  );
};
export default Header;
