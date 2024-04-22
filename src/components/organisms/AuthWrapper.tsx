import { FC, memo, useMemo } from 'react';
import { Box, Center, Flex, Grid, GridItem, Text, useMediaQuery } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { breakpoints } from '@/utils/constants/chakra';
import { FORGOT_PASSWORD_ROUTE, HOMEPAGE_ROUTE } from '@/utils/constants/routes';

interface Props {
  isCenter: boolean;
  children: React.ReactNode;
}

const RightComponent: FC<Props> = memo(({ isCenter, children }) =>
  isCenter ? (
    <Center h={'100%'}>
      <Box w={'100%'}>{children}</Box>
    </Center>
  ) : (
    children
  ),
);
RightComponent.displayName = 'RightComponent';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isLargerThanMd] = useMediaQuery(`(max-width: ${breakpoints.md})`);

  const isCenter = useMemo(
    () => pathname === FORGOT_PASSWORD_ROUTE && isLargerThanMd,
    [isLargerThanMd, pathname],
  );

  return (
    <Grid
      templateColumns={{ base: '100%', md: '55% 45%' }}
      h={'100vh'}
      templateRows={{
        base: '250px auto',
        sm: 'auto auto',
      }}>
      <GridItem
        position="relative"
        height={{
          base: '250px',
          sm: '100vh',
        }}>
        <Image
          src="/images/public_available/auth_background.png"
          fill
          alt=""
          quality={10}
          priority
          style={{
            objectFit: 'cover',
          }}
        />

        <Box
          position="absolute"
          top={{ base: '40%', lg: '25%' }}
          left="45%"
          transform="translate(-50%,-50%)"
          width="70%">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gifs/welcome.gif"
            alt=""
            style={{
              width: '60%',
              margin: 'auto',
            }}
          />
          <Text
            fontSize={{ base: '24px', lg: '42px' }}
            color="#fff"
            fontWeight={600}
            width="100%"
            textAlign="center">
            REWRITE YOUR FUTURE WITH PBA
          </Text>
        </Box>
      </GridItem>
      <GridItem
        paddingY={{ base: isCenter ? 'unset' : '40px', md: '60px', '2xl': '126px' }}
        paddingX={{ md: 5 }}
        maxH={'100%'}
        overflow={'auto'}>
        <RightComponent isCenter={isCenter}>
          <Flex justifyContent="center">
            <Link href={HOMEPAGE_ROUTE}>
              <Image
                src="/icons/logo_persona.svg"
                width={135}
                height={27}
                alt="persona_logo"
                priority
                style={{ objectFit: 'contain', zIndex: 1000 }}
              />
            </Link>
          </Flex>
          <Flex justifyContent="center">{children}</Flex>
        </RightComponent>
      </GridItem>
    </Grid>
  );
};

export default memo(AuthWrapper);
