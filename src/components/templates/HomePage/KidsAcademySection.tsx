import React, { FC } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import MovableButton from '@/components/atoms/MovableButton';
import { FOR_KIDS_ROUTE } from '@/utils/constants/routes';

type KidsAcademySectionProps = {};

const KidsAcademySection: FC<KidsAcademySectionProps> = () => {
  return (
    <Box
      maxWidth="1920px"
      padding={{ base: '0 16px', lg: '0 ' }}
      margin={{
        base: '0 auto 60px',
        lg: '0 auto 148px',
      }}>
      <Flex
        padding={{ base: '0', lg: '46px 59px  0 0' }}
        borderRadius={{
          base: 'none',
          lg: ' 0 74px 74px 0',
        }}
        bg={{
          base: 'transparent',
          lg: '#ECF7FC',
        }}
        gap="24px"
        maxW="1560px"
        alignItems="center"
        flexWrap={{
          base: 'wrap',
          lg: 'nowrap',
        }}
        justifyContent={{
          base: 'center',
          lg: 'flex-end',
        }}>
        <Box>
          <Image src="/icons/middle_school_kids.png" alt="Kids" width={774} height={403} />
        </Box>

        <Box width="424px" textAlign="center">
          <Heading
            lineHeight="42.56px"
            fontWeight="700"
            fontSize={{
              base: '30px',
              md: '32px',
            }}
            margin="0 0 16px 0">
            Persona Kids Academy
          </Heading>
          <Text fontWeight="400" fontSize="16px" lineHeight="21.28px" margin="0 0 24px 0">
            Building the leaders of tomorrow, one young entrepreneur at a time. Join us at our Kid's
            Business Academy and let your creativity soar beyond imagination.
          </Text>

          <Flex justifyContent="center" as={Link} href={FOR_KIDS_ROUTE}>
            <MovableButton btnText="Explore courses" />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default KidsAcademySection;
