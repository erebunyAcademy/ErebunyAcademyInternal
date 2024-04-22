import React, { FC } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Image from 'next/image';

type PartnersSectionProps = {};

const PartnersSection: FC<PartnersSectionProps> = () => {
  return (
    <Box mb={{ base: '36px', lg: '148px' }}>
      <Heading
        textAlign="center"
        margin="0"
        as="h3"
        lineHeight={{
          base: '31.92px',
          lg: '42.56px',
        }}
        fontSize={{ base: '24px', md: '32px' }}
        fontWeight="700">
        Our Partners
      </Heading>

      <Box
        display="flex"
        maxWidth="820px"
        margin={{
          base: '16px auto 0',
          md: '40px auto 0',
        }}
        gap="34px"
        alignItems="center"
        flexWrap="wrap"
        justifyContent={{
          base: 'center',
          lg: 'space-between',
        }}>
        <Box width="118px" height="32px">
          <Image
            src="/images/public_available/partners_icon_holding.png"
            alt="Partner Icon"
            width={118}
            height={32}
          />
        </Box>
        <Box width="99px" height="32px">
          <Image
            src="/images/public_available/partners_icon_ware.png"
            alt="Partner Icon"
            width={99}
            height={32}
          />
        </Box>
        <Box width="114px" height="32px">
          <Image
            src="/images/public_available/partners_icon_oki.png"
            alt="Partner Icon"
            width={114}
            height={32}
          />
        </Box>
        <Box width="70px" height="32px">
          <Image
            src="/images/public_available/partners_icon_vilpe.png"
            alt="Partner Icon"
            width={70}
            height={32}
          />
        </Box>
        <Box width="99px" height="32px" display={{ base: 'none', lg: 'block' }}>
          <Image
            src="/images/public_available/partners_icon_ware.png"
            alt="Partner Icon"
            width={99}
            height={32}
          />
        </Box>

        <Box width="118px" height="32px" display={{ base: 'none', lg: 'block' }}>
          <Image
            src="/images/public_available/partners_icon_holding.png"
            alt="Partner Icon"
            width={118}
            height={32}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PartnersSection;
