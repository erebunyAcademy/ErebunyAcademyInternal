'use client';
import React, { FC, useLayoutEffect, useState } from 'react';
import {
  Box,
  Select,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { periodListData } from '@/utils/constants/common';
import { CyclicAcademicRegisterById } from '@/utils/models/academic-register';
import { UserStudentModel } from '@/utils/models/student';

type AcademicRegisterProps = {
  students: UserStudentModel;
  academicRegister: CyclicAcademicRegisterById;
};

const AcademicRegister: FC<AcademicRegisterProps> = ({ students, academicRegister }) => {
  const [value, setValue] = useState('');

  console.log({ academicRegister });

  const {
    isOpen: chooseLessonModalOpen,
    onClose: closeChooseLessonModal,
    onOpen,
  } = useDisclosure();

  useLayoutEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Student</Th>
            {periodListData.map(period => (
              <Th key={period.id}>{period.title}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {students.map(student => (
            <Tr key={student.id} height="32px">
              <Td>
                {student.user.firstName} {student.user.lastName}
              </Td>
              {periodListData.map(period => (
                <Td key={period.id} border="1px solid #eee" width="60px">
                  <Select
                    width={100}
                    disabled={value !== period.id}
                    isDisabled={value !== period.id}
                  />
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot></Tfoot>
      </Table>

      <Modal
        isOpen={chooseLessonModalOpen}
        onClose={closeChooseLessonModal}
        isDisabled={!value}
        title="schedule"
        size="4xl">
        <SelectLabel
          isRequired
          options={periodListData}
          labelName="examType"
          valueLabel="id"
          nameLabel="title"
          onChange={e => {
            setValue(e.target.value);
            closeChooseLessonModal();
          }}
          value={value}
        />
      </Modal>
    </Box>
  );
};

export default AcademicRegister;
