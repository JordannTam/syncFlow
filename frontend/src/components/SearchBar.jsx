import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import styled from '@emotion/styled';
import { LocalizationProvider, DatePicker  } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../actions';


const CustomTextField = styled(TextField)({
  height: '80px',
})
const CustomButton = styled(Button)({
  height: '55px',
  marginTop: '0px',
})

const SearchBar = (props) => {
  const {taskStorage} = props
  const [idValue, setIdValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [descValue, setDescValue] = useState('')
  const [deadlineValue, setDeadlineValue] = useState('')

  const dispatch = useDispatch()

  const searchSubmit = async() => {
    dispatch(setTasks(taskStorage.filter((task) => {
      const taskDeadline = task.deadline ? new Date(task.deadline) : deadlineValue
      if (idValue && deadlineValue) {
        return (
          taskDeadline < deadlineValue &&
          task.task_id === Number(idValue) &&
          task.title.includes(nameValue.toLowerCase()) && 
          task.description.includes(descValue.toLowerCase())
        );
      }
      else if (idValue) {
        return task.task_id === Number(idValue) && task.title.includes(nameValue.toLowerCase()) && task.description.includes(descValue.toLowerCase())
      }
      else if (deadlineValue) {
        return (
          taskDeadline < deadlineValue &&
          task.title.includes(nameValue.toLowerCase()) && 
          task.description.includes(descValue.toLowerCase())
        );
      }
      else {
        return task.title.includes(nameValue.toLowerCase()) && task.description.includes(descValue.toLowerCase())
      }
    })));
  };
  
  // tick for specific deadline (at this point always on), problem with looping route, make it work on profile page
  // date range picker https://mui.com/x/react-date-pickers/date-range-picker/
  return (
  <div>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CustomTextField label="ID" variant="outlined" value={idValue} onChange={(event) => {
        const inputValue = event.target.value;
        const regex = /^[0-9]*$/;
        if (regex.test(inputValue)) {
          setIdValue(inputValue);
        }
      }}/>
      <CustomTextField label="Name" variant="outlined" value={nameValue} onChange={(event) => {setNameValue(event.target.value)}}/>
      <CustomTextField label="Description" variant="outlined" value={descValue} onChange={(event) => {setDescValue(event.target.value)}}/>
      <DatePicker label="Deadline" slotProps={{ textField: { error: false, }, }} value={deadlineValue} onChange={(newValue) => {setDeadlineValue(newValue)}}/>
      <CustomButton variant='contained' onClick={() => searchSubmit()}>Search</CustomButton>
      <CustomButton variant='outlined' onClick={() => { dispatch(setTasks(taskStorage)) }}>Clear</CustomButton>
    </LocalizationProvider>
  </div>)
}

export default SearchBar