import React, { FC } from 'react';
import { Box, Flex, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import Image from 'next/image';
import { segoe } from '@/utils/constants/fonts';

type MoreArticlesProps = {};

const MoreArticles: FC<MoreArticlesProps> = () => {
  return (
    <Flex as="section" flexDirection="column" gap={{ base: '16px', md: '40px' }}>
      <Heading
        className={segoe.className}
        textAlign="center"
        fontSize={{ base: '28px', sm: '32px' }}
        lineHeight="normal"
        fontStyle="normal"
        fontWeight={700}
        color="#222222">
        More Like This
      </Heading>

      <Flex flexDirection="column" rowGap={{ base: '16px', lg: '20px' }}>
        <Flex
          columnGap="20px"
          rowGap={{ base: '16px', lg: '0' }}
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
          justifyContent="center">
          <Flex
            flexWrap={{ base: 'wrap', md: 'nowrap' }}
            border="1px solid #5B5B5B54"
            borderRadius="8px"
            maxWidth={{ base: '100%', lg: '590px' }}>
            <Box
              borderRadius="4px 0px 0px 4px"
              minW={{ base: '100%', md: '240px' }}
              display="flex"
              justifyContent="center">
              <Image
                src="/images/public_available/article_more_img.jpg"
                width={240}
                height={176}
                alt="Card Image"
              />
            </Box>

            <UnorderedList padding="16px 20px 16px 20px" listStyleType="none" margin="0">
              <ListItem
                mb="8px"
                color="#222222"
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="700">
                9 Figma design system tips
              </ListItem>
              <ListItem
                pb="16px"
                borderBottom="1px solid #5B5B5B"
                color="#5B5B5B"
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400">
                Most of these suggestions are ideal for when you're dealing with design systems or
                huge design files, but they're also...
              </ListItem>
              <ListItem
                display="flex"
                justifyContent="space-between"
                mt="16px"
                color="#5B5B5B"
                lineHeight="18.62px"
                fontSize="14px"
                fontWeight="400">
                March 01, 2021
                <span
                  style={{
                    color: '#5B5B5B',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}>
                  <Image src="/icons/article_view.svg" width={11.6} height={9.3} alt="Card Image" />
                  111
                </span>
              </ListItem>
            </UnorderedList>
          </Flex>
          <Flex
            flexWrap={{ base: 'wrap', md: 'nowrap' }}
            border="1px solid #5B5B5B54"
            borderRadius="8px"
            maxWidth={{ base: '100%', lg: '590px' }}>
            <Box
              borderRadius="4px 0px 0px 4px"
              minW={{ base: '100%', md: '240px' }}
              display="flex"
              justifyContent="center">
              <Image
                src="/images/public_available/article_more_img.jpg"
                width={240}
                height={176}
                alt="Card Image"
              />
            </Box>

            <UnorderedList padding="16px 20px 16px 20px" listStyleType="none" margin="0">
              <ListItem
                mb="8px"
                color="#222222"
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="700">
                9 Figma design system tips
              </ListItem>
              <ListItem
                pb="16px"
                borderBottom="1px solid #5B5B5B"
                color="#5B5B5B"
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400">
                Most of these suggestions are ideal for when you're dealing with design systems or
                huge design files, but they're also...
              </ListItem>
              <ListItem
                display="flex"
                justifyContent="space-between"
                mt="16px"
                color="#5B5B5B"
                lineHeight="18.62px"
                fontSize="14px"
                fontWeight="400">
                March 01, 2021
                <span
                  style={{
                    color: '#5B5B5B',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}>
                  <Image src="/icons/article_view.svg" width={11.6} height={9.3} alt="Card Image" />
                  111
                </span>
              </ListItem>
            </UnorderedList>
          </Flex>
        </Flex>
        <Flex
          columnGap="20px"
          rowGap={{ base: '16px', lg: '0' }}
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          <Flex
            flexWrap={{ base: 'wrap', md: 'nowrap' }}
            border="1px solid #5B5B5B54"
            borderRadius="8px"
            maxWidth={{ base: '100%', lg: '590px' }}>
            <Box
              borderRadius="4px 0px 0px 4px"
              minW={{ base: '100%', md: '240px' }}
              display="flex"
              justifyContent="center">
              <Image
                src="/images/public_available/article_more_img.jpg"
                width={240}
                height={176}
                alt="Card Image"
              />
            </Box>

            <UnorderedList padding="16px 20px 16px 20px" listStyleType="none" margin="0">
              <ListItem
                mb="8px"
                color="#222222"
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="700">
                9 Figma design system tips
              </ListItem>
              <ListItem
                pb="16px"
                borderBottom="1px solid #5B5B5B"
                color="#5B5B5B"
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400">
                Most of these suggestions are ideal for when you're dealing with design systems or
                huge design files, but they're also...
              </ListItem>
              <ListItem
                display="flex"
                justifyContent="space-between"
                mt="16px"
                color="#5B5B5B"
                lineHeight="18.62px"
                fontSize="14px"
                fontWeight="400">
                March 01, 2021
                <span
                  style={{
                    color: '#5B5B5B',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}>
                  <Image src="/icons/article_view.svg" width={11.6} height={9.3} alt="Card Image" />
                  111
                </span>
              </ListItem>
            </UnorderedList>
          </Flex>
          <Flex
            flexWrap={{ base: 'wrap', md: 'nowrap' }}
            border="1px solid #5B5B5B54"
            borderRadius="8px"
            maxWidth={{ base: '100%', lg: '590px' }}>
            <Box
              borderRadius="4px 0px 0px 4px"
              minW={{ base: '100%', md: '240px' }}
              display="flex"
              justifyContent="center">
              <Image
                src="/images/public_available/article_more_img.jpg"
                width={240}
                height={176}
                alt="Card Image"
              />
            </Box>

            <UnorderedList padding="16px 20px 16px 20px" listStyleType="none" margin="0">
              <ListItem
                mb="8px"
                color="#222222"
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="700">
                9 Figma design system tips
              </ListItem>
              <ListItem
                pb="16px"
                borderBottom="1px solid #5B5B5B"
                color="#5B5B5B"
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400">
                Most of these suggestions are ideal for when you're dealing with design systems or
                huge design files, but they're also...
              </ListItem>
              <ListItem
                display="flex"
                justifyContent="space-between"
                mt="16px"
                color="#5B5B5B"
                lineHeight="18.62px"
                fontSize="14px"
                fontWeight="400">
                March 01, 2021
                <span
                  style={{
                    color: '#5B5B5B',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}>
                  <Image src="/icons/article_view.svg" width={11.6} height={9.3} alt="Card Image" />
                  111
                </span>
              </ListItem>
            </UnorderedList>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MoreArticles;
