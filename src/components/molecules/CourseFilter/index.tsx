'use client';
import React, { FC, memo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { TopicHandlerItem } from '@/utils/constants/filters';
import { segoe } from '@/utils/constants/fonts';
import CourseFilterItem from '../CourseFilterItem';

type CourseFilterProps = {
  courseTopicDataList: TopicHandlerItem[];
  courseSkillsDataList: { id: number; title: string; value: string }[];
  courseDurationsDataList: { id: number; title: string; value: number }[];
  isMobile?: boolean;
};

const CourseFilter: FC<CourseFilterProps> = ({
  courseTopicDataList = [],
  courseSkillsDataList = [],
  courseDurationsDataList = [],
  isMobile,
}) => {
  return (
    <Flex flexDirection="column" gap={32}>
      <Accordion allowMultiple>
        {courseTopicDataList.map(({ label, id, categoryList }) => (
          <AccordionItem key={id}>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {label}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {categoryList.map(({ id, title }) => (
                <CourseFilterItem
                  title={title}
                  id={id}
                  key={id}
                  value={id.toString()}
                  filterBy="title"
                  isMobile={isMobile}
                />
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Flex gap={16} flexDirection="column" m={0}>
        <Text as="span" color="#222" fontWeight={700} fontSize="16px" className={segoe.className}>
          Skill Level
        </Text>
        <Box m={0}>
          {courseSkillsDataList.map(({ id, title, value }, index) => (
            <CourseFilterItem
              title={title}
              id={id}
              key={index}
              value={value}
              filterBy="skill-level"
              isMobile={isMobile}
            />
          ))}
        </Box>
      </Flex>

      <Flex gap={16} flexDirection="column" m={0}>
        <Text as="span" color="#222" fontWeight={700} fontSize="16px" className={segoe.className}>
          Duration
        </Text>
        <Box m={0}>
          {courseDurationsDataList.map(({ id, title, value }, index) => (
            <CourseFilterItem
              id={id}
              title={title.toString()}
              key={index}
              value={value.toString()}
              filterBy="duration"
              isMobile={isMobile}
            />
          ))}
        </Box>
      </Flex>
    </Flex>
  );
};

export default memo(CourseFilter);
