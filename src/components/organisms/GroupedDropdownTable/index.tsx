import React from 'react';
import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import ExpandableRow from './_components/ExpandableRow';

export function ExpandableTable<T>({
  data,
  parentColumns,
  subRowColumns,
  getSubRows,
}: {
  data: T[];
  parentColumns: ColumnDef<T>[];
  subRowColumns: ColumnDef<T>[];
  getSubRows: (row: T) => T[] | undefined;
}) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns: parentColumns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="p-2">
      <Table>
        <Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                  )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => (
            <ExpandableRow
              key={row.id}
              row={row}
              parentColumns={parentColumns}
              subRowColumns={subRowColumns} // Pass subRow columns
            />
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
