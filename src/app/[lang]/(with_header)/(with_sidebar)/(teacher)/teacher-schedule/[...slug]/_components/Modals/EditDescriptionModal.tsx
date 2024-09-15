import { FC } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { ScheduleService } from '@/api/services/schedule.service';
import FormTextarea from '@/components/atoms/FormTextarea';
import Modal from '@/components/molecules/Modal';
import { TeacherScheduleListSingleType } from '@/utils/models/teachers';
import { UpdateScheduleByTeacherValidation } from '@/utils/validation/schedule';

type EditDescriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedSchedule: TeacherScheduleListSingleType;
  refetch: () => void;
};

const EditDescriptionModal: FC<EditDescriptionModalProps> = ({
  isOpen,
  onClose,
  selectedSchedule,
  refetch,
}) => {
  const resolver = classValidatorResolver(UpdateScheduleByTeacherValidation);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateScheduleByTeacherValidation>({
    resolver,
    defaultValues: {
      description: selectedSchedule.description || '',
    },
  });

  const { mutate } = useMutation({
    mutationFn: ScheduleService.updateScheduleDescription.bind(null, selectedSchedule.id),
    onSuccess: () => {
      onClose();
      refetch();
    },
  });

  const editScheduleDescription = (data: UpdateScheduleByTeacherValidation) => {
    mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      actionText="editDescription"
      primaryAction={handleSubmit(editScheduleDescription)}>
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormTextarea
            name={name}
            value={value}
            placeholder="enterDescription"
            handleInputChange={onChange}
            isInvalid={!!errors.description?.message}
            formErrorMessage={errors.description?.message}
          />
        )}
      />
    </Modal>
  );
};

export default EditDescriptionModal;
