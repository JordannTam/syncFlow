import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import PageContainer from '../components/PageContainer'
import AssigneeTransferList from '../components/AssigneeTransferList'
import TaskList from '../components/TaskList';
import { Box, TextField, Typography } from '@mui/material';
import { ColumnBox, RowBox } from '../components/FlexBox';
import Button from '../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, setTasks } from '../actions';

const TaskScreen = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState("")
    const [assignees, setAssignees] = useState([])
    const dispatch = useDispatch()
    const tasks = useSelector(state => state.taskReducer)
    const params = useParams()
    let targetTask = tasks.find((a) => a.id === parseInt(params.id))

    const navigate = useNavigate()

    const handleEdit = async () => {
        navigate('/task/' + `${params.id}` + '/edit')
    }

    useEffect(() => {
        // console.log(tasks, targetTask, params.id);
    }, [])
  return (
    <>
      {/* <SideBar/> */}
        <PageContainer marginTop="0px" maxWidth="lg">
            <Typography variant="h3" component="h2" marginBottom="15px">
            Task
            </Typography>
        <ColumnBox rowGap='40px' padding='0px 100px'>

            <Typography variant="h5" component="h5" marginBottom="15px">
                Title: {targetTask.title}
            </Typography>
            <Typography variant="h5" component="h5" marginBottom="15px">
                Description: {targetTask.description}
            </Typography>
            <Typography variant="h5" component="h5" marginBottom="15px">
                Deadline: {targetTask.deadline}
            </Typography>
            <Typography variant="h5" component="h5" marginBottom="15px">
                Assignees: {}
            </Typography>
            {targetTask.assignees.map((name, index) => (
            <Typography key={index} variant="h5" component="h5" marginBottom="15px">
                {name}
            </Typography>))}

            <RowBox columnGap='20px'>
                <Button variant='contained' onClick={() => navigate('/home')} >Back</Button>
                <Button variant='contained' onClick={() => handleEdit()}>Edit Task</Button>
            </RowBox>
        </ColumnBox>
      </PageContainer>
    </>
  );
};

export default TaskScreen