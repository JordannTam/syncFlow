import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 200 },
  { field: 'firstName', headerName: 'Assignee', width: 200 },
  { field: 'lastName', headerName: 'Task Name', width: 200 },
  {
    field: 'age',
    headerName: 'Deadline',
    type: 'Date',
    width: 200,
  },
  {
    field: 'fullName',
    headerName: 'Task State',
    sortable: false,
    width: 200,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: '10/10/2016' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 42 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function DataTable() {

  const handleClick = () => {
    console.log("Click Cell");
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        onCellClick={() => handleClick()}
      />
    </div>
  );
}