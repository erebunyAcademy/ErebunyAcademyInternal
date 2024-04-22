'use client';
import React, { FC, memo } from 'react';
import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { MemberType } from '@/types/member';
import { LEADERSHIP_ROUTE } from '@/utils/constants/routes';

type TrainerCardProps = {
  trainer: MemberType;
};

const TrainerCard: FC<TrainerCardProps> = ({ trainer }) => {
  return (
    <Box
      margin={{
        base: '0',
        lg: '40px 0 0 0',
      }}
      display="flex"
      cursor="pointer"
      as={Link}
      href={`${LEADERSHIP_ROUTE}/${trainer.id}`}
      gap="20px"
      flexWrap="wrap"
      _hover={{
        boxShadow: '0px 15px 20px 0px rgba(0, 0, 0, 0.05)',
      }}
      transition="all 0.3s"
      borderRadius="0px 0px 6px 6px"
      justifyContent="center">
      <Box maxW="285px">
        <Box
          overflow="hidden"
          position="relative"
          bg="pink"
          borderTopRightRadius="72px"
          borderTopLeftRadius="12px"
          width="285px"
          height="271px">
          <Image
            src={trainer.avatarSrc}
            alt="Treners"
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>

        <UnorderedList
          textAlign="center"
          fontSize="16px"
          lineHeight="21.28px"
          fontWeight="400"
          m="0"
          listStyleType="none"
          padding="16px 10px">
          <ListItem mb="8px" fontWeight="700">
            {trainer.firstName} {trainer.lastName}
          </ListItem>
          <ListItem pb="10px" borderBottom="1px solid #F3F4F6">
            {trainer.position}
          </ListItem>
          <ListItem pt="10px" mb="6px">
            Enrolled students: {trainer.enrolledStudents}
          </ListItem>
          <ListItem>Graduated students: {trainer.graduatedStudents}</ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
};

export default memo(TrainerCard);
