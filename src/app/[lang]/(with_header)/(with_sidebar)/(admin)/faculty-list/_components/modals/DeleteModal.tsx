'use client';
import React, { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FacultyService } from '@/api/services/faculty.service';
import Modal from '@/components/molecules/Modal';
import { FacultyModel } from '@/utils/models/faculty';

type DeleteModalProps = {
  selectedFaculty: FacultyModel | null;
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
  refetch: () => void;
};

const DeleteModal: FC<DeleteModalProps> = ({
  selectedFaculty,
  isDeleteModalOpen,
  closeDeleteModal,
  refetch,
}) => {
  const t = useTranslations();

  const { mutate } = useMutation({
    mutationFn: FacultyService.deleteFaculty,
    onSuccess() {
      closeDeleteModal();
      refetch();
    },
  });

  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      isDeleteVariant
      title="faculty"
      primaryAction={() => {
        if (selectedFaculty) {
          mutate(selectedFaculty?.id);
        }
      }}
      actionText="delete">
      {t('deleteFacultyQuestion')}
    </Modal>
  );
};

export default DeleteModal;
