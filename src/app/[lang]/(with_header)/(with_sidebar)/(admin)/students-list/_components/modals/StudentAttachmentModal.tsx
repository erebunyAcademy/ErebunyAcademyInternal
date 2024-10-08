'use client';
import React, { FC } from 'react';
import Image from 'next/image';
import Modal from '@/components/molecules/Modal';
import { generateAWSUrl } from '@/utils/helpers/aws';

type StudentAttachmentModalProps = {
  isAttachmentModalOpen: boolean;
  closeAttachmentModal: () => void;
  attachmentKey: string;
};

const StudentAttachmentModal: FC<StudentAttachmentModalProps> = ({
  isAttachmentModalOpen,
  closeAttachmentModal,
  attachmentKey,
}) => {
  return (
    <Modal isOpen={isAttachmentModalOpen} onClose={closeAttachmentModal} title="studentAttachment">
      <Image
        src={generateAWSUrl(attachmentKey)}
        height={800}
        width={800}
        alt="student attachment"
        style={{
          objectFit: 'cover',
        }}
      />
    </Modal>
  );
};

export default StudentAttachmentModal;
