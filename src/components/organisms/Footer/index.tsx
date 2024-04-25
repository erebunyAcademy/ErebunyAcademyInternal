import React, { memo } from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { TERMS_AND_CONDITIONS_ROUTE } from "@/utils/constants/routes";

const Footer = async () => {
  return (
    <Stack bg="#F9FAFB" width="100%" minHeight="auto" pt="20px">
      <Container
        maxWidth={1200}
        margin="0 auto"
        marginBottom={66.14}
        fontSize={{ base: "14px", sm: "16px" }}
        fontWeight={400}
        px={{ base: "16px", xl: "0px" }}
        fontStyle="normal"
        lineHeight="20px"
      >
        <Grid
          templateColumns="repeat(auto-fit,minmax(130px, 1fr))"
          columnGap={{ base: "20px", md: "72px" }}
          rowGap={{ base: "20px", md: "72px" }}
          paddingBottom={{ base: "20px", md: "40px" }}
          borderBottom={{ base: "1px solid #C0C0C0", md: "1px solid #DDDCE3" }}
        >
          <GridItem>
            <Flex
              flexDirection="column"
              alignItems={{ base: "center", sm: "flex-start" }}
              gap={{ base: "5px", md: "15px" }}
            >
              <Text
                color="#222"
                marginBottom={{ base: "4px", md: "0px" }}
                fontWeight={600}
              >
                footerItem.rowTitle
              </Text>

              <Text
                as={Link}
                href="/"
                color="#5B5B5B"
                borderBottom="1px solid transparent"
                lineHeight="20px"
                textAlign={{ base: "center", sm: "start" }}
                _hover={{
                  borderBottomColor: "#5B5B5B",
                }}
              >
                subNav.name
              </Text>
            </Flex>
          </GridItem>
        </Grid>
        <Flex
          justifyContent={{ md: "space-between" }}
          alignItems={{ base: "center", md: "flex-start" }}
          paddingTop={{ base: "20px", md: "40px" }}
          flexDirection={{ base: "column-reverse", md: "row" }}
          gap={{ base: "24px", md: "0px" }}
        >
          <Flex
            flexDirection="column"
            gap="24px"
            alignItems={{ base: "center", md: "flex-start" }}
          >
            <Box>
              <Text>
                <Image
                  src="/icons/footer/footer.svg"
                  width={135}
                  height={27}
                  alt="persona_grey_logo"
                />
              </Text>
            </Box>
            <Box>
              <Text>
                {" "}
                © 2020 - {new Date().getFullYear()}. All rights reserved.
              </Text>
            </Box>
          </Flex>
          <Flex
            flexDirection="column"
            gap="24px"
            alignItems={{ base: "center", md: "flex-end" }}
          >
            <Box>
              <Flex gap={24}>
                <a
                  href="https://www.facebook.com/personabusinessacademy"
                  target="blank"
                >
                  <Image
                    src="/icons/facebook_icon.svg"
                    width={32}
                    height={32}
                    alt="facebook"
                  />
                </a>
                <a
                  href="https://www.instagram.com/persona_business_academy"
                  target="blank"
                >
                  <Image
                    src="/icons/instagram_icon.svg"
                    width={32}
                    height={32}
                    alt="instagram"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/school/persona-business-academy/?originalSubdomain=am"
                  target="blank"
                >
                  <Image
                    src="/icons/linkedin_icon.svg"
                    width={32}
                    height={32}
                    alt="instagram"
                  />
                </a>
              </Flex>
            </Box>
            <Box>
              <Flex gap={8}>
                <Text
                  as={Link}
                  href={`${TERMS_AND_CONDITIONS_ROUTE}?selected=0`}
                >
                  Terms & Conditions
                </Text>
                <Text>|</Text>
                <Text
                  as={Link}
                  href={`${TERMS_AND_CONDITIONS_ROUTE}?selected=12`}
                >
                  Privacy
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Stack>
  );
};

export default memo(Footer);
