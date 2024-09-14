import React, { FC } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

type DescriptionModalProps = {
  selectedDescription: string | null;
  isDescriptionModalOpen: boolean;
  closeDescriptionModal: () => void;
};

const DescriptionModal: FC<DescriptionModalProps> = ({
  selectedDescription,
  isDescriptionModalOpen,
  closeDescriptionModal,
}) => {
  const t = useTranslations();

  return (
    <Modal isOpen={isDescriptionModalOpen} onClose={closeDescriptionModal} isCentered>
      <ModalOverlay />
      <ModalContent maxW="600px" minW="400px" minH="200px" p="10px 0">
        <ModalHeader>{t('description')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{selectedDescription}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DescriptionModal;
