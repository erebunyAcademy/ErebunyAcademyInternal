'use client';
import React, { memo, useCallback, useState } from 'react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Checkbox,
  Flex,
  FormControl,
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
  useReactTable,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import NoDataFound from '@/components/molecules/NoDataFound';
import ChevronLeft from '@/icons/chevron_left.svg';
import ChevronRight from '@/icons/chevron_right.svg';
import InputSearchIcon from '@/icons/search_icon.svg';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { Maybe } from '@/utils/models/common';

export type DataTableProps<T> = {
  title?: string;
  rowCondition?: string;
  count: number;
  data: T[];
  columns: ColumnDef<T, any>[];
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
  setSearch,
  search,
  hasNextPage,
  hasPreviousPage,
  fetchNextPage,
  fetchPreviousPage,
  addNew,
  withCheckbox,
}: DataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const searchParams: Maybe<ReadonlyURLSearchParams> = useSearchParams();

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: ITEMS_PER_PAGE,
      },
    },
  });

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams?.toString());
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams],
  // );

  const sortingHandler = useCallback(
    (val: any) => {
      const params = new URLSearchParams(searchParams?.toString());
      params;
      const sortBy = val.column.columnDef.header
        .split(' ')
        .reduce(
          (acc: string, cur: string, i: number) =>
            (acc += i === 0 ? cur.toLowerCase() : cur[0].toUpperCase() + cur.slice(1)),
          '',
        );

      const orderBy = searchParams?.has(sortBy);
      console.log({ orderBy });

      router.push(`${pathname}?sorting=${sortBy}&orderBy=${orderBy ? 'asc' : 'desc'}`);
    },
    [pathname, router, searchParams],
  );

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

  const t = useTranslations();

  return (
    <Box minHeight="700px" width="100%">
      <Flex justifyContent="space-between" p="20px 0 20px 0" width="100%">
        <Text as="h2" fontSize={24} textAlign="center">
          {t(title)}
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
                      onClick={() => sortingHandler(header)}
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
                  <Tr
                    key={row.id}
                    {...(rowCondition
                      ? {
                          backgroundColor: (row.original as any)[rowCondition]
                            ? 'green.50'
                            : 'red.50',
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
                        <Td key={cell.id} isNumeric={meta?.isNumeric} height="65px">
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

          <Tfoot width="100%" borderBottom="1px solid #DEDEDE">
            <Tr>
              <Td colSpan={1} border="none">
                <Text>
                  {t('count')} - {count}
                </Text>
              </Td>
              <Td border="none" colSpan={getHeaderGroups()[0].headers.length} textAlign="right">
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
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    </Box>
  );
}

export default memo(SearchTable);
