import React, { useMemo } from 'react';
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

type GroupedTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  title: string;
};

const GroupedTable = <T,>({ columns, data, title }: GroupedTableProps<T>): JSX.Element => {
  const t = useTranslations();
  const { getHeaderGroups } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Grouping data by day and period
  const groupedData = useMemo(() => {
    const grouped: { [key: string]: T[] } = {};
    data.forEach(item => {
      const key = `${(item as any).day}-${(item as any).period}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    return grouped;
  }, [data]);

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
        height="400px"
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
            {Object.entries(groupedData).length > 0 ? (
              Object.entries(groupedData).map(([key, items]) => (
                <React.Fragment key={key}>
                  <Tr>
                    <Td colSpan={columns.length} bg="gray.100">
                      {`Day: ${(items[0] as any).day}, Period: ${(items[0] as any).period}`}
                    </Td>
                  </Tr>
                  {items.map((item: any, index) => (
                    <Tr key={index}>
                      {columns.map((column: any) => (
                        <Td key={column.id}>{flexRender(column.cell, { row: item, column })}</Td>
                      ))}
                    </Tr>
                  ))}
                </React.Fragment>
              ))
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

export default GroupedTable;
