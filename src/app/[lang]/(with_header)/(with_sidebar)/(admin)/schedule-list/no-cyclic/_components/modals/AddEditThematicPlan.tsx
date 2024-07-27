import React, { FC, useCallback, useMemo } from 'react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { ScheduleService } from '@/api/services/schedule.service';
import { FormInput } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { NoneCyclicScheduleSingleModel } from '@/utils/models/none-cyclic.schedule';
import { AddEditThematicPlanValidation } from '@/utils/validation/schedule';

const resolver = classValidatorResolver(AddEditThematicPlanValidation);

const thematicInitialClass = {
  totalHours: '',
  classDescriptionRow: [{ title: '', hour: '' }],
};

type AddEditThematicPlanProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedSchedule: NoneCyclicScheduleSingleModel;
};

const AddEditThematicPlan: FC<AddEditThematicPlanProps> = ({
  isModalOpen,
  closeModal,
  selectedSchedule,
}) => {
  const t = useTranslations();

  const thematicPlanisBeingCreated = useMemo(
    () => selectedSchedule && selectedSchedule?.thematicPlan?.length > 0,
    [selectedSchedule],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AddEditThematicPlanValidation>({
    resolver,
    defaultValues: {
      theoreticalClass: thematicInitialClass,
      practicalClass: thematicInitialClass,
    },
  });

  useMemo(() => {
    if (thematicPlanisBeingCreated) {
      const thereoticalThematicPlan: any =
        selectedSchedule.thematicPlan.find(thematicPlan => thematicPlan.type === 'THEORETICAL') ||
        thematicInitialClass;

      const practicalThematicPlan: any =
        selectedSchedule.thematicPlan.find(thematicPlan => thematicPlan.type === 'PRACTICAL') ||
        thematicInitialClass;

      reset({
        theoreticalClass: {
          totalHours: (thereoticalThematicPlan.totalHours || '').toString(),
          classDescriptionRow: thereoticalThematicPlan.thematicPlanDescription.map((row: any) => ({
            title: row.title,
            hour: row.hour,
          })),
        },
        practicalClass: {
          totalHours: (practicalThematicPlan.totalHours || '').toString(),
          classDescriptionRow: practicalThematicPlan.thematicPlanDescription.map((row: any) => ({
            title: row.title,
            hour: row.hour,
          })),
        },
      });
    }
  }, [reset, selectedSchedule.thematicPlan, thematicPlanisBeingCreated]);

  const {
    fields: theoreticalClassFields,
    append: appendTheoreticalClass,
    remove: removeTheoreticalClass,
  } = useFieldArray({
    control,
    name: 'theoreticalClass.classDescriptionRow',
  });

  const {
    fields: practicalClassFields,
    append: appendPracticalClass,
    remove: removePracticalClass,
  } = useFieldArray({
    control,
    name: 'practicalClass.classDescriptionRow',
  });

  const { mutate } = useMutation({
    mutationFn: (data: AddEditThematicPlanValidation) =>
      ScheduleService[
        thematicPlanisBeingCreated ? 'editThematicPlan' : 'createNoCyclicThematicPlan'
      ](selectedSchedule.id, data),
    onSuccess() {
      closeModal();
    },
  });

  const onSubmitHandler = useCallback(
    (data: AddEditThematicPlanValidation) => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      isDisabled={!isValid}
      title="schedule"
      size="4xl"
      primaryAction={handleSubmit(onSubmitHandler)}
      actionText={selectedSchedule ? 'edit' : 'create'}>
      <Box mt={5}>
        <Text fontSize="lg" fontWeight="bold" mb="10px">
          {t('theoreticalClasses')}
        </Text>

        <Flex width={{ base: '100%', sm: '33%' }}>
          <Controller
            name="theoreticalClass.totalHours"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                name={name}
                type="number"
                formLabelName={t('totalHour')}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.theoreticalClass?.totalHours?.message}
                formErrorMessage={errors.theoreticalClass?.totalHours?.message}
              />
            )}
          />
        </Flex>

        {theoreticalClassFields.map((field, index) => (
          <Flex
            mt="12px"
            key={field.id}
            gap="25px"
            alignItems="center"
            flexDirection={{ base: 'column', md: 'row' }}>
            <Controller
              name={`theoreticalClass.classDescriptionRow.${index}.title`}
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  type="text"
                  formLabelName={t('title')}
                  value={field.value}
                  placeholder="enterClassTitle"
                  handleInputChange={field.onChange}
                  isInvalid={
                    !!errors.theoreticalClass?.classDescriptionRow?.[index]?.title?.message
                  }
                  formErrorMessage={
                    errors.theoreticalClass?.classDescriptionRow?.[index]?.title?.message
                  }
                />
              )}
            />
            <Controller
              name={`theoreticalClass.classDescriptionRow.${index}.hour`}
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  type="number"
                  formLabelName={t('hours')}
                  value={field.value}
                  placeholder="enterHours"
                  handleInputChange={field.onChange}
                  isInvalid={!!errors.theoreticalClass?.classDescriptionRow?.[index]?.hour?.message}
                  formErrorMessage={
                    errors.theoreticalClass?.classDescriptionRow?.[index]?.hour?.message
                  }
                />
              )}
            />
            <IconButton
              mb="5px"
              size="md"
              aria-label="Delete row"
              colorScheme="red"
              alignSelf="flex-end"
              icon={<DeleteIcon />}
              onClick={() => removeTheoreticalClass(index)}
            />
          </Flex>
        ))}
        <Button
          mt={2}
          onClick={() => appendTheoreticalClass({ title: '', hour: '' })}
          leftIcon={<AddIcon />}>
          {t('addTheoreticalClass')}
        </Button>
      </Box>

      <Box mt={5}>
        <Text fontSize="lg" fontWeight="bold" mb="10px">
          {t('practicalClasses')}
        </Text>
        <Flex width={{ base: '100%', sm: '45%' }}>
          <Controller
            name="practicalClass.totalHours"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                name={name}
                type="number"
                formLabelName={t('totalHour')}
                value={value}
                handleInputChange={onChange}
                isInvalid={!!errors.practicalClass?.totalHours?.message}
                formErrorMessage={errors.practicalClass?.totalHours?.message}
              />
            )}
          />
        </Flex>

        {practicalClassFields.map((field, index) => (
          <Flex
            key={field.id}
            mt="12px"
            gap="25px"
            alignItems="center"
            flexDirection={{ base: 'column', md: 'row' }}>
            <Controller
              name={`practicalClass.classDescriptionRow.${index}.title`}
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  type="text"
                  formLabelName={t('title')}
                  value={field.value}
                  placeholder="enterClassTitle"
                  handleInputChange={field.onChange}
                  isInvalid={!!errors.practicalClass?.classDescriptionRow?.[index]?.title?.message}
                  formErrorMessage={
                    errors.practicalClass?.classDescriptionRow?.[index]?.title?.message
                  }
                />
              )}
            />
            <Controller
              name={`practicalClass.classDescriptionRow.${index}.hour`}
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  type="number"
                  formLabelName={t('hours')}
                  value={field.value}
                  placeholder="enterHours"
                  handleInputChange={field.onChange}
                  isInvalid={!!errors.practicalClass?.classDescriptionRow?.[index]?.hour?.message}
                  formErrorMessage={
                    errors.practicalClass?.classDescriptionRow?.[index]?.hour?.message
                  }
                />
              )}
            />
            <IconButton
              size="md"
              mb="5px"
              aria-label="Delete row"
              colorScheme="red"
              alignSelf="flex-end"
              icon={<DeleteIcon />}
              onClick={() => removePracticalClass(index)}
            />
          </Flex>
        ))}
        <Button
          mt={2}
          onClick={() => appendPracticalClass({ title: '', hour: '' })}
          leftIcon={<AddIcon />}>
          {t('addPracticalClass')}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddEditThematicPlan;
