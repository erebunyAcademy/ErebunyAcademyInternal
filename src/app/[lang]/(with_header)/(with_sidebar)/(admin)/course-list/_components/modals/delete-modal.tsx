'use client';
import React, { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { CourseService } from '@/api/services/courses.service';
import Modal from '@/components/molecules/Modal';
import { CourseModel } from '@/utils/models/course';

type DeleteModalProps = {
  selectedCourse: CourseModel | null | undefined;
  refetch: () => void;
  closeDeleteModal: () => void;
  isDeleteModalOpen: boolean;
};

const DeleteModal: FC<DeleteModalProps> = ({
  selectedCourse,
  refetch,
  closeDeleteModal,
  isDeleteModalOpen,
}) => {
  const t = useTranslations();

  const { mutate } = useMutation({
    mutationFn: CourseService.deleteCourse,
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
      title="course"
      primaryAction={() => {
        if (selectedCourse) {
          mutate(selectedCourse?.id);
        }
      }}
      actionText="delete">
      {t('deleteCourseQuestion')}
    </Modal>
  );
};

export default DeleteModal;
