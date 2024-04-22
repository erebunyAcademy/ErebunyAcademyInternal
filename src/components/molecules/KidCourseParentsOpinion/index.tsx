import React, { FC } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { segoe } from '@/utils/constants/fonts';

type KidCourseParentsOpinionProps = {};

const KidCourseParentsOpinion: FC<KidCourseParentsOpinionProps> = () => {
  return (
    <Flex maxWidth={1200} margin="0 auto" p={0} gap="70px">
      <Flex flexDirection="column" width={235} display={{ base: 'none', md: 'block' }}>
        <Box borderRadius="87px" overflow="hidden" display="flex" justifyContent="flex-end">
          <Image
            src="/images/kids-parent-comments/parent-2.webp"
            alt="Parents image"
            width={87}
            height={85.5}
            style={{ borderRadius: '87px' }}
          />
        </Box>
        <Box borderRadius="171px" overflow="hidden">
          <Image
            src="/images/kids-parent-comments/parent-1.webp"
            alt="Parents image"
            width={171}
            height={171}
            style={{ borderRadius: '171px' }}
          />
        </Box>
        <Box borderRadius="87px" overflow="hidden" display="flex" justifyContent="flex-end">
          <Image
            src="/images/kids-parent-comments/parent-3.webp"
            alt="Parents image"
            width={87}
            height={85.5}
            style={{ borderRadius: '87px' }}
          />
        </Box>
      </Flex>
      <Box width={895}>
        <Heading
          className={segoe.className}
          fontSize={{ base: '28px', md: '32px' }}
          fontStyle="normal"
          fontWeight={700}
          lineHeight={{ base: '36px', md: 'normal' }}
          color="#353F4B"
          textAlign="center"
          m={{ base: '0 0 16px 0', sm: '0 0 40px 0' }}>
          What Parents Say About Our Classes
        </Heading>
        <Flex
          gap={{ base: '16px', md: '65px' }}
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center">
          <Box maxWidth="255px">
            <Image src="/icons/icon_dots_grey.png" alt="Dots" width={24} height={24} />
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="22px"
              color="#2D2E2E"
              m={{ base: '8px 0 8px 0', md: '32px 0 32px 0' }}>
              My daughter, Mane Hayrapetyan, participated in the "Graphic Design" course and
              graduated with great success. She got high-quality knowledge, skill and experience in
              that field. Even after graduation, specialists do not hesitate to help, if necessary.
            </Text>
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={600}
              lineHeight="normal"
              color="#2D2E2E"
              m={{ base: '0 0 4px 0', sm: '0 0 8px 0' }}>
              Alvard Hayrapetyan
            </Text>
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="22px"
              color="#2D2E2E">
              Parent
            </Text>
          </Box>
          <Box maxWidth="255px">
            <Image src="/icons/icon_dots_grey.png" alt="Dots" width={24} height={24} />
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="22px"
              color="#2D2E2E"
              m={{ base: '8px 0 8px 0', md: '32px 0 32px 0' }}>
              My son participated in the robotics course. He participated in all the courses with
              great enthusiasm. I thank Persona Kids Academy for such high quality education and
              positive atmosphere.
            </Text>
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={600}
              lineHeight="normal"
              color="#2D2E2E"
              m={{ base: '0 0 4px 0', sm: '0 0 8px 0' }}>
              Sona Harutyunyan
            </Text>
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="22px"
              color="#2D2E2E">
              Parent
            </Text>
          </Box>
          <Box maxWidth="255px">
            <Image src="/icons/icon_dots_grey.png" alt="Dots" width={24} height={24} />
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="22px"
              color="#2D2E2E"
              m={{ base: '8px 0 8px 0', md: '32px 0 32px 0' }}>
              My child attended the Persona Kids Academy programming course. The wealth of knowledge
              he gained there is beyond words. Thank you Persona Kids Academy for such high quality.
            </Text>
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={600}
              lineHeight="normal"
              color="#2D2E2E"
              m={{ base: '0 0 4px 0', sm: '0 0 8px 0' }}>
              Mane Poghosyan
            </Text>
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="22px"
              color="#2D2E2E">
              Parent
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default KidCourseParentsOpinion;
