import React, { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { BenefitType } from '@/utils/constants/benefits';
import { segoe } from '@/utils/constants/fonts';

type BenefitCardProps = {
  benefit: BenefitType;
};

const BenefitCard: FC<BenefitCardProps> = ({ benefit }) => {
  return (
    <Flex
      flexDirection="column"
      gap="16px"
      width="285px"
      height="348px"
      borderRadius="12px"
      boxShadow="0px 4px 8px 0px rgba(0, 0, 0, 0.10)"
      background="#fff"
      padding="24px 30px">
      <Box display="flex" justifyContent="center" my="10px">
        <Image src={benefit.img} alt="" width={65} height={56} />
      </Box>
      <Flex justifyContent="center">
        <Text as="span" color="#222" fontSize="16px" fontWeight={700} className={segoe.className}>
          {benefit.title}
        </Text>
      </Flex>
      <Flex justifyContent="center">
        <Text
          as="span"
          textAlign="center"
          color="#5B5B5B"
          className={segoe.className}
          fontSize="14px"
          fontWeight={400}>
          {benefit.information}
        </Text>
      </Flex>
    </Flex>
  );
};

export default BenefitCard;
