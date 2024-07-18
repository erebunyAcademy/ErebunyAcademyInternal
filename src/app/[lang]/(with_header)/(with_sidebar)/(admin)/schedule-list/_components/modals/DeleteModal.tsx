'use client';
import React, { FC } from 'react';
import { useTranslations } from 'next-intl';
import Modal from '@/components/molecules/Modal';
import { Maybe } from '@/utils/models/common';
import { ScheduleSingleModel } from '@/utils/models/schedule';

type DeleteModalProps = {
  selectedSchedule: Maybe<ScheduleSingleModel>;
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
};

const DeleteModal: FC<DeleteModalProps> = ({
  selectedSchedule,
  isDeleteModalOpen,
  closeDeleteModal,
}) => {
  const t = useTranslations();
  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      isDeleteVariant
      title="schedule"
      primaryAction={() => {
        if (selectedSchedule) {
          // mutate(selectedFaculty?.id);
        }
      }}
      actionText="delete">
      {t('deleteScheduleQuestion')}
    </Modal>
  );
};

export default DeleteModal;
