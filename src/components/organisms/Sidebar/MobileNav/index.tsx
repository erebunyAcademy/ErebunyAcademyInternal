import { memo } from 'react';
import { Flex, FlexProps, HStack, IconButton } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={'gray.100'}
      borderBottomWidth="1px"
      borderBottomColor={'gray.100'}
      justifyContent="flex-start"
      {...rest}>
      <HStack>
        <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />
      </HStack>
    </Flex>
  );
};

export default memo(MobileNav);
