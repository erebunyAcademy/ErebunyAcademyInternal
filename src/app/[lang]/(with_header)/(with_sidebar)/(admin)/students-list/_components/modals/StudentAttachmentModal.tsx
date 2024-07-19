'use client';
import React, { FC } from 'react';
import Image from 'next/image';
import Modal from '@/components/molecules/Modal';

type StudentAttachmentModalProps = {
  isAttachmentModalOpen: boolean;
  closeAttachmentModal: () => void;
  attachmentKey: String;
};

const StudentAttachmentModal: FC<StudentAttachmentModalProps> = ({
  isAttachmentModalOpen,
  closeAttachmentModal,
  attachmentKey,
}) => {
  return (
    <Modal isOpen={isAttachmentModalOpen} onClose={closeAttachmentModal} title="studentAttachment">
      <Image
        src={`/api/readfile?path=uploads/${attachmentKey}`}
        width={400}
        height={400}
        alt="student attachment"
      />
    </Modal>
  );
};

export default StudentAttachmentModal;
