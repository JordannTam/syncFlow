import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import PageContainer from '../components/PageContainer'
import AssigneeTransferList from '../components/AssigneeTransferList'
import TaskList from '../components/TaskList';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
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
    const [deadlineDate, setDeadlineDate] = useState("")
    const [deadlineType, setDeadlineType] = useState("noDeadline");
    const [assignType, setAssignType] = useState("assignToMe")
    const [assignees, setAssignees] = useState([])
    const dispatch = useDispatch()
    const tasks = useSelector(state => state.taskReducer)
    const token = Cookies.get('loginToken');
    const profile = useSelector(state => state.profileReducer)

    const navigate = useNavigate()

    const handleSubmit = async () => {
        const deadline = deadlineType === "noDeadline" ? null : deadlineDate
        const ass = assignType === "assignToMe" ? [profile.profile_id] : assignees
        console.log(profile.profile_id);
        const object = {
            title,
            assignees : ass,
            description,
            deadline,
          }
          try {
            console.log(object)
            const data = await apiCall('/task', object, 'POST', `bearer ${token}`, );
            navigate('/home')
            object.task_id = data.task_id
            dispatch(addTask(object))
          } catch (err) {
            console.error(err);
          }
    }

    const handleFetchTasks = async () => {
      try {
        const tasks = await apiCall('/tasks', undefined, 'GET', token);
        dispatch(setTasks(tasks))
      } catch (err) {
        console.error(err);
      }

    }

    useEffect(() => {
        // handleFetchTasks()
        console.log('deadline', deadlineType);
        console.log('deadlineDate', deadlineDate);
        console.log('assignType', assignType);
        console.log('assignees', assignees);
      }, [deadlineType, deadlineDate, assignType, assignees])
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
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Deadline</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="noDeadline"
              name="radio-buttons-group"
              onChange={(e) => setDeadlineType(e.target.value)}
            >
              <FormControlLabel value="noDeadline" control={<Radio />} label="No Deadline" />
              <FormControlLabel value="deadline" control={<Radio />} label={<TextField value={deadlineDate} type='date' onChange={(e) => setDeadlineDate(e.target.value)}/>} />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Assign</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="assignToMe"
              name="radio-buttons-group"
              onChange={(e) => setAssignType(e.target.value)}
            >
              <FormControlLabel value="assignToMe" control={<Radio />} label="Myself" />
              <FormControlLabel value="assignToOther" control={<Radio />} label={<AssigneeTransferList right={assignees} setRight={setAssignees}/>} />
            </RadioGroup>
          </FormControl>

            <RowBox columnGap='20px'>
                <Button variant='contained' onClick={() => navigate('/home')} >Back</Button>
                <Button variant='contained' onClick={() => handleSubmit()}>Create Task</Button>
            </RowBox>
        </ColumnBox>
      </PageContainer>
    </>
  );
};

export default CreateTaskScreen