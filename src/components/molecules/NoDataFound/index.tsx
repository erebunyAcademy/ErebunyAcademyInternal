import { Box, Text } from '@chakra-ui/react';
import { useTranslations } from 'use-intl';

const NoDataFound = () => {
  const t = useTranslations();
  return (
    <Box
      display="flex"
      height="100%"
      width="100%"
      justifyContent={{ base: 'flex-start', sm: 'center' }}
      alignItems="center">
      <Text fontSize={{ base: '24px', sm: '28px' }} m="0" fontWeight="400" as="span">
        {t('noData')}
      </Text>
    </Box>
  );
};

export default NoDataFound;
