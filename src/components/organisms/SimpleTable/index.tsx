import React from 'react';
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import NoDataFound from '@/components/molecules/NoDataFound';

type SimpleTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  title: string;
};

const SimpleTable = <T,>({ columns, data, title }: SimpleTableProps<T>): JSX.Element => {
  const t = useTranslations();
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box width="100%" maxHeight="800px">
      <Text
        as="h2"
        fontSize={{ base: '18px', sm: '24px' }}
        textAlign="center"
        fontWeight={700}
        mb="15px">
        {t(title)}
      </Text>
      <Box
        maxWidth={{ base: '340px', sm: '670px', lg: '700px', xl: '100%' }}
        height="max-content"
        overflow="auto">
        <Table
          borderTop="1px solid rgb(226, 232, 240)"
          minHeight="70px"
          minWidth="100%"
          width="max-content">
          <Thead>
            {getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const meta: any = header.column.columnDef.meta;
                  return (
                    <Th
                      textAlign="center"
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      isNumeric={meta?.isNumeric}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {getRowModel().rows.length > 0 ? (
              getRowModel().rows.map(row => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      const meta: any = cell.column.columnDef.meta;
                      return (
                        <Td key={cell.id} isNumeric={meta?.isNumeric} py="12px" textAlign="center">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })
            ) : (
              <Tr height="150px">
                <Td colSpan={columns.length} border="none" height="100%">
                  <NoDataFound />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default SimpleTable;
