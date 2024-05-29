import { Box, Text } from '@chakra-ui/react';
import { useTranslations } from 'use-intl';

const NoDataFound = () => {
  const t = useTranslations();
  return (
    <Box display="flex" my="30px" flexDir="column" width="100%">
      <Text fontSize="24px" m="0" fontWeight="400" as="span">
        {t('noDataFound')}
      </Text>
    </Box>
  );
};

export default NoDataFound;
