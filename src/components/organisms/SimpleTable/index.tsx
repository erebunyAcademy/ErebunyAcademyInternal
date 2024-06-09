import React from 'react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Box, chakra, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
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
    <Box minHeight="700px" width="100%">
      <Text as="h2" fontSize={24} textAlign="center">
        {t(title)}
      </Text>

      <Table
        borderTop="1px solid rgb(226, 232, 240)"
        height="100%"
        minWidth="100%"
        width="max-content">
        <Thead>
          {getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const meta: any = header.column.columnDef.meta;
                return (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <chakra.span pl="4">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
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
                <Tr key={row.id} height="20px">
                  {row.getVisibleCells().map(cell => {
                    const meta: any = cell.column.columnDef.meta;
                    return (
                      <Td key={cell.id} isNumeric={meta?.isNumeric} height="20px">
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
  );
};

export default SimpleTable;
