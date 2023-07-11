import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import styled from '@emotion/styled';
import { LocalizationProvider, DatePicker  } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const CustomTextField = styled(TextField)({
  height: '80px',
})
const CustomButton = styled(Button)({
  height: '55px',
  marginTop: '0px',
})

const SearchBar = (props) => {
  const{displayTask, setDisplayTask} = props
  const [idValue, setIdValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [descValue, setDescValue] = useState('')
  const [dateValue, setDateValue] = useState('')

  const searchSubmit = async() => {
      alert(dateValue)
      setDisplayTask(displayTask.filter((task) => {
        const taskDate = new Date(task.date);
        if (idValue && dateValue) {
          return (
            taskDate < dateValue &&
            task.id === Number(idValue) &&
            task.name.includes(nameValue.toLowerCase()) && 
            task.desc.includes(descValue.toLowerCase())
          );
        }
        else if (idValue) {
          return task.id === Number(idValue)  && task.name.includes(nameValue.toLowerCase()) && task.desc.includes(descValue.toLowerCase())
        }
        else if (dateValue) {
          return (
            taskDate < dateValue &&
            task.name.includes(nameValue.toLowerCase()) && 
            task.desc.includes(descValue.toLowerCase())
          );
        }
        else {
          return task.name.includes(nameValue.toLowerCase()) && task.desc.includes(descValue.toLowerCase())
        }
      }));
  };
  
  // test with real data, tick for specific deadline (at this point always on), problem with fetching, problem with looping route
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
      <DatePicker label="Deadline" slotProps={{ textField: { error: false, }, }} value={dateValue} onChange={(newValue) => {setDateValue(newValue)}}/>
      <CustomButton variant='contained' onClick={() => searchSubmit()}>Search</CustomButton>
    </LocalizationProvider>
  </div>)
}

export default SearchBar