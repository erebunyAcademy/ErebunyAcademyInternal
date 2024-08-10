'use client';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { UserService } from '@/api/services/user.service';
import FormTextarea from '@/components/atoms/FormTextarea';
import Modal from '@/components/molecules/Modal';
import { TeacherModelSingle } from '@/utils/models/teachers';

type RejectMessageModalProps = {
  closeTeacherRejectModal: () => void;
  isRejectTeacherModalOpen: boolean;
  selectedTeacher: TeacherModelSingle | null;
  refetch: () => void;
};

const RejectMessageModal: FC<RejectMessageModalProps> = ({
  closeTeacherRejectModal,
  isRejectTeacherModalOpen,
  selectedTeacher,
  refetch,
}) => {
  const t = useTranslations();
  const [rejectionText, setRejectionText] = useState('');

  const { mutate: rejectUser, isPending } = useMutation({
    mutationFn: UserService.rejectUserEmail,
    onSuccess() {
      closeTeacherRejectModal();
      refetch();
    },
  });

  const valueChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setRejectionText(e.target.value);
  }, []);

  return (
    <Modal
      isOpen={isRejectTeacherModalOpen}
      onClose={closeTeacherRejectModal}
      title="rejectionMessage">
      <FormTextarea
        handleInputChange={valueChangeHandler}
        value={rejectionText}
        name="reject-message"
      />
      <Button
        isLoading={isPending}
        onClick={() => {
          if (selectedTeacher) {
            rejectUser({ userId: selectedTeacher.id, message: rejectionText });
          }
        }}>
        {t('send')}
      </Button>
    </Modal>
  );
};

export default RejectMessageModal;
