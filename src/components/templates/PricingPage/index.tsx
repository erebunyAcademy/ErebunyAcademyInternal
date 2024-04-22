'use client';
import React, { FC } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import Image from 'next/image';
import PlusIcon from '/public/icons/plus_pricing_icon.svg';
import AddIcon from '/public/icons/xmark_pricing_icon.svg';
import { Button } from '@/components/atoms';
import { segoe } from '@/utils/constants/fonts';

type Props = {};

const questions = [
  {
    id: 1,
    question: 'Will I be charged for a free trial?',
    answer:
      "With any plan, you have 7 days during which you won't be charged. You will be charged automatically starting on the 8 day, unless you cancel your subscription.",
  },
  {
    id: 2,
    question: 'How does PBA subscription work?',
    answer:
      'When you register on the website, you must definitely choose one of the subscription plans, in which case you have the opportunity to use it for free for 7 days. You can cancel the subscription at any time after making the payment. If you cancel the subscription before your payment date, we will refund the unused amount within 14 working days.',
  },
  {
    id: 3,
    question: 'Can I cancel my subscription any time?',
    answer:
      'Yes, you can cancel your subscription at any time. Your subscription will auto-renew until you cancel, but why would you want to? ',
  },
  {
    id: 4,
    question: 'What is the best plan for me?',
    answer:
      'Basically, the best is the light version, which is more affordable and includes many features, such as up to 50 blogs per month, up to 3 courses learning, 1 free online meet with teacher.',
  },
  {
    id: 5,
    question: 'Can I pay any annual plan month by month?',
    answer:
      'There are both monthly and annual subscription plans available on PBA. All annual subscription plans are paid upfront, so if you want to pay month by month, you need to choose one of the monthly subscription plans.',
  },
];

const PricingPage: FC<Props> = () => {
  return (
    <>
      <Box
        mt={{
          base: '36px',
          lg: '64px',
        }}
        padding={{ base: '0 16px', xl: '0' }}>
        <Box maxW="688px" margin="0 auto" textAlign="center" fontStyle="normal">
          <Heading
            mb="16px"
            color="#1F1646"
            lineHeight={{
              base: '34.13px',
              lg: '53.64px',
            }}
            fontSize={{ base: '28px', lg: '44px' }}
            fontWeight={{ base: 600, md: 700 }}>
            GET STARTED WITH <span style={{ color: '#3CB3E5' }}> PBA </span>
          </Heading>
          <Text
            maxW="478px"
            color="#222222"
            margin="0 auto"
            lineHeight="18.75px"
            fontSize="16px"
            fontWeight="400"
            mb={{ base: '36px', lg: '32px' }}>
            Every product or service we offer is a testament to our commitment to quality and
            innovation. Our value-based pricing ensures that you not only pay for a product but
            invest in an experience that surpasses your expectations.
          </Text>
        </Box>

        <Box maxW="964px" margin="0 auto">
          <Tabs
            width="100%"
            mb={{
              base: '20px',
              lg: '40px',
            }}
            variant="soft-rounded"
            id="pay_monthly_yearly"
            padding="0">
            <TabList
              display="flex"
              padding="3px"
              justifyContent="space-between"
              width="252px"
              margin="0 auto"
              bg="#ECF7FC"
              borderRadius="33px">
              <Tab
                padding="9px 16px"
                _selected={{ color: '#0000000', bg: '#fff', lineHeight: '21.28px' }}
                fontWeight="400"
                borderRadius="33px"
                lineHeight="18.75px"
                fontSize="16px"
                color="#0000000">
                Pay monthly
              </Tab>
              <Tab
                padding="9px 16px"
                _selected={{ color: '#0000000', bg: '#fff', lineHeight: '21.28px' }}
                fontWeight="400"
                borderRadius="33px"
                lineHeight="18.75px"
                fontSize="16px"
                color="#000000">
                Pay yearly
              </Tab>
            </TabList>

            <TabPanels width="100%">
              <TabPanel padding="0">
                <Box mb="40px">
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={{ base: '16px', lg: '20px' }}
                    justifyContent="center"
                    mt={{ base: '20px', sm: '40px' }}>
                    <Box
                      padding="32px"
                      width="308px"
                      bg="#FFFFFF"
                      color="#222222"
                      borderRadius="12px 12px 80px 12px"
                      boxShadow="0px 15px 20px 0px rgba(0, 0, 0, 0.05)">
                      <Heading
                        className={segoe.className}
                        textAlign="center"
                        mb="8px"
                        fontSize="32px"
                        fontWeight="700"
                        lineHeight="42.56px"
                        color="#222">
                        Standard
                      </Heading>
                      <Text
                        textAlign="center"
                        mb="8px"
                        fontSize="16px"
                        fontWeight="400"
                        lineHeight="21.28px"
                        color="#222">
                        7 days free trial
                      </Text>

                      <UnorderedList
                        listStyleType="none"
                        margin="0"
                        display="flex"
                        justifyContent="center"
                        gap="4px"
                        alignItems="flex-end">
                        <ListItem
                          fontSize="32px"
                          fontWeight="700"
                          lineHeight="42.56px"
                          color="#222">
                          4900{' '}
                          <span
                            style={{
                              verticalAlign: 'super',
                              fontSize: '16px',
                              lineHeight: '21.28px',
                              fontWeight: '400',
                            }}>
                            AMD
                          </span>
                        </ListItem>
                        <ListItem
                          lineHeight="22px"
                          fontSize="16px"
                          fontWeight="400"
                          color="#081E4A80">
                          /per month
                        </ListItem>
                      </UnorderedList>
                      <Button width="100%" p="8px 14px" mt="16px">
                        Get started
                      </Button>
                      <UnorderedList
                        m=" 16px 0 0 0"
                        listStyleType="none"
                        fontSize="16px"
                        fontStyle="normal"
                        fontWeight={400}
                        lineHeight="normal"
                        color="#222">
                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 15 BLOGS per month
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 1 COURSE LEARNING
                        </ListItem>
                      </UnorderedList>
                    </Box>

                    <Box
                      padding="32px"
                      width="308px"
                      bg="#FFFFFF"
                      color="#222222"
                      borderRadius="12px 12px 80px 12px"
                      boxShadow="0px 15px 20px 0px rgba(0, 0, 0, 0.05)">
                      <Heading
                        className={segoe.className}
                        textAlign="center"
                        mb="8px"
                        fontSize="32px"
                        fontWeight="700"
                        lineHeight="42.56px"
                        color="#222">
                        Light
                      </Heading>
                      <Text
                        textAlign="center"
                        mb="8px"
                        fontSize="16px"
                        fontWeight="400"
                        lineHeight="21.28px"
                        color="#222">
                        7 days free trial
                      </Text>

                      <UnorderedList
                        listStyleType="none"
                        margin="0"
                        display="flex"
                        justifyContent="center"
                        gap="4px"
                        alignItems="flex-end">
                        <ListItem
                          fontSize="32px"
                          fontWeight="700"
                          lineHeight="42.56px"
                          color="#222">
                          7900{' '}
                          <span
                            style={{
                              verticalAlign: 'super',
                              fontSize: '16px',
                              lineHeight: '21.28px',
                              fontWeight: '400',
                            }}>
                            AMD
                          </span>
                        </ListItem>
                        <ListItem
                          lineHeight="22px"
                          fontSize="16px"
                          fontWeight="400"
                          color="#081E4A80">
                          /per month
                        </ListItem>
                      </UnorderedList>
                      <Button width="100%" p="8px 14px" mt="16px">
                        Get started
                      </Button>
                      <UnorderedList
                        m=" 16px 0 0 0"
                        listStyleType="none"
                        fontSize="16px"
                        fontStyle="normal"
                        fontWeight={400}
                        lineHeight="normal"
                        color="#222">
                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 50 BLOGS per month
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 3 COURSES LEARNING
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          1 FREE ONLINE MEET WITH TEACHER
                        </ListItem>
                      </UnorderedList>
                    </Box>

                    <Box
                      padding="32px"
                      width="308px"
                      bg="#FFFFFF"
                      color="#222222"
                      borderRadius="12px 12px 80px 12px"
                      boxShadow="0px 15px 20px 0px rgba(0, 0, 0, 0.05)">
                      <Heading
                        className={segoe.className}
                        textAlign="center"
                        mb="8px"
                        fontSize="32px"
                        fontWeight="700"
                        lineHeight="42.56px"
                        color="#222">
                        Pro
                      </Heading>
                      <Text
                        textAlign="center"
                        mb="8px"
                        fontSize="16px"
                        fontWeight="400"
                        lineHeight="21.28px"
                        color="#222">
                        7 days free trial
                      </Text>

                      <UnorderedList
                        listStyleType="none"
                        margin="0"
                        display="flex"
                        justifyContent="center"
                        gap="4px"
                        alignItems="flex-end">
                        <ListItem
                          fontSize="32px"
                          fontWeight="700"
                          lineHeight="42.56px"
                          color="#222">
                          11900{' '}
                          <span
                            style={{
                              verticalAlign: 'super',
                              fontSize: '16px',
                              lineHeight: '21.28px',
                              fontWeight: '400',
                            }}>
                            AMD
                          </span>
                        </ListItem>
                        <ListItem
                          lineHeight="22px"
                          fontSize="16px"
                          fontWeight="400"
                          color="#081E4A80">
                          /per month
                        </ListItem>
                      </UnorderedList>
                      <Button width="100%" p="8px 14px" mt="16px">
                        Get started
                      </Button>
                      <UnorderedList
                        m=" 16px 0 0 0"
                        listStyleType="none"
                        fontSize="16px"
                        fontStyle="normal"
                        fontWeight={400}
                        lineHeight="normal"
                        color="#222">
                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UNLIMITED BLOGS
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UNLIMITED COURSES LEARNING
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 3 FREE ONLINE MEET WITH TEACHER
                        </ListItem>
                      </UnorderedList>
                    </Box>
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel padding="0">
                <Box mb="40px">
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={{ base: '16px', lg: '20px' }}
                    justifyContent="center"
                    mt={{ base: '20px', sm: '40px' }}>
                    <Box
                      padding="32px"
                      width="308px"
                      bg="#FFFFFF"
                      color="#222222"
                      borderRadius="12px 12px 80px 12px"
                      boxShadow="0px 15px 20px 0px rgba(0, 0, 0, 0.05)">
                      <Heading
                        className={segoe.className}
                        textAlign="center"
                        mb="8px"
                        fontSize="32px"
                        fontWeight="700"
                        lineHeight="42.56px"
                        color="#222">
                        Standard
                      </Heading>
                      <Text
                        textAlign="center"
                        mb="8px"
                        fontSize="16px"
                        fontWeight="400"
                        lineHeight="21.28px"
                        color="#222">
                        7 days free trial
                      </Text>

                      <UnorderedList
                        listStyleType="none"
                        margin="0"
                        display="flex"
                        justifyContent="center"
                        gap="4px"
                        alignItems="flex-end">
                        <ListItem
                          fontSize="32px"
                          fontWeight="700"
                          lineHeight="42.56px"
                          color="#222">
                          3700{' '}
                          <span
                            style={{
                              verticalAlign: 'super',
                              fontSize: '16px',
                              lineHeight: '21.28px',
                              fontWeight: '400',
                            }}>
                            AMD
                          </span>
                        </ListItem>
                        <ListItem
                          lineHeight="22px"
                          fontSize="16px"
                          fontWeight="400"
                          color="#081E4A80">
                          /per month
                        </ListItem>
                      </UnorderedList>
                      <Button width="100%" p="8px 14px" mt="16px">
                        Get started
                      </Button>
                      <UnorderedList
                        m=" 16px 0 0 0"
                        listStyleType="none"
                        fontSize="16px"
                        fontStyle="normal"
                        fontWeight={400}
                        lineHeight="normal"
                        color="#222">
                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 15 BLOGS per month
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 1 COURSE LEARNING
                        </ListItem>
                      </UnorderedList>
                    </Box>

                    <Box
                      padding="32px"
                      width="308px"
                      bg="#FFFFFF"
                      color="#222222"
                      borderRadius="12px 12px 80px 12px"
                      boxShadow="0px 15px 20px 0px rgba(0, 0, 0, 0.05)">
                      <Heading
                        className={segoe.className}
                        textAlign="center"
                        mb="8px"
                        fontSize="32px"
                        fontWeight="700"
                        lineHeight="42.56px"
                        color="#222">
                        Light
                      </Heading>
                      <Text
                        textAlign="center"
                        mb="8px"
                        fontSize="16px"
                        fontWeight="400"
                        lineHeight="21.28px"
                        color="#222">
                        7 days free trial
                      </Text>

                      <UnorderedList
                        listStyleType="none"
                        margin="0"
                        display="flex"
                        justifyContent="center"
                        gap="4px"
                        alignItems="flex-end">
                        <ListItem
                          fontSize="32px"
                          fontWeight="700"
                          lineHeight="42.56px"
                          color="#222">
                          6700{' '}
                          <span
                            style={{
                              verticalAlign: 'super',
                              fontSize: '16px',
                              lineHeight: '21.28px',
                              fontWeight: '400',
                            }}>
                            AMD
                          </span>
                        </ListItem>
                        <ListItem
                          lineHeight="22px"
                          fontSize="16px"
                          fontWeight="400"
                          color="#081E4A80">
                          /per month
                        </ListItem>
                      </UnorderedList>
                      <Button width="100%" p="8px 14px" mt="16px">
                        Get started
                      </Button>
                      <UnorderedList
                        m=" 16px 0 0 0"
                        listStyleType="none"
                        fontSize="16px"
                        fontStyle="normal"
                        fontWeight={400}
                        lineHeight="normal"
                        color="#222">
                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 50 BLOGS per month
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 3 COURSES LEARNING
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          1 FREE ONLINE MEET WITH TEACHER
                        </ListItem>
                      </UnorderedList>
                    </Box>

                    <Box
                      padding="32px"
                      width="308px"
                      bg="#FFFFFF"
                      color="#222222"
                      borderRadius="12px 12px 80px 12px"
                      boxShadow="0px 15px 20px 0px rgba(0, 0, 0, 0.05)">
                      <Heading
                        className={segoe.className}
                        textAlign="center"
                        mb="8px"
                        fontSize="32px"
                        fontWeight="700"
                        lineHeight="42.56px"
                        color="#222">
                        Pro
                      </Heading>
                      <Text
                        textAlign="center"
                        mb="8px"
                        fontSize="16px"
                        fontWeight="400"
                        lineHeight="21.28px"
                        color="#222">
                        7 days free trial
                      </Text>

                      <UnorderedList
                        listStyleType="none"
                        margin="0"
                        display="flex"
                        justifyContent="center"
                        gap="4px"
                        alignItems="flex-end">
                        <ListItem
                          fontSize="32px"
                          fontWeight="700"
                          lineHeight="42.56px"
                          color="#222">
                          10700{' '}
                          <span
                            style={{
                              verticalAlign: 'super',
                              fontSize: '16px',
                              lineHeight: '21.28px',
                              fontWeight: '400',
                            }}>
                            AMD
                          </span>
                        </ListItem>
                        <ListItem
                          lineHeight="22px"
                          fontSize="16px"
                          fontWeight="400"
                          color="#081E4A80">
                          /per month
                        </ListItem>
                      </UnorderedList>
                      <Button width="100%" p="8px 14px" mt="16px">
                        Get started
                      </Button>
                      <UnorderedList
                        m=" 16px 0 0 0"
                        listStyleType="none"
                        fontSize="16px"
                        fontStyle="normal"
                        fontWeight={400}
                        lineHeight="normal"
                        color="#222">
                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UNLIMITED BLOGS
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UNLIMITED COURSES LEARNING
                        </ListItem>

                        <ListItem mb="16px" display="flex" alignItems="center" gap={8}>
                          <span>
                            <Image
                              width={18}
                              height={18}
                              src="/icons/pricing_icon.svg"
                              alt="Select"
                            />
                          </span>
                          UP TO 3 FREE ONLINE MEET WITH TEACHER
                        </ListItem>
                      </UnorderedList>
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box
          maxW="722px"
          margin={{
            base: '0 auto 36px',
            md: '0 auto 80px',
            xl: '0 auto 148px',
          }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb="24px"
            color="#000000"
            flexWrap="wrap">
            <UnorderedList
              listStyleType="none"
              display="flex"
              alignItems="center"
              margin={{
                base: '0',
                lg: '0 36px 0 0',
              }}>
              <ListItem marginRight="8px" width="42.5px" height="30px">
                <Image width={42.5} height={30} src="/images/pricing/Visa_pricing.png" alt="Visa" />
              </ListItem>
              <ListItem marginRight="8px" width="42.5px" height="30px">
                <Image
                  src="/images/pricing/Discover_pricing.png"
                  width={42.5}
                  height={30}
                  alt="Discover"
                />
              </ListItem>
              <ListItem marginRight="8px" width="42.5px" height="30px">
                <Image
                  src="/images/pricing/Mastercard_pricing.png"
                  width={42.5}
                  height={30}
                  alt="MasterCard"
                />
              </ListItem>
              <ListItem marginRight="8px" width="42.5px" height="30px">
                <Image
                  src="/images/pricing/PayPal_pricing.png"
                  width={42.5}
                  height={30}
                  alt="PayPal"
                />
              </ListItem>
              <ListItem fontSize="16ppx" fontWeight="400" lineHeight="22px">
                PayPal or any credit card
              </ListItem>
            </UnorderedList>

            <UnorderedList listStyleType="none" display="flex" alignItems="center" margin="0">
              <ListItem marginRight="8px" width="24px" height="24px">
                <Image src="/icons/lock_pricing.svg" width={24} height={24} alt="lock" />
              </ListItem>
              <ListItem fontSize="16px" fontWeight="400" lineHeight="22px">
                Transactions are encrypted and secured
              </ListItem>
            </UnorderedList>
          </Box>

          <Text
            textAlign="center"
            lineHeight="normal"
            fontSize="14px"
            fontWeight="400"
            color="#BABABA">
            We strive to make your payment experience convenient and secure. We accept the following
            payment methods: <br />
            -Credit/Debit Cards: We gladly accept Visa, MasterCard,Discover <br />
            -Online Payment Services: Enjoy the ease of online payments through trusted platforms
            such as PayPal
          </Text>
        </Box>

        <Box
          maxW="1200px"
          margin={{
            base: '0 auto 36px',
            md: '0 auto 80px',
            xl: '0 auto 148px',
          }}>
          <Heading
            className={segoe.className}
            mb="40px"
            lineHeight="38.4px"
            fontWeight="700"
            fontSize={{ base: '28px', md: '32px' }}
            color="#222222"
            textAlign={{ base: 'center', md: 'left' }}>
            Frequently Asked Questions
          </Heading>

          <Accordion allowMultiple display="flex" flexDirection="column" gap="16px">
            {questions.map((item, index) => (
              <AccordionItem border="none" key={item.id} id={index.toString()}>
                {({ isExpanded }) => (
                  <>
                    <Box>
                      <AccordionButton
                        alignItems="flex-start"
                        padding="0"
                        _hover={{ backgroundColor: 'transparent' }}>
                        <Box
                          flex="1"
                          textAlign="left"
                          fontWeight="700"
                          lineHeight="21.28px"
                          fontSize={{
                            base: '16px',
                            lg: '18px',
                          }}
                          color="#222222">
                          {item.question}
                        </Box>
                        {isExpanded ? <AddIcon fontSize="12px" /> : <PlusIcon fontSize="12px" />}
                      </AccordionButton>
                    </Box>
                    <AccordionPanel
                      padding="0"
                      mt="8px"
                      maxW="1020px"
                      fontSize="16px"
                      lineHeight="22px"
                      fontWeight="400"
                      color="#5B5B5B">
                      {item.answer}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Box>

      <Box bg="#1F1646" padding={{ base: '0 16px', xl: '0' }}>
        <Box
          py={{
            base: '55px',
            lg: '40px',
          }}
          maxW="794px"
          margin=" 0 auto"
          textAlign="center"
          color="#fff">
          <Heading
            mb="16px"
            lineHeight={{
              base: '36px ',
              lg: 'normal ',
            }}
            fontWeight="700"
            fontSize="28px">
            Find the right course for you
          </Heading>
          <Text mb="24px" lineHeight="22px" fontSize="16px" fontWeight="400">
            See your personalized recommendations based on your interests and goals.
          </Text>
          <Button
            size="lg"
            color="#1F1646"
            backgroundColor="#fff"
            padding="16px 32px"
            lineHeight="22px"
            fontSize="16px"
            fontWeight="400"
            _hover={{ backgroundColor: '#F3F4F6', color: '#1F1646' }}
            _focus={{
              bg: '#E9E9E9',
              color: '#1F1646',
            }}>
            Explore courses
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PricingPage;
