import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, FormLabel, Text } from '@chakra-ui/react';
import Checkbox from '@/components/atoms/Checkbox';
import { useCourseFilter } from '@/contexts/CourseFilterContext';

type CourseFilterItemProps = {
  id: number;
  title: string;
  value: string;
  filterBy: 'duration' | 'title' | 'skill-level';
  isMobile?: boolean;
};

const CourseFilterItem: FC<CourseFilterItemProps> = ({ id, title, filterBy, value, isMobile }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { setCourseNameHandler, removeCourseNameHandler, setFilteredCourseHandler, courseNames } =
    useCourseFilter();

  const onChangeHandler = useCallback(() => {
    const updatedValue = !isChecked;
    setIsChecked(updatedValue);

    if (updatedValue) {
      if (isMobile) {
        setFilteredCourseHandler({
          id,
          name: title,
          filterBy,
          value,
        });
      } else {
        setCourseNameHandler({
          id,
          name: title,
          filterBy,
          value,
        });
      }
    } else {
      removeCourseNameHandler(id);
    }
  }, [
    filterBy,
    id,
    isChecked,
    isMobile,
    removeCourseNameHandler,
    setCourseNameHandler,
    setFilteredCourseHandler,
    title,
    value,
  ]);

  useEffect(() => {
    if (courseNames.length === 0) {
      setIsChecked(false);
    } else {
      setIsChecked(
        !!courseNames.find(
          course => course.id === id && course.filterBy === filterBy && course.value === value,
        ),
      );
    }
  }, [courseNames, filterBy, id, value]);

  return (
    <Box py={4} _hover={{ bg: '#0000000' }}>
      <Text display="flex" gap="12px">
        <Checkbox onChange={onChangeHandler} isChecked={isChecked} checked={isChecked} id={title} />
        <FormLabel htmlFor={title} cursor="pointer" margin={0}>
          {title}
        </FormLabel>
      </Text>
    </Box>
  );
};

export default CourseFilterItem;
