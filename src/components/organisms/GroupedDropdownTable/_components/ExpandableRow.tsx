import { Td, Tr } from '@chakra-ui/react';
import { ColumnDef, flexRender } from '@tanstack/react-table';

function ExpandableRow<T>({
  row,
  parentColumns,
  subRowColumns,
}: {
  row: any;
  parentColumns: ColumnDef<T>[];
  subRowColumns: ColumnDef<T>[];
}) {
  const isSubRow = row.depth > 0;

  const columnsToUse = isSubRow ? subRowColumns : parentColumns;

  return (
    <>
      <Tr>
        {row.getVisibleCells().map((cell: any) => (
          <Td key={cell.id}>
            <div
              style={{
                paddingLeft: `${row.depth * 2}rem`,
              }}>
              {row.getCanExpand() ? (
                <button onClick={row.getToggleExpandedHandler()}>
                  {row.getIsExpanded() ? '👇' : '👉'}
                </button>
              ) : (
                '🔵'
              )}
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </Td>
        ))}
      </Tr>
      {row.getIsExpanded() &&
        row.subRows.map((subRow: any) => (
          <ExpandableRow
            key={subRow.id}
            row={subRow}
            parentColumns={parentColumns}
            subRowColumns={subRowColumns} // Pass subRow columns for subrows
          />
        ))}
    </>
  );
}

export default ExpandableRow;
