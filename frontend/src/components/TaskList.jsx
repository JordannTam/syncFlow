// import React, { useState } from 'react';
// import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
// import { Avatar } from '@mui/material';
// import { useDispatch } from 'react-redux';
// import { editTask } from '../actions';

// // eslint-disable-next-line react-hooks/rules-of-hooks
// const columns = [
//   { field: 'id', headerName: 'ID', width: 200, sortable: false},
//   { field: 'assignee', headerName: 'Assignee', width: 200, renderCell:params=><Avatar src={params.row.photoURL} />, sortable: false},
//   { field: 'task', headerName: 'Task Name', width: 200, sortable: false},
//   {
//     field: 'deadline',
//     headerName: 'Deadline',
//     type: 'Date',
//     width: 200,
//   },
//   {
//     field: 'state',
//     headerName: 'Task State',
//     sortable: false,
//     width: 200,
//     type: 'singleSelect',
//     valueOptions:['Completed', 'In Progress', 'Not Started', 'Blocked'],
//     editable:true
//   },
// ];

// const rowsInit = [
//   { id: 1, title: 'Snow', assignee: 'Jon', deadline: '10/10/2016', state: 'Completed' },
//   { id: 2, title: 'Lannister', assignee: 'Cersei', deadline: '10/10/2012', state: 'In Progress' },
//   { id: 3, title: 'Lannister', assignee: 'Jaime', deadline: '10/10/2016', state: 'In Progress' },
//   { id: 4, title: 'Stark', assignee: 'Arya', deadline: '10/10/2016', state: 'In Progress' },
//   { id: 5, title: 'Targaryen', assignee: 'Daenerys', deadline: '10/10/2016', state: 'Not Started' },
//   { id: 6, title: 'Melisandre', assignee: null, deadline: '10/10/2016', state: 'Not Started' },
//   { id: 7, title: 'Clifford', assignee: 'Ferrara', deadline: '10/10/2016', state: 'Not Started' },
//   { id: 8, title: 'Frances', assignee: 'Rossini', deadline: null , state: 'Blocked' },
//   { id: 9, title: 'Roxie', assignee: 'Harvey', deadline: null, state: 'Blocked' },
//   { id: 10, title: 'Roxie', assignee: 'Harvey', deadline: null, state: 'Blocked' },
// ];




// export default function TaskList(props) {
//   const [rows, setRows] = useState(rowsInit)
//   const dispatch = useDispatch()

//   const handleClick = (id) => {
//     console.log(id);
//   }
  

//   return (
//     <div style={{ height: props.height, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: props.rowNums },
//           },
//         }}
//         experimentalFeatures={{ newEditingApi: true }}

//         getRowId={(row)=> row.id}
//         pageSizeOptions={[5, 10]}
//         onRowClick={(row) => handleClick(row.id)}
//         // processRowUpdate={(params) => {
//         //     handleStateChange(params)
//         //   }
//         // }
//         // onProcessRowUpdateError={(error) => {
//         //   // console.log(error);
//         // }}
//         disableRowSelectionOnClick
      
//         // autoPageSize='true'
//       />
//     </div>
//   );
// }



import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { randomCreatedDate, randomUpdatedDate } from '@mui/x-data-grid-generator';
import { Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleTwoTone';
import AutorenewIcon from '@mui/icons-material/AutorenewTwoTone';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleTwoTone';
import StopCircleIcon from '@mui/icons-material/StopCircleTwoTone';
import HourglassTopTwoToneIcon from '@mui/icons-material/HourglassTopTwoTone';
import { useDispatch, useSelector } from 'react-redux';
import { changeTaskState, setTasks } from '../actions';
import { useNavigate } from 'react-router-dom';


const initialRows = [
  { task_id: 1, description: "ABC",  title: 'Snow', assignee: [2], deadline: '10/10/2016', progress: 'Completed' },
  { task_id: 2, description: "ABC",  title: 'Lannister', assignee: [5], deadline: '10/10/2012', progress: 'In Progress' },
  { task_id: 3, description: "ABC",  title: 'Lannister', assignee: [4], deadline: '10/10/2016', progress: 'In Progress' },
  { task_id: 4, description: "ABC",  title: 'Stark', assignee: [3], deadline: '10/10/2016', progress: 'In Progress' },
  { task_id: 5, description: "ABC",  title: 'Targaryen', assignee: [1], deadline: '10/10/2016', progress: 'Not Started' },
  { task_id: 6, description: "ABC",  title: 'Melisandre', assignee: null, deadline: '10/10/2016', progress: 'Not Started' },
  { task_id: 7, description: "ABC",  title: 'Clifford', assignee: [7, 8], deadline: '10/10/2016', progress: 'Not Started' },
  { task_id: 8, description: "ABC",  title: 'Frances', assignee: [4], deadline: null , progress: 'Blocked' },
  { task_id: 9, description: "ABC",  title: 'Roxie', assignee: [2], deadline: null, progress: 'Blocked' },
  { task_id: 10, description: "ABC",  title: 'Roxie', assignee: [1], deadline: null, progress: 'Blocked' },
];

export default function ColumnTypesGrid(props) {
  const [rows, setRows] = React.useState(initialRows);
  const [loading, setLoading] = React.useState(false)
  const tasks = useSelector(state=>state.taskReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const deleteUser = React.useCallback(
    (id) => () => {
      // setTimeout(() => {
      //   setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      // });
    },
    [],
  );

  const handleFetchEditState = () => {
    // TODO
  }

  React.useEffect(() => {
    setLoading(true)
    // dispatch(setTasks(initialRows))
    setLoading(false)
  },[])

  const handleCompleted = React.useCallback(
    (id) => () => {
      dispatch(changeTaskState(id, 'Completed'))
    },
    [],
  );
  const handleInProgress = React.useCallback(
    (id) => () => {
      console.log(id);
      dispatch(changeTaskState(id, 'In Progress'))
    },
    [],
  );
  const handleNotStarted = React.useCallback(
    (id) => () => {
      dispatch(changeTaskState(id, 'Not Started'))
    },
    [],
  );
  const handleBlocked = React.useCallback(
    (id) => () => {
      dispatch(changeTaskState(id, 'Blocked'))
    },
    [],
  );

  const handleRowClick = (id) => {
    console.log("TEST");
    navigate('/task/' + id )
  }

  const duplicateUser = React.useCallback(
    (id) => () => {
      setRows((prevRows) => {
        const rowToDuplicate = prevRows.find((row) => row.id === id);
        return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
      });
    },
    [],
  );

  const columns = React.useMemo(
    () => [
        { field: 'task_id', headerName: 'ID', width: 200, sortable: false},
        { field: 'assignee', headerName: 'Assignee', width: 200, renderCell:params=><Avatar src={params.row.photoURL} />, sortable: false},
        { field: 'title', headerName: 'Task Name', width: 200, sortable: false},
        {
          field: 'deadline',
          headerName: 'Deadline',
          type: 'Date',
          width: 200,
        },
        {
          field: 'progress',
          headerName: 'Task State',
          sortable: false,
          width: 200,
          type: 'actions',
          getActions: (params) => [
          <GridActionsCellItem
          icon={<CheckCircleIcon color={tasks.find((a) => a.task_id === params.id).progress === 'Completed' ? 'success' : 'disabled'} fontSize='large'/>}// Uncomment
            // icon={<CheckCircleIcon color={initialRows.find((a) => a.id === params.id).state === 'Completed' ? 'success' : 'disabled'} fontSize='large'/>}
            label="Completed"
            onClick={handleCompleted(params.id)}
            // showInMenu
          />,
          <GridActionsCellItem
          icon={<AutorenewIcon color={tasks.find((a) => a.task_id === params.id).progress === 'In Progress' ? 'primary' : 'disabled'} fontSize='large'/>}// Uncomment

            // icon={<AutorenewIcon color={initialRows.find((a) => a.id === params.id).state === 'In Progress' ? 'primary' : 'disabled'} fontSize='large'/>}
            label="In progress"
            onClick={handleInProgress(params.id)}
            // showInMenu
          />,
          <GridActionsCellItem
          icon={<HourglassTopTwoToneIcon color={tasks.find((a) => a.task_id === params.id).progress === 'Not Started' ? 'warning' : 'disabled'} fontSize='large'/>} //Uncomment

            // icon={<HourglassTopTwoToneIcon color={initialRows.find((a) => a.id === params.id).progress === 'Not Started' ? 'warning' : 'disabled'} fontSize='large'/>}
            label="Not Started"
            onClick={handleNotStarted(params.id)}
            // showInMenu
          />,
          <GridActionsCellItem
          icon={<RemoveCircleIcon color={tasks.find((a) => a.task_id === params.id).progress === 'Blocked' ? 'error' : 'disabled'} fontSize='large'/>} // Uncomment
          // icon={<RemoveCircleIcon color={initialRows.find((a) => a.id === params.id).progress === 'Blocked' ? 'error' : 'disabled'} fontSize='large'/>}
          label="Duplicate User"
          onClick={handleBlocked(params.id)}
          // showInMenu
        />,


          ],
        },
        {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteUser(params.id)}
          />,
          // <GridActionsCellItem
          //   icon={<SecurityIcon />}
          //   label="Toggle Admin"
          //   onClick={toggleAdmin(params.id)}
          //   showInMenu
          // />,
          // <GridActionsCellItem
          //   icon={<FileCopyIcon />}
          //   label="Duplicate User"
          //   onClick={duplicateUser(params.id)}
          //   showInMenu
          // />,
        ],
      },
    ],
    [handleBlocked, handleCompleted, handleInProgress, handleNotStarted, deleteUser],
  );

  return (
    loading ? <>Loading</> : 
    <div style={{ height: props.height, width: '100%' }}>
      <DataGrid 
      sx={{
        '& .MuiDataGrid-row:hover': {
          cursor: 'pointer',
        },
    
      }}
      columns={columns} 
      rows={tasks} 
      getRowId={(row)=> row.task_id}
      initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: props.rowNums },
          },
        }}
      onRowClick={(params) => handleRowClick(params.id)}
        />
      
    </div>
  );
}