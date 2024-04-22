import React, { FC } from 'react';
import { Box, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';

type OurHistorySectionProps = {};

const OurHistorySection: FC<OurHistorySectionProps> = () => {
  return (
    <Box pb={{ base: '36px', md: '100px', lg: '148px' }}>
      <Box
        padding="96px 0"
        mb="37px"
        bg="#3CB4E7"
        textAlign="center"
        color="#FFF"
        position="relative">
        <Heading maxW="804px" margin="0 auto" fontSize="32px" lineHeight="42.56px" fontWeight="700">
          Our History
        </Heading>
        <Text
          display={{ base: 'none', xl: 'block' }}
          as="span"
          position="absolute"
          width="50px"
          height="50px"
          backgroundColor="#3CB4E7"
          borderRadius="50%"
          bottom="-25px"
          left="50%"
          transform="translateX(-25%)"
        />
      </Box>

      <Box maxW="752px" position="relative" margin="0 auto" display="flex">
        <Box
          maxWidth="348px"
          marginLeft={{ base: '36px', md: '0' }}
          marginRight={{ base: '0', md: '40px' }}
          order={{ base: '1', md: '0' }}>
          <UnorderedList
            margin={{ base: '0 0 16px 0', md: '0 0 96px 0' }}
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2019</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span">Idea to create Persona Business Academy </Text>
              <Text
                position="absolute"
                zIndex="4"
                right={{ base: '98%', md: '47.5%' }}
                top={{ base: '2.5%', md: '4%' }}
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"
              />
            </ListItem>
            <ListItem color="#222222">
              After studying the market, the two co-founders realized that the market needs more
              professional IT training center with unique approaches, as a result of which Persona
              Business Academy was created as an offline education center.
            </ListItem>
          </UnorderedList>
          <UnorderedList
            display={{ base: 'block', md: 'none' }}
            margin={{ base: '0 0 16px 0', md: '0 0 96px 0' }}
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2020</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span"> Start launching PBA </Text>
              <Text
                position="absolute"
                right="98%"
                zIndex="4"
                top="17%"
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"></Text>
            </ListItem>

            <ListItem fontWeight="400" color="#222222">
              The problem was set in such a way that in order to ensure maximum effectiveness, the
              groups should be small and taking this approach into account, we were able to make the
              examination stage more effective by leaving the group examination and making it
              individual.
            </ListItem>
          </UnorderedList>
          <UnorderedList
            margin={{ base: '0 0 16px 0', md: '0 0 96px 0' }}
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2020</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span"> Selection of trainers </Text>
              <Text
                position="absolute"
                right={{ base: '98%', md: '47.5%' }}
                zIndex="4"
                top={{ base: '32%', md: '31%' }}
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"
              />
            </ListItem>
            <ListItem fontWeight="400" color="#222222">
              Since the idea was to create an academy with a high level of education, we started the
              search for the highest senior level professionals in Armenia, who work in the biggest
              tech companies. It is very important for us that each lecturer, in addition to having
              a good command of his profession, can get the results that are set in front of him as
              well as towards the demanding student.
            </ListItem>
          </UnorderedList>

          <UnorderedList
            display={{ base: 'block', md: 'none' }}
            margin={{ base: '0 0 16px 0', md: '0 0 96px 0' }}
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2021</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span">Start of courses</Text>
              <Text
                position="absolute"
                right="98%"
                zIndex="4"
                top="51.6%"
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"
              />
            </ListItem>
            <ListItem fontWeight="400" color="#222222">
              The structure of the courses is such that regardless of students' knowledge, students
              acquire advanced level knowledge. Course exams are such that each student gets the
              opportunity to check his knowledge at each level and improve it during the exam
              itself. The peculiarity of PBA is that at each level, students pass are individual
              examination and receive the appropriate qualification.
            </ListItem>
          </UnorderedList>

          <UnorderedList
            margin={{ base: '0 0 16px 0', md: '0 0 96px 0' }}
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2022</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span">Start Of Talent Transformation Program</Text>
              <Text
                position="absolute"
                right={{ base: '98%', md: '47.5%' }}
                zIndex="4"
                top={{ sm: '72%', md: '65.5%' }}
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"></Text>
            </ListItem>
            <ListItem fontWeight="400" color="#222222">
              Talent transformation program was launched in the middle of 2023, the goal of which
              was to train experts in digital marketing. It is the only one of its kind in the
              Republic of Armenia. TTP is the best choice to study the entire toolkit of digital
              marketing in one course.
            </ListItem>
          </UnorderedList>

          <UnorderedList
            display={{ base: 'block', md: 'none' }}
            margin={{ base: '0 0 16px 0', md: '0 0 96px 0' }}
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2024</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span">Pba.am First E-Learning Platform In Armenia</Text>
              <Text
                position="absolute"
                right="98%"
                zIndex="4"
                top="87.5%"
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"></Text>
            </ListItem>
            <ListItem fontWeight="400" color="#222222">
              PBA.am will be the first professional e-learning platform in Armenia, which includes
              the specialized programs of professionals qualified by PBA in one common platform.
              PBA.am is planned to be launched in June 2024.
            </ListItem>
          </UnorderedList>
        </Box>

        <Box width="2px" backgroundColor="#000000" position="relative" padding="40px 0 0 0" />

        <Box
          marginTop="55px"
          maxWidth="303px"
          marginLeft="60px"
          display={{ base: 'none', md: 'block' }}>
          <UnorderedList
            margin="0 0 96px 0"
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2020</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span"> Start launching PBA </Text>
              <Text
                position="absolute"
                right="47.5%"
                zIndex="4"
                top="8%"
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"></Text>
            </ListItem>

            <ListItem fontWeight="400" color="#222222">
              The problem was set in such a way that in order to ensure maximum effectiveness, the
              groups should be small and taking this approach into account, we were able to make the
              examination stage more effective by leaving the group examination and making it
              individual.
            </ListItem>
          </UnorderedList>

          <UnorderedList
            margin="0 0 96px 0"
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2021</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span">Start of courses</Text>
              <Text
                position="absolute"
                right="47.5%"
                zIndex="4"
                top="37.5%"
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"
              />
            </ListItem>
            <ListItem fontWeight="400" color="#222222">
              The structure of the courses is such that regardless of students' knowledge, students
              acquire advanced level knowledge. Course exams are such that each student gets the
              opportunity to check his knowledge at each level and improve it during the exam
              itself. The peculiarity of PBA is that at each level, students pass are individual
              examination and receive the appropriate qualification.
            </ListItem>
          </UnorderedList>
          <UnorderedList
            margin="0 0 96px 0"
            fontSize="16px"
            color="#3CB4E7"
            lineHeight="31.92px"
            listStyleType="none"
            fontWeight="400">
            <ListItem mb="8px">2024</ListItem>
            <ListItem display="flex" mb="8px" fontSize="24px" fontWeight="700">
              <Text as="span">Pba.am First E-Learning Platform In Armenia</Text>
              <Text
                position="absolute"
                right={{ base: '98%', md: '47.5%' }}
                zIndex="4"
                top="75%"
                width="14px"
                height="14px"
                borderRadius="50"
                display="block"
                as="span"
                bg="#3CB4E7"></Text>
            </ListItem>
            <ListItem fontWeight="400" color="#222222">
              PBA.am will be the first professional e-learning platform in Armenia, which includes
              the specialized programs of professionals qualified by PBA in one common platform.
              PBA.am is planned to be launched in June 2024.
            </ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </Box>
  );
};

export default OurHistorySection;
