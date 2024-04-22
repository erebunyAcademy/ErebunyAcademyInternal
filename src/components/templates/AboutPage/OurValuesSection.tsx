import React, { FC } from 'react';
import { Box, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import Image from 'next/image';

type OurValuesSectionProps = {};

const OurValuesSection: FC<OurValuesSectionProps> = () => {
  return (
    <Box>
      <Box maxW="804px" margin="0 auto 40px" textAlign="center" color="#000000">
        <Heading margin="0 0 8px 0" fontSize="32px" lineHeight="42.56px" fontWeight="700">
          Our Values
        </Heading>
        <Text fontSize="16px" fontWeight="400" lineHeight="21.28px" margin="0">
          These 6 values collectively define the ethos of our Persona Business Academy, creating an
          environment where IT professionals of the future are not only educated but empowered to
          make a lasting impact on the industry.
        </Text>
      </Box>

      <Box
        maxW="1200px"
        margin="0 auto"
        pb={{ base: '36px', xl: '148px' }}
        gap="20px"
        display="flex"
        flexWrap="wrap"
        justifyContent="center">
        <Box mt={{ base: '0px', xl: '40px' }}>
          <Box
            bg="#fff"
            width={{ base: '347px', xl: '386px' }}
            boxShadow="0px 15px 20px 0px #0000000D"
            margin="0 auto"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mb="22px"
            padding={{ base: '64px 17px', xl: '82.24px 39px 134px' }}>
            <Box mb="36px" width="139px" height="145px">
              <Image
                src="/images/public_available/about_value_1.webp"
                width={138}
                height={138}
                alt="Icon"
              />
            </Box>
            <UnorderedList listStyleType="none" textAlign="center" margin="0">
              <ListItem
                mb="16px"
                lineHeight="31.92px"
                fontSize="24px"
                fontWeight="700"
                color="#FF6131">
                Lifelong Learning
              </ListItem>
              <ListItem
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400"
                color="#5B5B5B"
                display={{ base: 'none', xl: 'block' }}>
                Learning doesn't stop at graduation. We instill a passion for lifelong learning,
                equipping our students with the adaptability to thrive in the ever-evolving
                landscape of IT.
              </ListItem>
            </UnorderedList>
          </Box>

          <Box
            bg="#fff"
            width={{ base: '347px', xl: '386px' }}
            boxShadow="0px 15px 20px 0px #0000000D"
            margin="0 auto"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={{ base: '64px 17px', xl: '82.24px 39px 134px' }}>
            <Box mb="36px" width="139px" height="145px">
              <Image
                src="/images/public_available/about_value_2.webp"
                width={138}
                height={138}
                alt="Icon"
              />
            </Box>
            <UnorderedList listStyleType="none" textAlign="center" margin="0">
              <ListItem
                mb="16px"
                lineHeight="31.92px"
                fontSize="24px"
                fontWeight="700"
                color="#FF6131">
                Practical Skill Development
              </ListItem>
              <ListItem
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400"
                color="#5B5B5B"
                display={{ base: 'none', xl: 'block' }}>
                Beyond theory, we emphasize hands-on learning. Our programs focus on practical skill
                development, enabling students to apply their knowledge effectively in real-world
                scenarios.
              </ListItem>
            </UnorderedList>
          </Box>
        </Box>

        <Box>
          <Box
            bg="#fff"
            width={{ base: '347px', xl: '386px' }}
            boxShadow="0px 15px 20px 0px #0000000D"
            margin="0 auto"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mb="22px"
            padding={{ base: '64px 17px', xl: '82.24px 39px 134px' }}>
            <Box mb="36px" width="139px" height="145px">
              <Image
                src="/images/public_available/about_value_3.webp"
                width={138}
                height={138}
                alt="Icon"
              />
            </Box>
            <UnorderedList listStyleType="none" textAlign="center" margin="0">
              <ListItem
                mb="16px"
                lineHeight="31.92px"
                fontSize="24px"
                fontWeight="700"
                color="#FF6131">
                Global Perspective
              </ListItem>
              <ListItem
                display={{ base: 'none', xl: 'block' }}
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400"
                color="#5B5B5B">
                We provide a global perspective, preparing students for the interconnected world of
                IT. Our curriculum reflects diverse industry practices, ensuring graduates are
                globally competitive.
              </ListItem>
            </UnorderedList>
          </Box>

          <Box
            bg="#fff"
            width={{ base: '347px', xl: '386px' }}
            boxShadow="0px 15px 20px 0px #0000000D"
            margin="0 auto"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={{ base: '64px 17px', xl: '82.24px 39px 134px' }}>
            <Box mb="36px" width="139px" height="145px">
              <Image
                src="/images/public_available/about_value_4.webp"
                width={138}
                height={138}
                alt="Icon"
              />
            </Box>
            <UnorderedList listStyleType="none" textAlign="center" margin="0">
              <ListItem
                mb="16px"
                lineHeight="31.92px"
                fontSize="24px"
                fontWeight="700"
                color="#FF6131">
                Collaborative Learning
              </ListItem>
              <ListItem
                display={{ base: 'none', xl: 'block' }}
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400"
                color="#5B5B5B">
                Collaboration is key. We cultivate an environment where students, faculty, and
                industry professionals collaborate, share insights, and collectively elevate the
                learning experience.
              </ListItem>
            </UnorderedList>
          </Box>
        </Box>

        <Box mt={{ base: '0px', xl: '40px' }}>
          <Box
            bg="#fff"
            width={{ base: '347px', xl: '386px' }}
            boxShadow="0px 15px 20px 0px #0000000D"
            margin="0 auto"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mb="22px"
            padding={{ base: '64px 17px', xl: '82.24px 39px 134px' }}>
            <Box mb="36px" width="139px" height="145px">
              <Image
                src="/images/public_available/about_value_5.webp"
                width={138}
                height={138}
                alt="Icon"
              />
            </Box>
            <UnorderedList listStyleType="none" textAlign="center" margin="0">
              <ListItem
                mb="16px"
                lineHeight="31.92px"
                fontSize="24px"
                fontWeight="700"
                color="#FF6131">
                Professionalism
              </ListItem>
              <ListItem
                display={{ base: 'none', xl: 'block' }}
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400"
                color="#5B5B5B">
                Instill a strong sense of professionalism, ethics, and integrity in all aspects of
                IT education.
              </ListItem>
            </UnorderedList>
          </Box>

          <Box
            bg="#fff"
            width={{ base: '347px', xl: '386px' }}
            boxShadow="0px 15px 20px 0px #0000000D"
            margin="0 auto"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={{ base: '64px 17px', xl: '82.24px 39px 134px' }}>
            <Box mb="36px" width="139px" height="145px">
              <Image
                src="/images/public_available/about_value_6.webp"
                width={138}
                height={138}
                alt="Icon"
              />
            </Box>
            <UnorderedList listStyleType="none" textAlign="center" margin="0">
              <ListItem
                mb="16px"
                lineHeight="31.92px"
                fontSize="24px"
                fontWeight="700"
                color="#FF6131">
                Technological Agility
              </ListItem>
              <ListItem
                display={{ base: 'none', sm: 'none', xl: 'block' }}
                lineHeight="21.28px"
                fontSize="16px"
                fontWeight="400"
                color="#5B5B5B">
                Develop students' technological agility, ensuring they are proficient in the latest
                tools, languages, and platforms relevant to IT professions.
              </ListItem>
            </UnorderedList>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OurValuesSection;
