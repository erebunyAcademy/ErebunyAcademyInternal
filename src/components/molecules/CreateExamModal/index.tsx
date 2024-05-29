import React, { FC } from 'react';
import { Avatar, Button, Flex } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Attachment, AttachmentTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CourseGroupService } from '@/api/services/course-group.service';
import { CourseService } from '@/api/services/courses.service';
import { ExamService } from '@/api/services/exam.service';
import { FacultyService } from '@/api/services/faculty.service';
import { StudentService } from '@/api/services/student.service';
import { SubjectService } from '@/api/services/subject.service';
import { SelectLabel } from '@/components/atoms';
import TableCheckbox from '@/components/organisms/TableCheckbox';
import { ROUTE_EXAMS } from '@/utils/constants/routes';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { UserStudentModel } from '@/utils/models/student';
import { CreateExamValidation } from '@/utils/validation/exam';
import Modal from '../Modal';

type CreateExamModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const resolver = classValidatorResolver(CreateExamValidation);

const CreateExamModal: FC<CreateExamModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations();
  const router = useRouter();
  const { control, watch, handleSubmit, setValue } = useForm<CreateExamValidation>({
    resolver,
    defaultValues: {
      facultyId: '',
      subjectId: '',
      courseId: '',
      courseGroupId: '',
      studentIds: [],
    },
  });

  const faculty = watch('facultyId');
  const course = watch('courseId');
  const courseGroup = watch('courseGroupId');

  const { data: facultyQueryData } = useQuery({
    queryKey: ['faculty'],
    queryFn: FacultyService.list,
  });

  const { data: courseQueryData } = useQuery({
    queryKey: ['student-grade', faculty],
    queryFn: () => CourseService.getCourseByFacultyId(faculty),
    enabled: !!faculty,
  });

  const { data: studentGradeGroupQueryData } = useQuery({
    queryKey: ['course-group', courseGroup, faculty],
    queryFn: () => CourseGroupService.getCourseGroupByCourseId(course),
    enabled: !!course,
  });

  const { data: studentsData } = useQuery({
    queryKey: ['students', courseGroup, course],
    queryFn: () => StudentService.getStudentsByCourseGroupId(courseGroup),
    enabled: !!courseGroup,
  });

  const { mutate: createExamMutation, isPending } = useMutation({
    mutationFn: ExamService.createExam,
    onSuccess(res, variables) {
      router.push(`${ROUTE_EXAMS}/create-edit/${res.id}/${variables.subjectId}`);
    },
  });

  const { data: subjectList } = useQuery({
    queryKey: ['subject-list'],
    queryFn: SubjectService.list,
  });
  const columnHelper = createColumnHelper<UserStudentModel>();

  const columns = [
    columnHelper.accessor('user.attachment', {
      id: uuidv4(),
      cell: (info: any) => {
        const existingAvatar = info
          .getValue()
          .find((attachment: Attachment) => attachment.type === AttachmentTypeEnum.AVATAR);
        return (
          <Avatar
            bg="#319795"
            color="#fff"
            name={`${info.row.original.user.firstName} ${info.row.original.user.lastName}`}
            src={generateAWSUrl(existingAvatar?.key || '')}
          />
        );
      },
      header: t('avatar'),
    }),
    columnHelper.accessor('user.firstName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('firstName'),
    }),
    columnHelper.accessor('user.lastName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('lastName'),
    }),
    columnHelper.accessor('user.email', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('email'),
    }),
  ];

  const onSubmit = (data: CreateExamValidation) => {
    createExamMutation(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="createExam" size="6xl">
      <Flex gap="30px">
        <Flex width="25%">
          <Controller
            name="facultyId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={(facultyQueryData || []) as any}
                labelName="selectFaculty"
                valueLabel="id"
                nameLabel="title"
                onChange={e => {
                  onChange(e.target.value);
                  setValue('courseId', '');
                }}
                value={value}
              />
            )}
          />
        </Flex>
        <Flex width="25%">
          <Controller
            name="courseId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={courseQueryData || []}
                labelName="selectCourse"
                valueLabel="id"
                nameLabel="title"
                onChange={e => {
                  onChange(e.target.value);
                  setValue('courseGroupId', '');
                }}
                value={value}
              />
            )}
          />
        </Flex>
        <Flex width="25%">
          <Controller
            name="courseGroupId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={studentGradeGroupQueryData || []}
                labelName="selectCourseGroup"
                valueLabel="id"
                nameLabel="title"
                onChange={e => {
                  onChange(e.target.value);
                  setValue('studentIds', []);
                }}
                value={value}
              />
            )}
          />
        </Flex>
        <Flex width="25%">
          <Controller
            name="subjectId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                options={subjectList || []}
                labelName="selectSubject"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Flex>
      </Flex>
      <Flex maxHeight="400px" height={600} overflowY="auto">
        <Controller
          name="studentIds"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TableCheckbox
              title="selectStudentsForExam"
              data={studentsData || []}
              selectedValues={value}
              onChange={onChange}
              // @ts-ignore
              columns={columns || []}
            />
          )}
        />
      </Flex>
      <Button isLoading={isPending} onClick={handleSubmit(onSubmit)}>
        {t('create')}
      </Button>
    </Modal>
  );
};

export default CreateExamModal;
