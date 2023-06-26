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


export default function TaskList(props) {
  const [loading, setLoading] = React.useState(false)
  const tasks = useSelector(state=>state.taskReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const deleteUser = React.useCallback(
    (id) => () => {
      console.log(props.tasks.find((a) => a.task_id === id))
      console.log("id", id);
      console.log("props.tasks", props.tasks);
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
          icon={
            (() => {
              const task = props.tasks && props.tasks.find((a) => a.task_id === params.id);
              return (
                <CheckCircleIcon 
                  color={
                    task && task.progress === 'Completed' 
                    ? 'success' 
                    : 'disabled'
                  } 
                  fontSize='large'
                />
              );
            })()
          }
                    label="Completed"
            onClick={handleCompleted(params.id)}
            // showInMenu
          />,
          <GridActionsCellItem
          icon={
            (() => {
              const task = tasks && tasks.find((a) => a.task_id === params.id);
              return (
                <AutorenewIcon 
                  color={
                    task && task.progress === 'In Progress' 
                    ? 'primary' 
                    : 'disabled'
                  } 
                  fontSize='large'
                />
              );
            })()
          }
        
            // icon={<AutorenewIcon color={initialRows.find((a) => a.id === params.id).state === 'In Progress' ? 'primary' : 'disabled'} fontSize='large'/>}
            label="In progress"
            onClick={handleInProgress(params.id)}
            // showInMenu
          />,
          <GridActionsCellItem
          icon={
            (() => {
              const task = tasks && tasks.find((a) => a.task_id === params.id);
              return (
                <HourglassTopTwoToneIcon 
                  color={
                    task && task.progress === 'Not Started'
                    ? 'warning' 
                    : 'disabled'
                  } 
                  fontSize='large'
                />
              );
            })()
          }

            // icon={<HourglassTopTwoToneIcon color={initialRows.find((a) => a.id === params.id).progress === 'Not Started' ? 'warning' : 'disabled'} fontSize='large'/>}
            label="Not Started"
            onClick={handleNotStarted(params.id)}
            // showInMenu
          />,
          <GridActionsCellItem
          icon={
            (() => {
              const task = tasks && tasks.find((a) => a.task_id === params.id);
              return (
                <RemoveCircleIcon 
                  color={
                    task && task.progress === 'Blocked'
                    ? 'error' 
                    : 'disabled'
                  } 
                  fontSize='large'
                />
              );
            })()
          }
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
    [tasks, handleBlocked, handleCompleted, handleInProgress, handleNotStarted, deleteUser],
  );
  if (!tasks) {
    return <>Loading</>
  }

  return (
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