import React, { Dispatch, memo, SetStateAction, useCallback } from 'react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
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
import ChevronLeft from '@/icons/chevron_left.svg';
import ChevronRight from '@/icons/chevron_right.svg';
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
  isLoading: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  addNew?: () => void;
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
}: DataTableProps<T>) {
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

  return (
    <Box minHeight="700px">
      <Flex justifyContent="space-between" p="20px 0 20px 0">
        <Text as="h2" fontSize={24} textAlign="center">
          {title}
        </Text>
        {addNew && (
          <Button
            bg="#f5f6f7"
            color="#222"
            _hover={{
              bg: '#ebedf0',
              color: '#222',
              boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
            }}
            _active={{
              bg: '#f5f6f7',
              color: '#222',
            }}
            _focus={{
              bg: '#f5f6f7',
              color: '#222',
            }}
            onClick={addNew}>
            Add New
          </Button>
        )}
      </Flex>
      <FormControl py={4} px={4}>
        <Input
          placeholder="Type here to search"
          width="200px"
          onChange={userSearchHandler}
          value={search}
        />
      </FormControl>
      <Box overflow="auto" maxWidth={{ base: '340px', sm: '670px', lg: '700px', xl: '100%' }}>
        <Table borderTop="1px solid rgb(226, 232, 240)" height="100%">
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
          <Tfoot>
            <Tr>
              <Td align="left" colSpan={5}>
                <Text>Count - {count}</Text>
              </Td>
              <Td>
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
