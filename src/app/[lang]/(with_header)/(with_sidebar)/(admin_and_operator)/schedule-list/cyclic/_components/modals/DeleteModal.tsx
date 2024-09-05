'use client';
import React, { FC } from 'react';
import { useTranslations } from 'next-intl';
import Modal from '@/components/molecules/Modal';
import { ScheduleSingleDataModel } from '@/utils/models/schedule';

type DeleteModalProps = {
  selectedSchedule: ScheduleSingleDataModel;
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
  actionHandler: (id: string) => void;
};

const DeleteModal: FC<DeleteModalProps> = ({
  selectedSchedule,
  isDeleteModalOpen,
  closeDeleteModal,
  actionHandler,
}) => {
  const t = useTranslations();
  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      isDeleteVariant
      title="cyclicSchedule"
      primaryAction={() => {
        if (selectedSchedule) {
          actionHandler(selectedSchedule.id);
        }
      }}
      actionText="delete">
      {t('deleteCyclicScheduleQuestion')}
    </Modal>
  );
};

export default DeleteModal;
