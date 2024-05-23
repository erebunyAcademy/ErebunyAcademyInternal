import { FC, memo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import Link from 'next/link';

interface MobileNavItemProp {
  label: string;
  children?: any[];
  href?: string;
  onClose: () => void;
}

const MobileNavItem: FC<MobileNavItemProp> = ({ label, children, href, onClose }) => {
  return (
    <AccordionItem>
      <AccordionButton>
        <Box
          flex={3}
          fontWeight={600}
          fontSize="14px"
          lineHeight="20px"
          textAlign="left"
          pl={8}
          as={href ? Link : 'span'}
          {...(href ? { href, onClick: onClose } : {})}>
          {label}
        </Box>
        {!!children?.length && (
          <Box flex={4} display="flex" justifyContent="flex-end" pr="10px">
            <AccordionIcon />
          </Box>
        )}
      </AccordionButton>
      <AccordionPanel p={0} bg="#F9FAFB">
        <Accordion allowToggle></Accordion>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default memo(MobileNavItem);
