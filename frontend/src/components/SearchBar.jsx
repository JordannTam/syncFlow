import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import styled from '@emotion/styled';

const CustomTextField = styled(TextField)({
  height: '80px',
})
const CustomButton = styled(Button)({
  height: '55px',
  marginTop: '0px',
})

const SearchBar = (props) => {
  const{displayTask, setDisplayTask, tasks} = props
  const [idValue, setIdValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [descValue, setDescValue] = useState('')
  const [dateValue, setDateValue] = useState('')

  const searchSubmit = async() => {
      setDisplayTask(displayTask.filter((task) => {
          if (idValue) {
            return task.id === idValue && task.name.includes(nameValue.toLowerCase()) && task.desc.includes(descValue.toLowerCase())
          }
          return task.name.includes(nameValue.toLowerCase()) && task.desc.includes(descValue.toLowerCase())
      }))
  }
  // Define deadline field, decide the deadline input, test with real data, duplicate to profile page
  return (
  <div>
    <CustomTextField label="ID" variant="outlined" value={idValue} onChange={(event) => {
    const inputValue = event.target.value;
    const regex = /^[0-9]*$/;
    if (regex.test(inputValue)) {
      setIdValue(inputValue);
    }
  }}/>
    <CustomTextField label="Name" variant="outlined" value={nameValue} onChange={(event) => {setNameValue(event.target.value)}}/>
    <CustomTextField label="Description" variant="outlined" value={descValue} onChange={(event) => {setDescValue(event.target.value)}}/>
    <CustomTextField label="Deadline" variant="outlined" value={dateValue} onChange={(event) => {setDateValue(event.target.value)}}/>
    <CustomButton variant='contained' onClick={() => searchSubmit()}>Search</CustomButton>
  </div>)
}

export default SearchBar