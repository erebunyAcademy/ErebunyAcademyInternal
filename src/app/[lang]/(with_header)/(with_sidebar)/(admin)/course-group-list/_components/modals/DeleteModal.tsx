'use client';
import React, { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { CourseGroupService } from '@/api/services/course-group.service';
import Modal from '@/components/molecules/Modal';
import { CourseGroupSingleModel } from '@/utils/models/courseGroup';

type DeleteModalProps = {
  selectedCourseGroup: CourseGroupSingleModel | null;
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
  refetch: () => void;
};

const DeleteModal: FC<DeleteModalProps> = ({
  selectedCourseGroup,
  closeDeleteModal,
  isDeleteModalOpen,
  refetch,
}) => {
  const t = useTranslations();

  const { mutate } = useMutation({
    mutationFn: CourseGroupService.deleteCourseGroup,
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
      title="courseGroup"
      primaryAction={() => {
        if (selectedCourseGroup) {
          mutate(selectedCourseGroup?.id);
        }
      }}
      actionText="delete">
      {t('deleteCourseGroupQuestion')}
    </Modal>
  );
};

export default DeleteModal;
