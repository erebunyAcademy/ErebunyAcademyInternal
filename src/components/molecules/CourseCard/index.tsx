import React, { FC, memo } from 'react';
import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import Image from 'next/image';

type CourseCardProps = {
  src?: string;
  courseTitle: string;
  courseDescription: string;
  rating: number;
};

const CourseCard: FC<CourseCardProps> = ({
  src = '/icons/short_course_smm.svg',
  courseTitle,
  courseDescription,
  rating,
}) => {
  return (
    <Box width="387px">
      <Box>
        <Image src={src} alt={courseTitle} width={387} height={235} />
      </Box>

      <Box border="1px solid" borderTop="none" borderColor="#F3F4F6" borderRadius="12px">
        <UnorderedList padding="16px" m="0" listStyleType="none" color="#222222">
          <ListItem fontSize="24px" mb="8px" fontWeight="700" lineHeight="31.92px">
            {courseTitle}
          </ListItem>
          <ListItem fontWeight="400" fontSize="16px" mb="8px">
            {courseDescription}
          </ListItem>
          <ListItem display="flex" alignItems="center" gap="8px">
            <span>
              <Image src="/icons/star_icon.svg" alt="Star" width={24} height={24} />
            </span>
            {rating}
          </ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
};

export default memo(CourseCard);
