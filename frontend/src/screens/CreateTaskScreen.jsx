import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import PageContainer from '../components/PageContainer'
import AssigneeTransferList from '../components/AssigneeTransferList'
import TaskList from '../components/TaskList';
import { Box, TextField, Typography } from '@mui/material';
import { ColumnBox, RowBox } from '../components/FlexBox';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, setTasks } from '../actions';
import Cookies from 'js-cookie';

const CreateTaskScreen = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState("")
    const [assignee, setAssignee] = useState([])
    const dispatch = useDispatch()
    const tasks = useSelector(state => state.taskReducer)
    const token = Cookies.get('loginToken');

    const navigate = useNavigate()

    const handleSubmit = async () => {
        const object = {
            title,
            assignee_ids : assignee,
            description,
            deadline,
          }
          try {
            console.log(object)
            const data = await apiCall('/task', object, 'POST', token);
            navigate('/home')
            // object.id = data.id
            object.id = 5 // DELETE after backend implemented
            dispatch(addTask(object))
          } catch (err) {
            console.log(err);
          }
    }

    const handleFetchTasks = async () => {
      try {
        const tasks = await apiCall('/tasks', undefined, 'GET', token);
        dispatch(setTasks(tasks))
      } catch (err) {
        console.log(err);
      }

    }

    useEffect(() => {
        // handleFetchTasks()
    }, [])
  return (
    <>
      {/* <SideBar/> */}
        <PageContainer marginTop="0px" maxWidth="lg">
            <Typography variant="h3" component="h2" marginBottom="15px">
            Create Task
            </Typography>
        <ColumnBox rowGap='40px' padding='0px 100px'>

            <TextField id="outlined-basic" value={title} onChange={(e) => setTitle(e.target.value)} label="Title" variant="standard" />
            <TextField id="outlined-basic" value={description} onChange={(e) => setDescription(e.target.value)} label="Description" variant="standard" />
            
            <ColumnBox>
                <Typography variant="h6" component="h6" marginBottom="15px">
                  Deadline
                </Typography>
                <TextField value={deadline} onChange={(e) => setDeadline(e.target.value)} id="outlined-basic" type='Date' variant="outlined" />
            </ColumnBox>
            <AssigneeTransferList right={assignee} setRight={setAssignee} />
            <RowBox columnGap='20px'>
                <Button variant='contained' onClick={() => navigate('/home')} >Back</Button>
                <Button variant='contained' onClick={() => handleSubmit()}>Create Task</Button>
                <Button variant='contained' onClick={() => dispatch(setTasks([{id: 5, string: 'abc'}, {id: 4, string: 'def'}]))}>Set Task</Button>
            </RowBox>
            <Box>
              {tasks.map((ob, index) => <div key={index}>id = {ob.id}, string = {ob.string}</div>)}
            </Box>
        </ColumnBox>
      </PageContainer>
    </>
  );
};

export default CreateTaskScreen