import React, { FC } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import Image from 'next/image';
import { Button } from '@/components/atoms';
import { segoe } from '@/utils/constants/fonts';

type Props = {};

const OnlineCourseItemPage: FC<Props> = () => {
  return (
    <>
      <Box
        as="section"
        borderRadius={{ base: '0 0 16px 16px', md: '0 0 72px 72px' }}
        bg="#F6FCFF"
        padding={{
          base: '0 16px ',
          lg: ' 0',
        }}>
        <Container maxW="1200px" padding="0 0 40px 0" position="relative">
          <Flex
            justifyContent="center"
            alignItems="center"
            padding="24px 0"
            gap="9px"
            flexWrap={{
              base: 'wrap-reverse',
              lg: 'nowrap',
            }}>
            <Box maxW="499px" textAlign="center">
              <Heading
                fontSize={{ base: '28px', md: '44px' }}
                fontStyle="normal"
                fontWeight={{ base: 600, md: 700 }}
                lineHeight="normal"
                color="#222"
                m="0 0 8px 0">
                Graphic Design
              </Heading>
              <Flex justifyContent="center" gap="13px">
                <Flex alignItems="center" gap="6px">
                  <Image
                    src="/icons/hollow_star.svg"
                    alt="Rating Star"
                    width={16.5}
                    height={15.8}
                  />
                  <Image
                    src="/icons/hollow_star.svg"
                    alt="Rating Star"
                    width={16.5}
                    height={15.8}
                  />
                  <Image
                    src="/icons/hollow_star.svg"
                    alt="Rating Star"
                    width={16.5}
                    height={15.8}
                  />
                  <Image
                    src="/icons/hollow_star.svg"
                    alt="Rating Star"
                    width={16.5}
                    height={15.8}
                  />
                  <Image
                    src="/icons/hollow_star.svg"
                    alt="Rating Star"
                    width={16.5}
                    height={15.8}
                  />
                </Flex>

                <Text as="span" margin="0" lineHeight="18.75px" fontSize="16px">
                  4.8
                </Text>
              </Flex>

              <Text
                m="16px 0 16px 0"
                fontSize="16px"
                fontStyle="normal"
                fontWeight={400}
                lineHeight="22px"
                color="#222">
                Master the basics of Photoshop and Illustrator and gain invaluable insights in this
                introductory level course from Jake Bartlett. By the end of this course, you'll be
                able to create your own artwork from scratch with tools and workflows used by
                professional designers every day.
              </Text>

              <Button width="236px" height="53px" p="16px 32px">
                Get your subscription
              </Button>
            </Box>

            <Box maxW="692px">
              <Box width="100%">
                <Image
                  src="/images/public_available/graphic_design_bg.png"
                  alt="Graphic Design"
                  width={692}
                  height={334}
                />
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Box
        maxWidth="1200px"
        position="relative"
        display="flex"
        margin="0 auto"
        flexWrap="wrap"
        gap="20px"
        transform={{ base: '0', md: 'translateY(-70px)' }}
        justifyContent="center">
        <Flex
          boxShadow="0px 15px 20px 0px #0000000D"
          alignItems="center"
          flexWrap="wrap"
          justifyContent="center"
          bg="#fff"
          gap="16px"
          padding="32px"
          borderRadius="12px">
          <UnorderedList
            paddingRight="16px"
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            gap="8px"
            borderRight="1px solid #C0C0C0">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Language
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              Armenian
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            paddingRight="16px"
            flexDirection="column"
            gap="8px"
            borderRight="1px solid #C0C0C0">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Video
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              40 video
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            gap="8px"
            paddingRight={{
              base: '0',
              sm: '16px',
            }}
            borderRight={{
              base: 'none',
              sm: '1px solid #C0C0C0',
            }}>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Duration
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              17 weeks
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            paddingRight="16px"
            gap="8px"
            borderRight="1px solid #C0C0C0">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Total
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              128 hours
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            paddingRight="16px"
            display="flex"
            flexDirection="column"
            gap="8px"
            borderRight="1px solid #C0C0C0">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Level
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              Advance
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            gap="8px"
            paddingRight={{
              base: '0',
              sm: '16px',
            }}
            borderRight={{
              base: 'none',
              sm: '1px solid #C0C0C0',
            }}>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Certificate
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              By level
            </ListItem>
          </UnorderedList>

          <UnorderedList
            listStyleType="none"
            margin="0"
            display="flex"
            flexDirection="column"
            gap="8px">
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="400" color="#5B5B5B">
              Course ended
            </ListItem>
            <ListItem lineHeight="21.28px" fontSize="16px" fontWeight="700" color="#222222">
              120 students
            </ListItem>
          </UnorderedList>
        </Flex>
      </Box>

      <Box
        padding={{
          base: '0 16px ',
          xl: ' 0',
        }}>
        <Flex
          as="section"
          gap="20px"
          maxWidth={1200}
          m="0 auto"
          mt={{ base: '36px', lg: '0' }}
          flexDirection={{ base: 'column', lg: 'row' }}>
          <Box width={{ base: '100%', lg: '694px' }}>
            <Heading
              className={segoe.className}
              textAlign={{ base: 'center', sm: 'left' }}
              fontSize={{ base: '28px', md: '32px' }}
              fontStyle="normal"
              fontWeight={700}
              lineHeight="normal"
              color="#222"
              m="0 0 16px 0">
              Description
            </Heading>
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontWeight={400}
              lineHeight="normal"
              color="#222"
              m={{ base: '0 0 36px 0', md: '0 0 46px 0' }}>
              Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out
              print, graphic or web designs. The passage is attributed to an unknown typesetter in
              the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum
              et Malorum for use in a type specimen book. It usually begins with: Lorem ipsum, or
              lipsum as it is sometimes known, is dummy text used in laying out print, graphic or
              web designs. The passage is attributed to an unknown typesetter in the 15th century
              who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for
              use in a type specimen book. It usually begins with:
            </Text>
            <Heading
              className={segoe.className}
              textAlign={{ base: 'center', sm: 'left' }}
              fontSize="28px"
              fontStyle="normal"
              fontWeight={700}
              lineHeight="36px"
              color="#222"
              m="0 0 16px 0">
              What you'll learn
            </Heading>
            <UnorderedList
              display="flex"
              flexDirection="column"
              margin="0"
              gap="16px"
              listStyleType="0"
              color="#222222">
              <ListItem
                lineHeight="24px"
                fontWeight="400"
                fontSize="16px"
                display="flex"
                alignItems="flex-start"
                gap="12px">
                <Image src="/icons/confirm-icon-green.svg" alt="Confirm" width={24} height={24} />
                Introduction to the production process (pre, production, and post)
              </ListItem>

              <ListItem
                lineHeight="24px"
                fontWeight="400"
                fontSize="16px"
                display="flex"
                alignItems="flex-start"
                gap="12px">
                <Image src="/icons/confirm-icon-green.svg" alt="Confirm" width={24} height={24} />
                Introduction to the production process (pre, production, and post)
              </ListItem>

              <ListItem
                lineHeight="24px"
                fontWeight="400"
                fontSize="16px"
                display="flex"
                alignItems="flex-start"
                gap="12px">
                <Image src="/icons/confirm-icon-green.svg" alt="Confirm" width={24} height={24} />
                Introduction to the production process (pre, production, and post)
              </ListItem>
              <ListItem
                lineHeight="24px"
                fontWeight="400"
                fontSize="16px"
                display="flex"
                alignItems="flex-start"
                gap="12px">
                <Image src="/icons/confirm-icon-green.svg" alt="Confirm" width={24} height={24} />
                Introduction to the production process (pre, production, and post)
              </ListItem>
              <ListItem
                lineHeight="24px"
                fontWeight="400"
                fontSize="16px"
                display="flex"
                alignItems="flex-start"
                gap="12px">
                <Image src="/icons/confirm-icon-green.svg" alt="Confirm" width={24} height={24} />
                Introduction to the production process (pre, production, and post)
              </ListItem>
              <ListItem
                lineHeight="24px"
                fontWeight="400"
                fontSize="16px"
                display="flex"
                alignItems="flex-start"
                gap="12px">
                <Image src="/icons/confirm-icon-green.svg" alt="Confirm" width={24} height={24} />
                Introduction to the production process (pre, production, and post)
              </ListItem>
            </UnorderedList>
          </Box>
          <Box maxWidth={{ base: '100%', lg: '486px' }} height="620px" overflowY="auto">
            <Heading
              className={segoe.className}
              fontSize="24px"
              fontStyle="normal"
              fontWeight={700}
              lineHeight="normal"
              color="#222"
              textAlign={{ base: 'center', md: 'left' }}
              m="0 0 16px 0">
              Beginner
            </Heading>
            <Accordion allowToggle width={{ base: '100%', xl: '458px' }}>
              <AccordionItem>
                <AccordionButton justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Box
                      as="span"
                      flex="1"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={700}
                      lineHeight="normal"
                      color="#222">
                      Get Started
                    </Box>
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/time_icon.svg" alt="Time" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          1 Hour
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <AccordionIcon width={8} height={8} />
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/book_icon.svg" alt="Lessons" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          5 Lessons
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </AccordionButton>

                <AccordionPanel p="16px">
                  <OrderedList>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                  </OrderedList>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Box
                      as="span"
                      flex="1"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={700}
                      lineHeight="normal"
                      color="#222">
                      Get Started
                    </Box>
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/time_icon.svg" alt="Time" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          1 Hour
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <AccordionIcon width={8} height={8} />
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/book_icon.svg" alt="Lessons" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          5 Lessons
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </AccordionButton>

                <AccordionPanel p="16px">
                  <OrderedList>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                  </OrderedList>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Box
                      as="span"
                      flex="1"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={700}
                      lineHeight="normal"
                      color="#222">
                      Get Started
                    </Box>
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/time_icon.svg" alt="Time" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          1 Hour
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <AccordionIcon width={8} height={8} />
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/book_icon.svg" alt="Lessons" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          5 Lessons
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </AccordionButton>

                <AccordionPanel p="16px">
                  <OrderedList>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                  </OrderedList>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Box
                      as="span"
                      flex="1"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={700}
                      lineHeight="normal"
                      color="#222">
                      Get Started
                    </Box>
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/time_icon.svg" alt="Time" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          1 Hour
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <AccordionIcon width={8} height={8} />
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/book_icon.svg" alt="Lessons" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          5 Lessons
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </AccordionButton>

                <AccordionPanel p="16px">
                  <OrderedList>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                  </OrderedList>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Box
                      as="span"
                      flex="1"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={700}
                      lineHeight="normal"
                      color="#222">
                      Get Started
                    </Box>
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/time_icon.svg" alt="Time" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          1 Hour
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <AccordionIcon width={8} height={8} />
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/book_icon.svg" alt="Lessons" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          5 Lessons
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </AccordionButton>

                <AccordionPanel p="16px">
                  <OrderedList>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                  </OrderedList>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Box
                      as="span"
                      flex="1"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={700}
                      lineHeight="normal"
                      color="#222">
                      Get Started
                    </Box>
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/time_icon.svg" alt="Time" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          1 Hour
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <AccordionIcon width={8} height={8} />
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/book_icon.svg" alt="Lessons" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          5 Lessons
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </AccordionButton>

                <AccordionPanel p="16px">
                  <OrderedList>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <AccordionItem>
                      <AccordionButton justifyContent="space-between" p="16px">
                        <Flex flexDirection="column">
                          <Box
                            as="span"
                            flex="1"
                            fontSize="16px"
                            fontStyle="normal"
                            fontWeight={700}
                            lineHeight="normal"
                            color="#222">
                            Get Started
                          </Box>
                          <Box>
                            <Flex gap="8px" m="8px 0 0 0">
                              <Image src="/icons/time_icon.svg" alt="Time" width={14} height={14} />
                              <Text
                                as="span"
                                fontSize="16px"
                                fontStyle="normal"
                                fontWeight={400}
                                lineHeight="22px"
                                color="#5B5B5B">
                                1 Hour
                              </Text>
                            </Flex>
                          </Box>
                        </Flex>
                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                          <AccordionIcon width={8} height={8} />
                          <Box>
                            <Flex gap="8px" m="8px 0 0 0">
                              <Image
                                src="/icons/book_icon.svg"
                                alt="Lessons"
                                width={14}
                                height={14}
                              />
                              <Text
                                as="span"
                                fontSize="16px"
                                fontStyle="normal"
                                fontWeight={400}
                                lineHeight="22px"
                                color="#5B5B5B">
                                5 Lessons
                              </Text>
                            </Flex>
                          </Box>
                        </Box>
                      </AccordionButton>

                      <AccordionPanel p="16px">
                        <OrderedList>
                          <ListItem
                            p="16px"
                            fontSize="16px"
                            fontStyle="normal"
                            fontWeight={400}
                            lineHeight="22px"
                            color="#222">
                            <Flex>
                              <Text>Lorem ipsum dolor sit amet</Text>
                              <Text as="span" marginLeft="auto">
                                65:00
                              </Text>
                            </Flex>
                          </ListItem>
                          <ListItem
                            p="16px"
                            fontSize="16px"
                            fontStyle="normal"
                            fontWeight={400}
                            lineHeight="22px"
                            color="#222">
                            <Flex>
                              <Text>Lorem ipsum dolor sit amet</Text>
                              <Text as="span" marginLeft="auto">
                                65:00
                              </Text>
                            </Flex>
                          </ListItem>
                          <ListItem
                            p="16px"
                            fontSize="16px"
                            fontStyle="normal"
                            fontWeight={400}
                            lineHeight="22px"
                            color="#222">
                            <Flex>
                              <Text>Lorem ipsum dolor sit amet</Text>
                              <Text as="span" marginLeft="auto">
                                65:00
                              </Text>
                            </Flex>
                          </ListItem>
                          <ListItem
                            p="16px"
                            fontSize="16px"
                            fontStyle="normal"
                            fontWeight={400}
                            lineHeight="22px"
                            color="#222">
                            <Flex>
                              <Text>Lorem ipsum dolor sit amet</Text>
                              <Text as="span" marginLeft="auto">
                                65:00
                              </Text>
                            </Flex>
                          </ListItem>
                          <ListItem
                            p="16px"
                            fontSize="16px"
                            fontStyle="normal"
                            fontWeight={400}
                            lineHeight="22px"
                            color="#222">
                            <Flex>
                              <Text>Lorem ipsum dolor sit amet</Text>
                              <Text as="span" marginLeft="auto">
                                65:00
                              </Text>
                            </Flex>
                          </ListItem>
                        </OrderedList>
                      </AccordionPanel>
                    </AccordionItem>
                  </OrderedList>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton justifyContent="space-between" p="16px">
                  <Flex flexDirection="column">
                    <Box
                      as="span"
                      flex="1"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={700}
                      lineHeight="normal"
                      color="#222">
                      Get Started
                    </Box>
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/time_icon.svg" alt="Time" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          1 Hour
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <AccordionIcon width={8} height={8} />
                    <Box>
                      <Flex gap="8px" m="8px 0 0 0">
                        <Image src="/icons/book_icon.svg" alt="Lessons" width={14} height={14} />
                        <Text
                          as="span"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight={400}
                          lineHeight="22px"
                          color="#5B5B5B">
                          5 Lessons
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </AccordionButton>

                <AccordionPanel p="16px">
                  <OrderedList>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                    <ListItem
                      p="16px"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={400}
                      lineHeight="22px"
                      color="#222">
                      <Flex>
                        <Text>Lorem ipsum dolor sit amet</Text>
                        <Text as="span" marginLeft="auto">
                          65:00
                        </Text>
                      </Flex>
                    </ListItem>
                  </OrderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Flex>

        <Box as="section" maxWidth="1200px" margin={{ base: '36px auto', md: '148px auto' }}>
          <Heading
            className={segoe.className}
            m={{ base: ' 0 0 16px 0', md: '0 0 24px 0' }}
            textAlign="center"
            lineHeight="normal"
            fontWeight={{ base: 600, md: 700 }}
            fontSize={{ base: '28px', md: '32px' }}
            color="#222">
            Meet your instructor
          </Heading>
          <Text
            display={{ base: 'none', sm: 'block' }}
            maxWidth="794px"
            margin="0 auto"
            textAlign="center"
            mb="40px"
            fontSize="16px"
            fontStyle="normal"
            fontWeight={400}
            lineHeight="22px"
            color="#5B5B5B">
            Lorem ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor Lorem
            ipsum dolor sit amet, consectetur adipising elit, sed do eiusmod tempor Lorem ipsum
            dolor sit amet, consectetur adipising elit, sed do eiusmod
          </Text>
          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            height="auto"
            p={{ base: '16px', sm: '0' }}>
            <Box
              borderRadius={{ base: '16px', md: '36px' }}
              overflow="hidden"
              position="relative"
              width={{ base: '94px', sm: '487px' }}
              height={{ base: '94px', sm: '406px' }}>
              <Image
                src="/images/public_available/articles_user_img.jpg"
                alt="Author image"
                fill
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Box>
            <Box
              backgroundColor="#F9FAFB"
              borderRadius={{ base: '0', sm: '10px 70px 10px 10px' }}
              flexBasis={{ base: 'auto', md: 713 }}
              height="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              fontSize="16px"
              lineHeight="normal"
              fontStyle="normal"
              padding={{ base: '16px', md: '44px 105px 38px 21px' }}
              gap={{ base: '8px', sm: '16px' }}>
              <Text color="#222222" fontWeight={700}>
                Name Surname
              </Text>

              <Text color="#5B5B5B" fontWeight={400} textAlign={{ base: 'left', md: 'center' }}>
                Lorem ipsum dolor sit consectetur sed do eiuNext, apply this class to your
                component:Lorem ipsum dolor sit consectetur sed do Lorem ipsum dolor sit consectetur
                sed do Lorem ipsum dolor sit , consectetur sed do Lorem ipsum dolor sit ,
                consectetur sed do Lorem ipsum dolor sit consectetur sed do Lorem ipsum dolor sit
                consectetur sed do Lorem ipsum dolor sit consectetur sed do dolor sit , consectetur
                sed do Lorem ipsum dolor sit consectetur sed do Lorem ipsum dolor sit consectetur
                sed do Lorem ipsum dolor sit consectetur sed do
              </Text>

              <Button
                display={{ base: 'block', sm: 'none' }}
                width="auto"
                color="#222222"
                bg="white"
                variant="link"
                _hover={{ bg: '#white' }}
                _active={{
                  bg: '#white',
                }}
                _focus={{
                  bg: '#white',
                }}>
                Read more
              </Button>
            </Box>
          </Flex>
        </Box>

        <Box as="section" marginBottom={{ base: '36px ', lg: ' 148px' }}>
          <Heading
            className={segoe.className}
            fontSize={{ base: '24px', md: '32px' }}
            fontStyle="normal"
            fontWeight={700}
            lineHeight="normal"
            color="#222"
            textAlign="center">
            Here is what our students are saying about us
          </Heading>

          <Flex
            maxWidth="1200px"
            margin="0 auto"
            alignItems="center"
            justifyContent="center"
            gap={{ base: '0 ', md: '50px', xl: ' 162.5px' }}
            mt={{ base: '16px', sm: '55px' }}
            mb={{ base: '8px', sm: '55px' }}>
            <Box width="40px" padding="8px" display={{ base: 'none ', lg: ' block' }}>
              <Image src="/icons/arrow_left_partners.svg" alt="Arrow" height={24} width={24} />
            </Box>

            <Box
              borderRadius="15px"
              maxWidth="794px"
              padding={{
                base: '24px ',
                lg: ' 48px 90px',
                xl: ' 68px 124px',
              }}
              color="#222222"
              textAlign="center"
              bg="#FDF1F0">
              <Text
                as="p"
                fontWeight="700"
                lineHeight="normal"
                fontSize={{ base: '16px ', md: '32px' }}>
                It was a very good experience
              </Text>
              <Text fontSize="16px" lineHeight="normal">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec
                turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat
                duis diam lacus arcu. Faucibus venenatis felis id augue sit cursus pellentesque enim
                arcu. Elementum felis magna pretium in tincidunt. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas.
              </Text>
            </Box>

            <Box padding="8px" display={{ base: 'none ', lg: ' block' }}>
              <Image src="/icons/arrow_right_partners.svg" alt="Arrow" height={24} width={24} />
            </Box>
          </Flex>

          <Flex
            alignItems="center"
            gap="40px"
            maxW="579px"
            margin=" 0 auto"
            display={{ base: 'none ', md: 'flex ' }}>
            <Image
              src="/icons/feedback_students_first.png"
              alt="Feedback"
              width={72.7}
              height={75.9}
            />
            <Image
              src="/icons/feedback_students_second.png"
              alt="Feedback"
              width={72.7}
              height={75.9}
            />

            <Image
              src="/icons/feedback_students_third.png"
              alt="Feedback"
              width={126.9}
              height={132.5}
            />
            <Image
              src="/icons/feedback_students_first.png"
              alt="Feedback"
              width={72.7}
              height={75.9}
            />
            <Image
              src="/icons/feedback_students_second.png"
              alt="Feedback"
              width={72.7}
              height={75.9}
            />
          </Flex>
        </Box>

        <Box as="section" maxWidth={1320} m={{ base: '36px auto', md: '148px auto' }}>
          <Heading
            className={segoe.className}
            fontSize="28px"
            fontStyle="normal"
            fontWeight={700}
            lineHeight="36px"
            color="#222"
            m="0 0 40px 0"
            textAlign="center">
            Related courses
          </Heading>
          <Flex
            gap="20px"
            alignItems="center"
            justifyContent="center"
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
            <Box cursor="pointer" display={{ base: 'none', lg: 'block' }}>
              <Image
                src="/icons/course_page_arrow_left.svg"
                alt="Left arrow"
                width={24}
                height={24}
              />
            </Box>
            <Box width="387px">
              <Box
                borderRadius="12px 12px 0px 0px"
                overflow="hidden"
                height="242px"
                position="relative">
                <Image
                  src="/images/public_available/courses_img.jpg"
                  alt="Kids offline courses"
                  width={387}
                  height={242}
                />
                <Image
                  width={24}
                  height={24}
                  alt="Heart icon"
                  src="/icons/heart_icon.svg"
                  style={{ position: 'absolute', right: '24px', top: '24px' }}
                />
              </Box>
              <Box
                p="16px"
                borderRadius=" 0px 0px 12px 12px"
                background="#FFFFFF"
                boxShadow="0px 4px 6px 0px rgba(0, 0, 0, 0.06)">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  mb="8px"
                  fontStyle="normal"
                  fontWeight={700}
                  lineHeight="normal"
                  color="#222">
                  <Text as="span" fontSize="24px">
                    Graphic Design
                  </Text>
                  <Text as="span" fontSize="16px">
                    100$/month
                  </Text>
                </Flex>
                <Text
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight={400}
                  lineHeight="22px"
                  color="#222">
                  Get inspired by this revived W.H. Auden's Hymn to the United Nations.
                </Text>
                <Flex display="flex" alignItems="center" gap="21.72px" my="16px">
                  <Flex gap="8.14px">
                    <Image width={22} height={22} alt="Time icon" src="/icons/time_icon.svg" />
                    <span
                      style={{
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 'normal',
                      }}>
                      3 month
                    </span>
                  </Flex>
                  <Flex gap="8.14px">
                    <Image width={22} height={22} alt="Level icon" src="/icons/level_icon.svg" />
                    <span
                      style={{
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 'normal',
                      }}>
                      Open level
                    </span>
                  </Flex>
                </Flex>
                <Flex gap="16px">
                  <Button>Enroll now</Button>
                  <Button
                    bg="#FFFFFF"
                    color="#222"
                    _hover={{
                      bg: '#FFFFFF',
                      color: '#5B5B5B',
                    }}
                    _focus={{
                      bg: '#FFFFFF',
                      color: '#222',
                    }}>
                    View Syllabus
                  </Button>
                </Flex>
              </Box>
            </Box>
            <Box width="387px">
              <Box
                borderRadius="12px 12px 0px 0px"
                overflow="hidden"
                height="242px"
                position="relative">
                <Image
                  src="/images/public_available/courses_img.jpg"
                  alt="Kids offline courses"
                  width={387}
                  height={242}
                />
                <Image
                  width={24}
                  height={24}
                  alt="Heart icon"
                  src="/icons/heart_icon.svg"
                  style={{ position: 'absolute', right: '24px', top: '24px' }}
                />
              </Box>
              <Box
                p="16px"
                borderRadius=" 0px 0px 12px 12px"
                background="#FFFFFF"
                boxShadow="0px 4px 6px 0px rgba(0, 0, 0, 0.06)">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  mb="8px"
                  fontStyle="normal"
                  fontWeight={700}
                  lineHeight="normal"
                  color="#222">
                  <Text as="span" fontSize="24px">
                    Graphic Design
                  </Text>
                  <Text as="span" fontSize="16px">
                    100$/month
                  </Text>
                </Flex>
                <Text
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight={400}
                  lineHeight="22px"
                  color="#222">
                  Get inspired by this revived W.H. Auden's Hymn to the United Nations.
                </Text>
                <Flex display="flex" alignItems="center" gap="21.72px" my="16px">
                  <Flex gap="8.14px">
                    <Image width={22} height={22} alt="Time icon" src="/icons/time_icon.svg" />
                    <span
                      style={{
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 'normal',
                      }}>
                      3 month
                    </span>
                  </Flex>
                  <Flex gap="8.14px">
                    <Image width={22} height={22} alt="Level icon" src="/icons/level_icon.svg" />
                    <span
                      style={{
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 'normal',
                      }}>
                      Open level
                    </span>
                  </Flex>
                </Flex>
                <Flex gap="16px">
                  <Button>Enroll now</Button>
                  <Button
                    bg="#FFFFFF"
                    color="#222"
                    _hover={{
                      bg: '#FFFFFF',
                      color: '#5B5B5B',
                    }}
                    _focus={{
                      bg: '#FFFFFF',
                      color: '#222',
                    }}>
                    View Syllabus
                  </Button>
                </Flex>
              </Box>
            </Box>
            <Box width="387px">
              <Box
                borderRadius="12px 12px 0px 0px"
                overflow="hidden"
                height="242px"
                position="relative">
                <Image
                  src="/images/public_available/courses_img.jpg"
                  alt="Kids offline courses"
                  width={387}
                  height={242}
                />
                <Image
                  width={24}
                  height={24}
                  alt="Heart icon"
                  src="/icons/heart_icon.svg"
                  style={{ position: 'absolute', right: '24px', top: '24px' }}
                />
              </Box>
              <Box
                p="16px"
                borderRadius=" 0px 0px 12px 12px"
                background="#FFFFFF"
                boxShadow="0px 4px 6px 0px rgba(0, 0, 0, 0.06)">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  mb="8px"
                  fontStyle="normal"
                  fontWeight={700}
                  lineHeight="normal"
                  color="#222">
                  <Text as="span" fontSize="24px">
                    Graphic Design
                  </Text>
                  <Text as="span" fontSize="16px">
                    100$/month
                  </Text>
                </Flex>
                <Text
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight={400}
                  lineHeight="22px"
                  color="#222">
                  Get inspired by this revived W.H. Auden's Hymn to the United Nations.
                </Text>
                <Flex display="flex" alignItems="center" gap="21.72px" my="16px">
                  <Flex gap="8.14px">
                    <Image width={22} height={22} alt="Time icon" src="/icons/time_icon.svg" />
                    <span
                      style={{
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 'normal',
                      }}>
                      3 month
                    </span>
                  </Flex>
                  <Flex gap="8.14px">
                    <Image width={22} height={22} alt="Level icon" src="/icons/level_icon.svg" />
                    <span
                      style={{
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 'normal',
                      }}>
                      Open level
                    </span>
                  </Flex>
                </Flex>
                <Flex gap="16px">
                  <Button>Enroll now</Button>
                  <Button
                    bg="#FFFFFF"
                    color="#222"
                    _hover={{
                      bg: '#FFFFFF',
                      color: '#5B5B5B',
                    }}
                    _focus={{
                      bg: '#FFFFFF',
                      color: '#222',
                    }}>
                    View Syllabus
                  </Button>
                </Flex>
              </Box>
            </Box>
            <Box cursor="pointer" display={{ base: 'none', lg: 'block' }}>
              <Image
                src="/icons/course_page_arrow_right.svg"
                alt="Right arrow"
                width={24}
                height={24}
              />
            </Box>
          </Flex>
          <Box maxWidth="1200px" margin="0 auto">
            <Button
              m={{ base: '8px 0 0 0', md: '40px 0 0 0' }}
              display="flex"
              justifyContent="flex-end"
              width="100%"
              color="#222222"
              bg="white"
              variant="link"
              _hover={{ bg: '#white' }}
              _active={{
                bg: '#white',
              }}
              _focus={{
                bg: '#white',
              }}>
              View all courses
            </Button>
          </Box>
        </Box>

        <Box maxWidth={1200} m="0 auto" mb={{ base: '36px ', lg: ' 148px' }}>
          <Heading
            textAlign={{ base: 'center', sm: 'left' }}
            color="#222222"
            margin={{
              base: '0 0 16px 0',
              md: '0 0 40px 0',
            }}
            fontWeight="700"
            lineHeight="normal"
            fontSize={{ base: '24px', md: '32px ' }}>
            Register for a free consultation
          </Heading>

          <Box maxWidth="1200px" margin="0 auto" color="#C0C0C0">
            <form style={{ width: '100%' }}>
              <Flex
                width="100%"
                alignItems="end"
                gap="20px"
                mb="40px"
                flexWrap="wrap"
                justifyContent="center">
                <FormControl
                  maxWidth={{
                    base: '335px ',
                    xl: ' 285px',
                  }}>
                  <FormLabel
                    margin="0 0 4px 0"
                    color="#222222"
                    fontSize="14px"
                    fontWeight="600"
                    lineHeight="20px">
                    Name
                  </FormLabel>
                  <Input
                    fontWeight="400"
                    height="37px"
                    lineHeight="21.28px"
                    fontSize="16px"
                    padding="8px 12px"
                    border="1px solid #C0C0C0"
                    type="text"
                    placeholder="Enter name"
                  />
                </FormControl>

                <FormControl
                  maxWidth={{
                    base: '335px ',
                    xl: ' 285px',
                  }}>
                  <FormLabel
                    margin="0 0 4px 0"
                    color="#222222"
                    fontSize="14px"
                    fontWeight="600"
                    lineHeight="20px">
                    Email
                  </FormLabel>
                  <Input
                    fontWeight="400"
                    height="37px"
                    lineHeight="21.28px"
                    fontSize="16px"
                    padding="8px 12px"
                    border="1px solid #C0C0C0"
                    type="email"
                    placeholder="you@example.com"
                  />
                </FormControl>

                <FormControl maxWidth="335px">
                  <FormLabel
                    margin="0 0 4px 0"
                    fontSize="14px"
                    color="#222222"
                    fontWeight="600"
                    lineHeight="20px">
                    Phone Number
                  </FormLabel>
                  <Input
                    fontWeight="400"
                    height="37px"
                    lineHeight="21.28px"
                    fontSize="16px"
                    padding="8px 12px"
                    border="1px solid #C0C0C0"
                    type="number"
                    placeholder="+374 98 901 820"
                  />
                </FormControl>
                <Button
                  lineHeight="21.28px"
                  fontSize="16px"
                  padding="16px 32px"
                  width={{ base: '100%', lg: '235px' }}
                  height="42px">
                  Request a consultation
                </Button>
              </Flex>
            </form>
          </Box>
        </Box>
      </Box>

      <Flex px={{ base: '16px', xl: '0px' }} backgroundColor="#1f1646" flexShrink={0}>
        <Flex
          alignItems="center"
          flexDirection="column"
          width="794px"
          margin="0 auto"
          color="#ffffff"
          lineHeight="normal"
          fontStyle="normal"
          py="40px">
          <Text fontSize={{ base: '28px', md: '32px' }} fontWeight={{ base: 600, md: 700 }}>
            Get your package
          </Text>
          <Text fontSize="16px" fontWeight={400} mt="16px" mb="24px" lineHeight="22px">
            We're here to help your child succeed, no matter their experience level.
          </Text>
          <Button
            padding="16px 32px"
            borderRadius="6px"
            backgroundColor="#fff"
            color="#1f1646"
            _hover={{
              bg: '#F3F4F6',
              color: '#1f1646',
            }}
            _focus={{
              bg: '#E9E9E9',
              color: '#1f1646',
            }}>
            Subscribe
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default OnlineCourseItemPage;
