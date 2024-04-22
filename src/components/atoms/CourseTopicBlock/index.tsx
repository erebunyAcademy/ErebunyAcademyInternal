import React, { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

type CourseTopicBlockProps = {
  imgSrc: string;
  imgName: string;
  link: string;
};

const CourseTopicBlock: FC<CourseTopicBlockProps> = ({ imgSrc, imgName, link }) => {
  return (
    <Box
      as={Link}
      href={link}
      cursor="pointer"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      background="#fff"
      width={{ base: '163px', md: '183px' }}
      boxShadow="0px 8px 16px 0px rgba(0, 0, 0, 0.08)"
      borderRadius="8px"
      height="109px"
      sx={{
        '&:hover': {
          '> #block': {
            width: '49px',
            height: '49px',
          },
          img: {
            width: '29px',
            height: '29px',
          },
        },
      }}>
      <Box
        as="div"
        id="block"
        bg="#C3E7F7"
        transition="all"
        transitionDuration="0.3s"
        width="40px"
        background="#FFF"
        boxShadow="0px 6px 12px 0px rgba(0, 0, 0, 0.10)"
        height="40px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt="-30px"
        borderRadius="7px">
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt={imgName}
          style={{
            transition: 'all 0.3s',
          }}
        />
      </Box>

      <Text
        as="span"
        width="100%"
        fontWeight="700"
        fontSize="16px"
        lineHeight="21.28px"
        position="absolute"
        bottom="16px"
        mx="auto"
        display="flex"
        justifyContent="center">
        {imgName}
      </Text>
    </Box>
  );
};

export default CourseTopicBlock;
