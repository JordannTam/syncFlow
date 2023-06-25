import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import PageContainer from '../components/PageContainer'
import TaskList from '../components/TaskList';
import { Box, TextField, Typography } from '@mui/material';
import { ColumnBox, RowBox } from '../components/FlexBox';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';

const ProfileScreen = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState("")
    const [assignee, setAssignee] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async () => {
        const object = {
            title,
            assignee,
            description,
            deadline,
          }
          try {
            await apiCall('/task', object, 'POST');
            navigate('/home')
          } catch (err) {
            console.log(err);
          }
  
    }

    // useEffect(() => {
    //     console.log(title, description, deadline );
    // }, [deadline, title, description])
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
            <TextField id="outlined-basic" value={assignee} onChange={(e) => setAssignee(e.target.value)} label="Assignee" variant="standard" />
            <RowBox columnGap='20px'>
                <Button variant='contained' onClick={() => navigate('/home')} >Back</Button>
                <Button variant='contained' onClick={() => handleSubmit()}>Create Task</Button>
            </RowBox>
        </ColumnBox>
      </PageContainer>
    </>
  );
};

export default ProfileScreen
    ;