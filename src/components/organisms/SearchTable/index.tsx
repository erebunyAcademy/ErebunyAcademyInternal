import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import ChevronLeft from '@/icons/chevron_left.svg';
import ChevronRight from '@/icons/chevron_right.svg';
import InputSearchIcon from '@/icons/search_icon.svg';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';

export type DataTableProps<T> = {
  title?: string;
  rowCondition?: string;
  count: number;
  data: T[];
  columns: ColumnDef<T, any>[];
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  setSearch: (value: string) => void;
  search: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  addNew?: () => void;
  withCheckbox?: boolean;
};

function SearchTable<T>({
  title,
  rowCondition,
  count,
  data,
  columns,
  sorting,
  setSorting,
  setSearch,
  search,
  hasNextPage,
  hasPreviousPage,
  fetchNextPage,
  fetchPreviousPage,
  addNew,
  withCheckbox,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: ITEMS_PER_PAGE,
      },
    },
  });

  const userSearchHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch],
  );

  const toggleRowSelected = (rowId: string) => {
    setSelectedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const toggleSelectAll = (isChecked: boolean) => {
    const allRowIds = getRowModel().rows.map(row => row.id);
    const newSelectedRows = allRowIds.reduce(
      (acc, rowId) => {
        acc[rowId] = isChecked;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setSelectedRows(newSelectedRows);
  };

  const isAllSelected = getRowModel().rows.every(row => selectedRows[row.id]);
  const t = useTranslations();

  return (
    <Box minHeight="700px" width="100%">
      <Flex justifyContent="space-between" p="20px 0 20px 0" width="100%">
        <Text as="h2" fontSize={24} textAlign="center">
          {title}
        </Text>
        {addNew && (
          <Button px="12px" py="8px" onClick={addNew}>
            {t('addNew')}
          </Button>
        )}
      </Flex>
      <FormControl py={4} px={4}>
        <InputGroup marginBottom="10px">
          <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
            <InputSearchIcon />
          </InputLeftElement>
          <Input
            p="10px 10px 10px 40px"
            placeholder={t('searchInput')}
            width="300px"
            onChange={userSearchHandler}
            value={search}
          />
        </InputGroup>
      </FormControl>
      <Box overflow="auto" maxWidth={{ base: '340px', sm: '670px', lg: '700px', xl: '100%' }}>
        <Table borderTop="1px solid rgb(226, 232, 240)" height="100%">
          <Thead>
            {getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {withCheckbox && (
                  <Th>
                    <Checkbox
                      isChecked={isAllSelected}
                      onChange={e => toggleSelectAll(e.target.checked)}
                    />
                  </Th>
                )}
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
            {getRowModel().rows.map(row => {
              return (
                <Tr
                  key={row.id}
                  {...(rowCondition
                    ? {
                        backgroundColor: (row.original as any)[rowCondition]
                          ? 'red.100'
                          : 'green.100',
                      }
                    : {})}>
                  {withCheckbox && (
                    <Td>
                      <Checkbox
                        isChecked={selectedRows[row.id] || false}
                        onChange={() => toggleRowSelected(row.id)}
                      />
                    </Td>
                  )}
                  {row.getVisibleCells().map(cell => {
                    const meta: any = cell.column.columnDef.meta;
                    return (
                      <Td key={cell.id} isNumeric={meta?.isNumeric}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot width="100%">
            <Tr>
              <Td align="left" colSpan={5}>
                <Text>
                  {t('count')} - {count}
                </Text>
              </Td>
              <Td align="right">
                <HStack>
                  <IconButton
                    className="border rounded p-1"
                    aria-label="chevron-left"
                    onClick={fetchPreviousPage}
                    bg="transparent"
                    icon={<ChevronLeft />}
                    isDisabled={!hasPreviousPage}>
                    {'<'}
                  </IconButton>
                  <IconButton
                    aria-label="chevron-right"
                    className="border rounded p-1"
                    bg="transparent"
                    onClick={fetchNextPage}
                    icon={<ChevronRight />}
                    isDisabled={!hasNextPage}>
                    {'>'}
                  </IconButton>
                </HStack>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    </Box>
  );
}

export default memo(SearchTable);
