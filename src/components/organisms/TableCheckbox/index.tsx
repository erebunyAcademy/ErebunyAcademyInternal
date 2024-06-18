import React, { memo, useEffect, useState } from 'react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  chakra,
  Checkbox,
  Flex,
  FormErrorMessage,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'use-intl';
import NoDataFound from '@/components/molecules/NoDataFound';

export type DataTableProps<T> = {
  isRequired?: boolean;
  isInvalid?: boolean;
  formErrorMessage?: string;
  title?: string;
  rowCondition?: string;
  data: T[];
  columns: ColumnDef<T, any>[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  deleteHandler?: () => void;
};

function TableCheckbox<T extends { id: string }>({
  isRequired,
  isInvalid,
  formErrorMessage,
  title,
  rowCondition,
  data,
  columns,
  onChange,
  deleteHandler,
  selectedValues,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const t = useTranslations();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  useEffect(() => {
    const selectedVals = selectedValues.reduce(
      (acc, rowId) => {
        acc[rowId] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setSelectedRows(selectedVals);
  }, [selectedValues]);

  const updateSelectedRowIds = (newSelectedRows: Record<string, boolean>) => {
    const selectedRowIds = getRowModel()
      .rows.filter(row => newSelectedRows[row.original.id])
      .map(row => row.original.id);
    onChange(selectedRowIds);
  };

  const toggleRowSelected = (rowId: string) => {
    setSelectedRows(prev => {
      const newSelectedRows = {
        ...prev,
        [rowId]: !prev[rowId],
      };
      updateSelectedRowIds(newSelectedRows);
      return newSelectedRows;
    });
  };

  const toggleSelectAll = (isChecked: boolean) => {
    const allRowIds = getRowModel().rows.map(row => row.original.id);
    const newSelectedRows = allRowIds.reduce(
      (acc, rowId) => {
        acc[rowId] = isChecked;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setSelectedRows(newSelectedRows);
    updateSelectedRowIds(newSelectedRows);
  };

  const isAllSelected = getRowModel().rows.every(row => selectedRows[row.original.id]);

  return (
    <Box width="100%" mt={{ base: '25px', md: '50px' }} mb={{ base: '25px', md: '20px' }}>
      <Flex justifyContent="space-between" p="20px 0" width="100%">
        <Text as="h2" fontSize={24} textAlign="center">
          {t(title)}
          {isRequired && (
            <Text as="span" color="#222">
              *
            </Text>
          )}
        </Text>
        {isInvalid && (
          <FormErrorMessage color="#DF1414" fontWeight={400} mt={4}>
            {t(formErrorMessage)}
          </FormErrorMessage>
        )}
        {deleteHandler && (
          <IconButton
            aria-label="Delete"
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={deleteHandler}
          />
        )}
      </Flex>

      <Box maxWidth={{ base: '340px', sm: '670px', lg: '700px', xl: '100%' }}>
        <Table
          borderTop="1px solid rgb(226, 232, 240)"
          maxHeight="800px"
          overflow="auto"
          width="100%">
          <Thead>
            {getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                <Th>
                  <Checkbox
                    isChecked={isAllSelected}
                    onChange={e => toggleSelectAll(e.target.checked)}
                  />
                </Th>
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
              getRowModel().rows.map(row => (
                <Tr
                  key={row.original.id}
                  maxHeight="200px"
                  {...(rowCondition
                    ? {
                        backgroundColor: (row.original as any)[rowCondition]
                          ? 'red.100'
                          : 'green.100',
                      }
                    : {})}>
                  <Td>
                    <Checkbox
                      isChecked={selectedRows[row.original.id] || false}
                      onChange={() => toggleRowSelected(row.original.id)}
                    />
                  </Td>
                  {row.getVisibleCells().map(cell => {
                    const meta: any = cell.column.columnDef.meta;
                    return (
                      <Td key={cell.id} isNumeric={meta?.isNumeric}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  })}
                </Tr>
              ))
            ) : (
              <Tr height="150px" width="100%">
                <Td colSpan={columns.length + 1} border="none" height="100%" width="100%">
                  <NoDataFound />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default memo(TableCheckbox);
