import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar } from '@mui/material';

// eslint-disable-next-line react-hooks/rules-of-hooks
const columns = [
  { field: 'id', headerName: 'ID', width: 200, sortable: false},
  { field: 'assignee', headerName: 'Assignee', width: 200, renderCell:params=><Avatar src={params.row.photoURL} />, sortable: false},
  { field: 'task', headerName: 'Task Name', width: 200, sortable: false},
  {
    field: 'deadline',
    headerName: 'Deadline',
    type: 'Date',
    width: 200,
  },
  {
    field: 'taskState',
    headerName: 'Task State',
    sortable: false,
    width: 200,
    type: 'singleSelect',
    valueOptions:['Completed', 'In Progress', 'Not Started', 'Blocked'],
    editable:true
  },
];

const rows = [
  { id: 1, task: 'Snow', assignee: 'Jon', deadline: '10/10/2016', taskState: 'Completed' },
  { id: 2, task: 'Lannister', assignee: 'Cersei', deadline: '10/10/2012', taskState: 'In Progress' },
  { id: 3, task: 'Lannister', assignee: 'Jaime', deadline: '10/10/2016', taskState: 'In Progress' },
  { id: 4, task: 'Stark', assignee: 'Arya', deadline: '10/10/2016', taskState: 'In Progress' },
  { id: 5, task: 'Targaryen', assignee: 'Daenerys', deadline: '10/10/2016', taskState: 'Not Started' },
  { id: 6, task: 'Melisandre', assignee: null, deadline: '10/10/2016', taskState: 'Not Started' },
  { id: 7, task: 'Clifford', assignee: 'Ferrara', deadline: '10/10/2016', taskState: 'Not Started' },
  { id: 8, task: 'Frances', assignee: 'Rossini', deadline: null , taskState: 'Blocked' },
  { id: 9, task: 'Roxie', assignee: 'Harvey', deadline: null, taskState: 'Blocked' },
  { id: 10, task: 'Roxie', assignee: 'Harvey', deadline: null, taskState: 'Blocked' },
];

export default function TaskList(props) {

  const handleClick = () => {
    console.log("Click Cell");
  }

  return (
    <div style={{ height: props.height, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: props.rowNums },
          },
        }}
        pageSizeOptions={[5, 10]}
        onCellClick={() => handleClick()}
        // autoPageSize='true'
      />
    </div>
  );
}