import React, { FC, memo } from 'react';
import { Box, Flex, GridItem, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { LEADERSHIP_ROUTE } from '@/utils/constants/routes';

type TeamCardProps = {
  avatarSrc?: string;
  firstName: string;
  lastName: string;
  position: string;
  hobby?: string;
  id: number;
};

const TeamCard: FC<TeamCardProps> = ({
  avatarSrc = '',
  firstName,
  lastName,
  position,
  hobby,
  id,
}) => {
  return (
    <Link href={`${LEADERSHIP_ROUTE}/${id}`}>
      <GridItem
        padding="30px"
        transition="all 0.3s"
        _hover={{
          boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.08)',
          cursor: 'pointer',
        }}>
        <Box
          overflow="hidden"
          marginBottom="16px"
          borderRadius="10.556px 10.556px 70.374px 10.556px"
          position="relative"
          height="331px">
          <Image
            src={avatarSrc}
            style={{
              objectFit: 'cover',
            }}
            fill
            alt="Leadership members"
          />
        </Box>
        <Flex
          flexDirection="column"
          gap="8px"
          textAlign="center"
          fontStyle="normal"
          lineHeight="normal"
          fontSize="16px">
          <Text color="#000" fontWeight={700}>
            {firstName} {lastName}
          </Text>
          <Text color="#5B5B5B" fontWeight={400}>
            {position}
          </Text>
          <Text color="#000" fontWeight={400}>
            {hobby}
          </Text>
        </Flex>
      </GridItem>
    </Link>
  );
};

export default memo(TeamCard);
