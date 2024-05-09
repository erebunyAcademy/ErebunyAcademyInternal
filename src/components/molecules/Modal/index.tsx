import React, { FC, PropsWithChildren } from 'react';
import {
  Button,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import CustomButton from '@/components/atoms/Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  primaryAction: () => void;
  actionText: 'Create' | 'Update' | 'Delete';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  title,
  children,
  primaryAction,
  size = '2xl',
  actionText,
}) => {
  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      size={size}
      isCentered>
      <ModalOverlay />
      <ModalContent py="20px">
        <ModalHeader>
          {actionText} {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" gap="20px" flexDirection="column">
          {children}
        </ModalBody>
        <ModalFooter display="flex" justifyContent="flex-start">
          <Button
            bg="#ccc"
            color="#222"
            _hover={{
              bg: '#BABABA',
              color: '#222',
            }}
            _active={{
              bg: '#BABABA',
              color: '#222',
            }}
            _focus={{
              bg: '#BABABA',
              color: '#222',
            }}
            mr={3}
            onClick={onClose}>
            Close
          </Button>
          <CustomButton
            onClick={primaryAction}
            bg={actionText === 'Delete' ? '#E53E3E' : 'green'}
            bgHover={actionText === 'Delete' ? '#C53030' : '#179848'}>
            {actionText}
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
