'use client';
import React, { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { SubjectService } from '@/api/services/subject.service';
import Modal from '@/components/molecules/Modal';
import { SubjectModel } from '@/utils/models/subject';

type DeleteModalProps = {
  closeDeleteModal: () => void;
  refetch: () => void;
  isDeleteModalOpen: boolean;
  selectedSubject: SubjectModel | null;
};

const DeleteModal: FC<DeleteModalProps> = ({
  closeDeleteModal,
  refetch,
  isDeleteModalOpen,
  selectedSubject,
}) => {
  const t = useTranslations();

  const { mutate } = useMutation({
    mutationFn: SubjectService.deleteSubject,
    onSuccess() {
      closeDeleteModal();
      refetch();
    },
  });

  return (
    <Modal
      isOpen={isDeleteModalOpen}
      isDeleteVariant
      onClose={closeDeleteModal}
      title={'subject'}
      primaryAction={() => {
        if (selectedSubject) {
          mutate(selectedSubject?.id);
        }
      }}
      actionText={'delete'}>
      {t('deleteSubjectQuestion')}
    </Modal>
  );
};

export default DeleteModal;
