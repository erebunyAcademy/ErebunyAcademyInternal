'use client';
import { FC } from 'react';
import { Avatar, Box, Flex, Popover, PopoverTrigger, Stack, useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { User } from 'next-auth';
import LanguagePicker from '@/components/molecules/LanguagePicker';
import { Locale } from '@/i18n';
import LogoIcon from '@/icons/college_main_icon.svg';
import { ROUTE_DASHBOARD } from '@/utils/constants/routes';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { languagePathHelper } from '@/utils/helpers/language';
import { LinkItemProps } from '@/utils/helpers/permissionRoutes';
import { Maybe } from '@/utils/models/common';

const ProfileNavItem = dynamic(() => import('./ProfileNavItem'), { ssr: false });

type HeaderProps = {
  user: Maybe<User>;
  linkItems?: LinkItemProps[];
  lang: Locale;
};

const Header: FC<HeaderProps> = ({ user, linkItems, lang }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <Flex
            alignItems="center"
            height="100%"
            as={Link}
            href={languagePathHelper(lang, ROUTE_DASHBOARD)}>
            <LogoIcon width={40} height={40} />
          </Flex>
          <Flex>
            <Flex
              display={{ base: 'block', lg: 'none' }}
              marginLeft="auto"
              mr="16px"
              alignItems="center"
              justifyContent="center"
              alignSelf="center">
              {!!user && (
                <Popover isOpen={isOpen} onClose={onClose}>
                  <PopoverTrigger>
                    <Avatar
                      name={`${user?.firstName} ${user?.lastName}`}
                      src={generateAWSUrl(
                        user.attachment.find(attachment => attachment.type === 'AVATAR')?.key || '',
                      )}
                      bg="#F3F4F6"
                      color="#C0C0C0"
                      cursor="pointer"
                      size="sm"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={onOpen}
                    />
                  </PopoverTrigger>
                  <ProfileNavItem
                    lang={lang}
                    user={user || null}
                    linkItems={linkItems!}
                    onClose={onClose}
                  />
                </Popover>
              )}
            </Flex>
            <Stack width="115px">
              <LanguagePicker lang={lang} />
            </Stack>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
