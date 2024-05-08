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
  isCreateModal: boolean;
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  title,
  children,
  primaryAction,
  isCreateModal,
}) => {
  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      size="2xl"
      isCentered>
      <ModalOverlay />
      <ModalContent py="20px">
        <ModalHeader>
          {isCreateModal ? 'Create' : 'Update'} {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" gap="20px" flexDirection="column">
          {children}
        </ModalBody>
        <ModalFooter display="flex" justifyContent="flex-start">
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <CustomButton onClick={primaryAction}>{isCreateModal ? 'Create' : 'Update'}</CustomButton>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
