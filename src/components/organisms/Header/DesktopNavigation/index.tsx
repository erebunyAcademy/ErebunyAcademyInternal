import React, { FC, memo, useState } from 'react';
import { Box, Flex, Popover, PopoverContent, PopoverTrigger, Stack, Text } from '@chakra-ui/react';
import { OfflineCourse } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { FOR_KIDS_ROUTE, OFFLINE_COURSES_ROUTE } from '@/utils/constants/routes';
import { generateAWSUrl } from '@/utils/helpers/common';
import { generateCourseName } from '@/utils/helpers/courses';
import { NavItem, SubLabels } from '@/utils/models/header';
import DesktopSubNav from '../DesktopSubNavigation';

type Props = {
  navItems: NavItem[];
  onClose: () => void;
};

const DesktopNav: FC<Props> = ({ navItems, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<null | string>(null);
  const [isChevronIconVisible, setIsChevronIconVisible] = useState<null | number>(null);

  return (
    <Stack
      direction={'row'}
      justifyContent="center"
      alignItems="center"
      gap={40}
      onMouseLeave={() => setSelectedItem(null)}>
      {navItems.map((navItem, index) => (
        <Box
          key={index}
          sx={{
            '& popover-trigger-menu:first-child': {
              height: '100%',
            },
          }}>
          <Popover trigger="hover" id="popover-trigger-menu" isOpen={selectedItem === navItem.href}>
            <PopoverTrigger>
              <Box
                {...(navItem.href
                  ? {
                      as: Link,
                      href: navItem.href,
                      onMouseOver: () => setSelectedItem(navItem.href || null),
                      onClick: () => {
                        setSelectedItem(null);
                        onClose();
                      },
                    }
                  : {})}
                cursor="pointer"
                fontSize={16}
                fontWeight={400}
                height="100%"
                display="flex"
                alignItems="center"
                color="#222"
                _hover={{
                  textDecoration: 'none',
                  color: '#3CB4E7',
                }}>
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children?.length ? (
              <PopoverContent
                id={Date.now().toString()}
                border={0}
                boxShadow="0px 15px 20px 0px rgba(0, 0, 0, 0.05)"
                bg="#fff"
                borderRadius="0px 0px 12px 12px"
                width="100vw"
                height={490}>
                <Stack
                  width={1200}
                  paddingTop={48}
                  paddingBottom={40}
                  margin="0 auto"
                  gap={40}
                  flexDirection="row"
                  onMouseLeave={() => setIsChevronIconVisible(null)}
                  display="flex"
                  overflow="auto">
                  <Flex
                    flexBasis="470px"
                    display="flex"
                    gap="14px"
                    flexDirection="column"
                    position="relative"
                    overflowY="auto">
                    {navItem.children.map((child: SubLabels, index: number) => (
                      <DesktopSubNav
                        key={index}
                        {...child}
                        isChevronIconVisible={isChevronIconVisible}
                        mainCourseLink={navItem.href || ''}
                        setIsChevronIconVisible={setIsChevronIconVisible}
                        onClose={() => setSelectedItem(null)}
                      />
                    ))}
                  </Flex>
                  <Stack
                    marginLeft="auto"
                    flexGrow={1}
                    display="grid"
                    justifyItems="flex-end"
                    gap={42}
                    gridTemplateColumns="repeat(4,156px)">
                    {navItem.featuredItems?.map(
                      ({ id, coverPhoto, title, forKids }: OfflineCourse) => (
                        <Flex
                          as={Link}
                          href={`${forKids ? FOR_KIDS_ROUTE : OFFLINE_COURSES_ROUTE}/${generateCourseName(title)}/${id}`}
                          key={id}
                          height="164px"
                          width="154px"
                          flexDirection="column"
                          onClick={() => setSelectedItem(null)}
                          gap="16px"
                          _hover={{
                            '& span': {
                              color: '#3CB4E7',
                            },
                          }}>
                          <Image
                            src={generateAWSUrl(coverPhoto)}
                            alt={title}
                            width={156}
                            height={104}
                            style={{
                              borderRadius: '12px',
                              objectFit: 'cover',
                              height: '104px',
                              width: '156px',
                            }}
                          />
                          <Text
                            as="span"
                            fontSize={16}
                            fontWeight={400}
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            color="#222"
                            transition="all 0.3s"
                            justifyContent="center"
                            _hover={{
                              color: 'inherit',
                            }}>
                            {title}
                          </Text>
                        </Flex>
                      ),
                    )}
                  </Stack>
                </Stack>
              </PopoverContent>
            ) : null}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

export default memo(DesktopNav);
