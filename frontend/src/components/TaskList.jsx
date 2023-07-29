import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { randomCreatedDate, randomUpdatedDate } from '@mui/x-data-grid-generator';
import { Avatar, Box, Modal, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircleTwoTone';
import AutorenewIcon from '@mui/icons-material/AutorenewTwoTone';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleTwoTone';
import StopCircleIcon from '@mui/icons-material/StopCircleTwoTone';
import HourglassTopTwoToneIcon from '@mui/icons-material/HourglassTopTwoTone';
import { useDispatch, useSelector } from 'react-redux';
import { changeTaskState, deleteTasks, setMessages, setTasks } from '../actions';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import Cookies from 'js-cookie';
import Button from './Button';
import ChatIcon from '@mui/icons-material/Chat';
import LiveChat from './LiveChat'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '16px',
  p: 4,
};

export default function TaskList(props) {
  const [loading, setLoading] = React.useState(false)
  const [openChat, setOpenChat] = React.useState(false)
  const [ws, setWs] = React.useState(null);
  const { tasks } = props
  const [chatTask, setChatTask] = React.useState({});
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const profile = useSelector(state => state.profileReducer)
  const token = Cookies.get('loginToken')
  const userId = Cookies.get('userId')
  const handleCloseChat = () => {setOpenChat(false); if (!!ws) {ws.close()};}
  const handleOpenChat = () => setOpenChat(true)


  const handleDeleteTask = React.useCallback(
    (id) => () => {
      // console.log(props.tasks.find((a) => a.task_id === id))
      // console.log("id", id);
      // console.log("props.tasks", props.tasks);
      dispatch(deleteTasks(id))
      handleDeleteTaskAPI(id)
    },
    [dispatch],
  );

  const handleChat = async (task) => {
    try {
      setChatTask(task)
      handleOpenChat()
    } catch (err) {
      console.error(err);
    }

  }

  const handleGetMessage = async (id) => {
    const res = await apiCall(`/messages?task_id=${id}`, {}, 'GET', `bearer ${token}`);
    dispatch(setMessages(res))
  }


  const handleLiveChat = React.useCallback( 
  (task) => async () => {
    handleGetMessage(task.row.task_id)
    handleChat(task.row)
  },
    [],
  );
  

  const handleDeleteTaskAPI = async (id) => {
    try {
      const res = await apiCall(`/task?task_id=${id}`, {}, 'DELETE', `bearer ${token}`);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  const handleFetchEditState = async (id, state) => {
    try {
      const object = {
        task_id: id,
        progress: state,
      }
      const res = await apiCall('/edit_task', object, 'PUT', `bearer ${token}`);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    setLoading(true)
    // dispatch(setTasks(initialRows))
    setLoading(false)
  },[])

  const handleCompleted = React.useCallback(
    (id) => () => {
      dispatch(changeTaskState(id, 'Completed'))
      handleFetchEditState(id, 'Completed')
    },
    [dispatch],
  );
  const handleInProgress = React.useCallback(
    (id) => () => {
      dispatch(changeTaskState(id, 'In Progress'))
      handleFetchEditState(id, 'In Progress')

    },
    [dispatch],
  );
  const handleNotStarted = React.useCallback(
    (id) => () => {
      dispatch(changeTaskState(id, 'Not Started'))
      handleFetchEditState(id, 'Not Started')
    },
    [dispatch],
  );
  const handleBlocked = React.useCallback(
    (id) => () => {
      dispatch(changeTaskState(id, 'Blocked'))
      handleFetchEditState(id, 'Blocked')

    },
    [dispatch],
  );

  const handleRowClick = (id) => {
    console.log("TEST");
    navigate('/task/' + id )
  }


  const columnsDetail = [
    { field: 'task_id', headerName: 'ID', width: 30, sortable: false},
    {
      field: 'liveChat',
      headerName: 'Live Chat',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ChatIcon color='primary'/>}
          label="Live Chat"
          onClick={handleLiveChat(params)}
        />,
      ],
    },  
    { field: 'assignee', headerName: 'Assignee', width: 200, renderCell:params=>params.row.assignees.map((a,index) => <Avatar key={index} src={null} />), sortable: false}, // TODO: set the src of Avatar
    { field: 'title', headerName: 'Task Name', width: 200, sortable: false},
    {
      field: 'deadline',
      headerName: 'Deadline',
      type: 'Date',
      width: 100,
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
        onClick={handleDeleteTask(params.id)}
      />,
      // <GridActionsCellItem
      //   icon={<FileCopyIcon />}
      //   label="Duplicate User"
      //   onClick={duplicateUser(params.id)}
      //   showInMenu
      // />,
    ],
  },
]
  if (userId !== props.id) {
    columnsDetail.splice(2,1)
    columnsDetail.splice(4,1)
    columnsDetail.splice(4,1)
  }


  const columns = React.useMemo(
    () => columnsDetail,
    [handleCompleted, handleInProgress, handleNotStarted, handleBlocked, props.tasks, tasks, handleDeleteTask],
  );
  if (!tasks) {
    return <>Loading</>
  }

  return (
    <>
    <div style={{ height: props.height, width: '100%' }}>
      <DataGrid 
      sx={{
        '& .MuiDataGrid-row:hover': {
          cursor: 'pointer',
        },
    
      }}
      columns={columns} 
      rows={tasks}
      getRowId={(tasks)=> tasks.task_id}
      pageSizeOptions={[5, 10]}
      initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: props.rowNums },
          },
        }}
        onRowClick={(params) => handleRowClick(params.id)}
        />
      
    </div>

    <Modal
      open={openChat}
      onClose={handleCloseChat}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
        <LiveChat chatTask={chatTask}></LiveChat>
      </Box>
    </Modal>
    </>

  );
}