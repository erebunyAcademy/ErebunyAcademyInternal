'use client';
import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Input, Stack, Text } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { UploadService } from '@/api/services/upload.service';
import { FormInput } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { Maybe } from '@/utils/models/common';
import { ScheduleSingleModel } from '@/utils/models/schedule';
import { AttachmentValidation } from '@/utils/validation';
import { TeacherAttachmentModalValidation } from '@/utils/validation/schedule';

type CreateEditAttachmentProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedSchedule: ScheduleSingleModel;
  refetch: () => void;
};

const resolver = classValidatorResolver(TeacherAttachmentModalValidation);

type FileWithLocalUrl = {
  file: File;
  localUrl: string;
};

const CreateEditAttachment: FC<CreateEditAttachmentProps> = ({
  isModalOpen,
  closeModal,
  selectedSchedule,
}) => {
  const t = useTranslations();
  const [files, setFiles] = useState<Maybe<FileWithLocalUrl[]>>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TeacherAttachmentModalValidation>({
    resolver,
    defaultValues: {
      attachments: [],
      links: [],
    },
  });

  useMemo(() => {
    if (selectedSchedule) {
      const attachmentWithUrls = selectedSchedule.attachment.map(attachment => ({
        key: attachment.key,
        mimetype: attachment.mimetype,
        title: attachment.title || '',
        localUrl: attachment.key, // Assuming your files are served from the `/uploads` directory
      }));

      setFiles(
        attachmentWithUrls.map(att => ({
          file: new File([], att.title),
          localUrl: att.localUrl,
        })),
      );

      reset({
        attachments: selectedSchedule.attachment.map(attachment => ({
          key: attachment.key,
          mimetype: attachment.mimetype,
          title: attachment.title || '',
        })),
        links: (Array.isArray(selectedSchedule.links) ? selectedSchedule.links : ([] as any)).map(
          (link: string) => ({ link }),
        ),
      });
    }
  }, [reset, selectedSchedule]);

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: 'links',
  });

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles?.length) {
      const fileArray = Array.from(selectedFiles).map(file => {
        const localUrl = URL.createObjectURL(file);
        return { file, localUrl };
      });
      setFiles(prevState => {
        if (prevState?.length) {
          return [...prevState, ...fileArray];
        }
        return fileArray;
      });
    }
  };

  const { mutate: uploadAttachment } = useMutation({
    mutationFn: (data: { file: FormData; key: string }) => UploadService.uploadFile(data),
  });

  const onSubmitHandler = useCallback(
    (data: TeacherAttachmentModalValidation) => {
      const attachmentKeys: AttachmentValidation[] = [];

      files?.forEach(({ file }) => {
        if (!file) {
          return;
        }

        const attachmentId = uuidv4();
        const key = `attachments/${attachmentId}/subjects/${selectedSchedule.subjectId}/${Date.now()}_${file.name}`;

        const formData = new FormData();
        formData.append('file', file);

        attachmentKeys.push({
          title: file.name,
          key,
          mimetype: file.type,
          attachmentKey: '',
        });

        uploadAttachment({
          file: formData,
          key,
        });
      });

      if (
        selectedSchedule?.attachment &&
        selectedSchedule?.attachment.length > 0 &&
        files?.length === 0
      ) {
        data.attachments = [];
      } else if ((files || [])?.length > 0) {
        data.attachments = attachmentKeys;
      }
    },
    [files, selectedSchedule, uploadAttachment],
  );

  const removeFile = (localUrl: string) => {
    setFiles(prevFiles => prevFiles?.filter(file => file.localUrl !== localUrl) || null);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      isDisabled={!isValid}
      title="cyclicSchedule"
      size="6xl"
      primaryAction={handleSubmit(onSubmitHandler)}
      actionText={selectedSchedule ? 'edit' : 'create'}>
      <Flex gap={5} justifyContent="space-between" flexDirection={{ base: 'column', md: 'row' }}>
        <Box mt={5}>
          <Text fontSize="lg" fontWeight="bold" mb="10px">
            {t('links')}
          </Text>
          {linkFields.map((field, index) => (
            <Flex key={field.id} gap={5} alignItems="center">
              <Controller
                name={`links.${index}.link`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    name={field.name}
                    type="url"
                    formLabelName={t('link')}
                    value={field.value}
                    placeholder="enterLink"
                    handleInputChange={field.onChange}
                    isInvalid={!!errors.links?.[index]?.message}
                    formErrorMessage={errors.links?.[index]?.message}
                  />
                )}
              />
              <IconButton
                mt="20px"
                size="md"
                colorScheme="red"
                aria-label="Delete link"
                icon={<DeleteIcon />}
                onClick={() => removeLink(index)}
              />
            </Flex>
          ))}
          <Button mt={2} onClick={() => appendLink({ link: '' })} leftIcon={<AddIcon />}>
            {t('addLink')}
          </Button>
        </Box>

        <Flex flexDirection="column" gap={5} alignItems={{ base: 'flex-start', md: 'flex-end' }}>
          <Box mt={3}>
            {files && (
              <Stack spacing={3}>
                {files.map((fileObj, index) => (
                  <Flex key={index} alignItems="center" justifyContent="space-between">
                    <Text as="a" href={fileObj.localUrl} download={fileObj.file.name}>
                      {fileObj.file.name}
                    </Text>
                    <IconButton
                      size="md"
                      colorScheme="red"
                      aria-label="Delete file"
                      icon={<DeleteIcon />}
                      onClick={() => removeFile(fileObj.localUrl)}
                      ml={2}
                    />
                  </Flex>
                ))}
              </Stack>
            )}
          </Box>
          <Box
            cursor="pointer"
            position="relative"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            height="22px"
            ml="5px">
            <Button
              fontWeight={500}
              height="100%"
              width="auto"
              cursor="pointer"
              color="#1F1646"
              backgroundColor="#fff"
              _hover={{
                color: '#1F1646',
                backgroundColor: '#fff',
              }}
              _focus={{
                color: '#1F1646',
                backgroundColor: '#fff',
              }}>
              <Input
                as="input"
                name="attachments"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                width="100%"
                multiple
                position="absolute"
                left={0}
                right={0}
                bottom={0}
                opacity={0}
                cursor="pointer"
                onChange={onFileSelect}
                value={files ? '' : undefined}
                color="#1F1646"
                backgroundColor="#fff"
                _hover={{
                  color: '#1F1646',
                  backgroundColor: '#fff',
                }}
                _focus={{
                  color: '#1F1646',
                  backgroundColor: '#fff',
                }}
              />
              {t('uploadDocument')}
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default CreateEditAttachment;
