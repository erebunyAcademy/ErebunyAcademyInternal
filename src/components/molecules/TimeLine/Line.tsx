'use client';
import { FC, memo, useMemo } from 'react';
import {
  AbsoluteCenter,
  Box,
  Center,
  Divider,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SKILL_LEVELS } from '@/utils/constants/offline_course';
import ElipseIcon from '/public/icons/ellipse.svg';
import { Maybe, SkillLevelType } from '@/utils/models/common';

type Props = {
  courseLevel: SkillLevelType;
  entryLevel: Maybe<SkillLevelType>;
};

const Line: FC<Props> = ({ courseLevel, entryLevel }) => {
  const dividerOrientation = useBreakpointValue(
    {
      base: 'vertical',
      lg: 'horizontal',
    },
    { ssr: false },
  ) as 'horizontal' | 'vertical';

  const skillLevels = useMemo(() => {
    const myLevelOrderNumber = SKILL_LEVELS.find(level => level.value === courseLevel)?.order;
    const myEntryLevelOrderNumber =
      SKILL_LEVELS.find(level => level.value === entryLevel)?.order || 1;

    if (myLevelOrderNumber) {
      return SKILL_LEVELS.sort((a, b) => a.order - b.order).filter(
        ({ order }) => order <= myLevelOrderNumber && myEntryLevelOrderNumber <= order,
      );
    }
    return [];
  }, [courseLevel, entryLevel]);

  return (
    <Center pb={10}>
      <Stack direction={{ base: 'column', lg: 'row' }} spacing={0} pr={{ base: 70, lg: 0 }}>
        {skillLevels.map(({ name }, idx, arr) => {
          const isFirstItem = idx === 0;
          const isLastItem = idx === arr.length - 1;
          const textAlign =
            arr.length === 1 ? 'center' : isFirstItem ? 'start' : isLastItem ? 'end' : 'center';
          const width = (isFirstItem || isLastItem) && arr.length > 2 ? '200px' : '300px';
          const height = 120;

          return (
            <Box
              key={name}
              display={{ base: 'flex', lg: 'block' }}
              flexDirection={{ base: 'row-reverse', lg: 'column' }}>
              <Box
                position="relative"
                w={{ base: 'auto', lg: width }}
                height={{ base: height, lg: 'auto' }}
                py={{ base: 0, lg: 3 }}
                px={{ base: 3, lg: 0 }}>
                <Divider borderColor="rgb(31, 22, 70)" orientation={dividerOrientation} />
                {!isLastItem && (
                  <>
                    <AbsoluteCenter
                      right={0}
                      left={{ base: '150%', lg: '100%' }}
                      top={{ base: `${height + 10}px`, lg: -1 }}
                      w={'fit-content'}
                      transform={'translate(-30%, -100%)'}>
                      <Text lineHeight="21.28px" fontSize="16px" fontWeight="700">
                        Exam
                      </Text>
                    </AbsoluteCenter>
                    <AbsoluteCenter
                      right={0}
                      left={{ base: '50%', lg: '100%' }}
                      top={{ base: '100%', lg: '50%' }}>
                      <ElipseIcon />
                    </AbsoluteCenter>
                  </>
                )}
              </Box>
              <Text
                as="p"
                margin={{ base: 'auto', lg: 0 }}
                lineHeight="18.75px"
                fontSize="16px"
                fontWeight="400"
                textTransform="capitalize"
                textAlign={{ base: 'unset', lg: textAlign }}>
                {name.toLowerCase()}
              </Text>
            </Box>
          );
        })}
      </Stack>
    </Center>
  );
};

export default memo(Line);
