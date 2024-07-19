'use client';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { UserService } from '@/api/services/user.service';
import FormTextarea from '@/components/atoms/FormTextarea';
import Modal from '@/components/molecules/Modal';
import { StudentModel } from '@/utils/models/student';

type RejectMessageModalProps = {
  closeStudentRejectModal: () => void;
  isRejectStudentModalIsOpen: boolean;
  selectedStudent: StudentModel | null;
};

const RejectMessageModal: FC<RejectMessageModalProps> = ({
  closeStudentRejectModal,
  isRejectStudentModalIsOpen,
  selectedStudent,
}) => {
  const t = useTranslations();
  const [rejectionText, setRejectionText] = useState('');

  const { mutate: rejectUser, isPending } = useMutation({
    mutationFn: UserService.rejectUserEmail,
    onSuccess() {
      closeStudentRejectModal();
    },
  });

  const valueChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setRejectionText(e.target.value);
  }, []);

  return (
    <Modal
      isOpen={isRejectStudentModalIsOpen}
      onClose={closeStudentRejectModal}
      title="rejectionMessage">
      <FormTextarea
        handleInputChange={valueChangeHandler}
        value={rejectionText}
        name="reject-message"
      />
      <Button
        isLoading={isPending}
        onClick={() => {
          if (selectedStudent) {
            rejectUser({ userId: selectedStudent.id, message: rejectionText });
          }
        }}>
        {t('send')}
      </Button>
    </Modal>
  );
};

export default RejectMessageModal;
