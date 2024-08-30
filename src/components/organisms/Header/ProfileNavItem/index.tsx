'use client';
import React, { FC, Fragment, memo, useCallback, useMemo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Flex,
  PopoverBody,
  PopoverContent,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import NavItem from '@/components/molecules/NavItem';
import { Locale } from '@/i18n';
import { ROUTE_DASHBOARD, ROUTE_PROFILE, ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { languagePathHelper } from '@/utils/helpers/language';
import { LinkItemProps } from '@/utils/helpers/permissionRoutes';

type ProfileNavItemProps = {
  user: User;
  onClose: () => void;
  linkItems: LinkItemProps[];
  lang: Locale;
};

const ProfileNavItem: FC<ProfileNavItemProps> = ({ user, onClose, linkItems, lang }) => {
  const router = useRouter();
  const t = useTranslations();
  const name = useMemo(
    () => `${user?.firstName} ${user?.lastName}`,
    [user?.firstName, user?.lastName],
  );

  const logout = useCallback(() => {
    signOut({ callbackUrl: languagePathHelper(lang, ROUTE_SIGN_IN) });
    router.refresh();
    onClose();
  }, [lang, router, onClose]);

  return (
    <PopoverContent
      w={{ base: '100vw', md: 'auto' }}
      left={0}
      right={0}
      maxHeight={`${innerHeight - 100}px`}
      overflowY="auto"
      maxWidth={{ base: '100vw', md: '400px' }}>
      <PopoverBody border="none" p={0}>
        <Accordion allowToggle defaultIndex={0}>
          <AccordionItem>
            <AccordionButton display="flex">
              <Flex
                flex={6}
                textAlign="left"
                gap="8px"
                as={Link}
                href={ROUTE_PROFILE}
                onClick={onClose}>
                <Avatar
                  name={name}
                  src={generateAWSUrl(
                    user?.attachment.find(attachment => attachment.type === 'AVATAR')?.key || '',
                  )}
                  bg="#F3F4F6"
                  color="#C0C0C0"
                />
                <Flex flexDirection="column" gap="4px">
                  <Text
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="14px"
                    fontWeight={600}
                    lineHeight="20px">
                    {name}
                  </Text>
                  <Text color="#5B5B5B" fontSize="14px" fontWeight={400}>
                    {t('myProfile')}
                  </Text>
                </Flex>
              </Flex>
              <Box flex={1}>
                <AccordionIcon />
              </Box>
            </AccordionButton>
            <AccordionPanel pb={0} bg="#F9FAFB" pt={0}>
              <Accordion allowMultiple>
                {linkItems.map(({ href, name, icon, id, isExpandable, children }) => (
                  <Fragment key={id}>
                    {isExpandable ? (
                      <AccordionItem>
                        <AccordionButton onClick={e => e.stopPropagation()}>
                          <Flex
                            as="span"
                            flex="1"
                            textAlign="left"
                            pl="24px"
                            alignItems="center"
                            gap="8px">
                            {icon}
                            {t(name)}
                          </Flex>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                          {children?.map(cl => (
                            <Box
                              key={cl.id}
                              borderRadius="9px"
                              height="52px"
                              display="flex"
                              width="100%">
                              <NavItem icon={cl.icon} href={cl.href} lang={lang} onClick={onClose}>
                                {t(cl.name)}
                              </NavItem>
                            </Box>
                          ))}
                        </AccordionPanel>
                      </AccordionItem>
                    ) : (
                      <AccordionItem>
                        <AccordionButton
                          {...(href
                            ? {
                                as: Link,
                                href: languagePathHelper(lang, href || ROUTE_DASHBOARD) || '',
                                onClick: onClose,
                              }
                            : { onClick: id === 9 ? logout : () => {} })}>
                          <Flex
                            as="span"
                            flex="1"
                            textAlign="left"
                            pl="24px"
                            alignItems="center"
                            gap="8px">
                            {icon}
                            {t(name)}
                          </Flex>
                        </AccordionButton>
                      </AccordionItem>
                    )}
                  </Fragment>
                ))}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </PopoverBody>
    </PopoverContent>
  );
};

export default memo(ProfileNavItem);
