import React, { FC } from 'react';
import { Box, Select, Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { periodListData } from '@/utils/constants/common';
import { UserStudentModel } from '@/utils/models/student';

type AcademicRegisterProps = {
  students: UserStudentModel;
};

const AcademicRegister: FC<AcademicRegisterProps> = ({ students }) => {
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
                  <Select width={100} />
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot></Tfoot>
      </Table>
    </Box>
  );
};

export default AcademicRegister;
