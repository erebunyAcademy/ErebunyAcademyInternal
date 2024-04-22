import React, { FC, useEffect } from 'react';
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Controller, useForm } from 'react-hook-form';
import { Button, FormInput, PhoneNumberInput } from '@/components/atoms';
import FormTextarea from '@/components/atoms/FormTextarea';
import { RequestAnotherTimeValidation } from '@/utils/validation/offline-course';

type RequestAnotherTimeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  timeSubmitHandler: (data: RequestAnotherTimeValidation) => void;
  selectedStartTime: string;
  resetSelectedStartTime: () => void;
};

const resolver = classValidatorResolver(RequestAnotherTimeValidation);

const RequestAnotherTimeModal: FC<RequestAnotherTimeModalProps> = ({
  isOpen,
  onClose,
  timeSubmitHandler,
  selectedStartTime,
  resetSelectedStartTime,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<RequestAnotherTimeValidation>({
    resolver,
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      startTime: selectedStartTime || '',
      notes: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      onClose();
      reset();
    }
  }, [isOpen, onClose, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
        resetSelectedStartTime();
      }}
      size="2xl"
      isCentered>
      <ModalOverlay />
      <ModalContent py="20px">
        <ModalHeader>Request Another Time</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" gap="20px" flexDirection="column">
          <Flex
            gap="20px"
            flexDirection={{
              base: 'column',
              sm: 'row',
            }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value } }) => (
                <FormInput
                  isRequired
                  isInvalid={!!errors.name?.message}
                  name="firstName"
                  formLabelName="Full Name"
                  value={value}
                  handleInputChange={onChange}
                  formErrorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { onChange, value } }) => (
                <FormInput
                  isRequired
                  isInvalid={!!errors.email?.message}
                  name="lastName"
                  type="email"
                  formLabelName="Email"
                  value={value}
                  placeholder="you@example.com"
                  handleInputChange={onChange}
                  formErrorMessage={errors.email?.message}
                />
              )}
            />
          </Flex>
          <Flex
            width={{
              base: '100%',
              lg: 'calc(50% - 10px)',
            }}>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field: { onChange, value } }) => (
                <PhoneNumberInput
                  onChange={onChange}
                  value={value}
                  isRequired
                  formLabelName="Phone Number"
                />
              )}
            />
          </Flex>
          {!selectedStartTime && (
            <Flex
              gap="20px"
              flexDirection={{
                base: 'column',
                sm: 'row',
              }}>
              <Controller
                name="startTime"
                control={control}
                rules={{
                  required: 'This field is required',
                }}
                render={({ field: { onChange, value } }) => (
                  <FormInput
                    isRequired
                    isInvalid={!!errors.startTime?.message}
                    name="lastName"
                    type="time"
                    step="60"
                    formLabelName="Start time"
                    value={value}
                    handleInputChange={onChange}
                    formErrorMessage={errors.startTime?.message}
                  />
                )}
              />
              <Controller
                name="endTime"
                control={control}
                rules={{
                  required: 'This field is required',
                }}
                render={({ field: { onChange, value, name } }) => (
                  <FormInput
                    isRequired
                    isInvalid={!!errors.endTime?.message}
                    name={name}
                    type="time"
                    step="60"
                    formLabelName="End time"
                    value={value}
                    handleInputChange={onChange}
                    formErrorMessage={errors.endTime?.message}
                  />
                )}
              />
            </Flex>
          )}

          <Flex>
            <Controller
              name="notes"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field: { onChange, value, name } }) => (
                <FormTextarea
                  isRequired
                  name={name}
                  formLabelName="Notes"
                  placeholder="Type here..."
                  value={value}
                  handleInputChange={onChange}
                  isInvalid={!!errors[name]?.message}
                  formErrorMessage={errors[name]?.message}
                />
              )}
            />
          </Flex>
        </ModalBody>

        <ModalFooter display="flex" justifyContent="flex-start">
          <Button onClick={handleSubmit(timeSubmitHandler)} isDisabled={!isValid}>
            Enroll now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RequestAnotherTimeModal;
