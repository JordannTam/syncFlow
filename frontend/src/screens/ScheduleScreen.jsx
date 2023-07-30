import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer'
import { Box, Typography, Button, FormControlLabel, Switch } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { apiCall } from '../utils/api';
import { setTasks } from '../actions';
import SmallTaskList from '../components/SmallTaskList';


const ProfileScreen = () => {
  const dispatch = useDispatch()
  const token = Cookies.get('loginToken');
  const userId = Cookies.get('userId');
  const tasks = useSelector(state => state.taskReducer)
  // const profile = useSelector(state => state.profileReducer)
  // const [taskStorage, setTaskStorage] = useState([{'task_id': 1, 'title': 'Dinner with Family', 'description': '2 hours dinner', 'deadline': '2023-07-30'}, {'task_id': 6, 'title': 'Group meeting with Johnnnnnnnnnnn', 'description': '3 hours', 'deadline': '2023-08-08'}, {'task_id': 2, 'title': 'Basketball night with John', 'description': '2hours', 'deadline': '2023-08-10'}, {'task_id': 5, 'title': 'Group meeting', 'description': '3 hours', 'deadline': '2023-08-18'}, {'task_id': 4, 'title': 'Workout with Jimmy', 'description': '2 hours', 'deadline': '2023-08-23'}, {'task_id': 3, 'title': 'Dinner with Alex', 'description': 'possible 4 hours', 'deadline': '2023-08-28'}])
  const [taskStorage, setTaskStorage] = useState([])
  const [removedTaskStorage, setRemovedTaskStorage] = useState([])
  const [schedule, setSchedule] = useState({})
  const [dailyTime, setDailyTime] = useState(8)

  const [shortestPossible, setShortestPossible] = useState(false);

  const handleReschedule = async (reschedule = true) => {
    try {
      const removedTasks = removedTaskStorage.join(',');
      const time = 60 * dailyTime
      const params = new URLSearchParams({
        removedTasks,
        time,
        reschedule,
        shortestPossible,
      });
  
      console.log(params.toString())
      const schedule_data = await apiCall(`/schedule?${params.toString()}`, {}, 'GET', `bearer ${token}`);
      setTaskStorage(schedule_data.daily_tasks)
      setSchedule(schedule_data.schedule)
      setDailyTime(schedule_data.time/60)
      console.log("Schedule: ", schedule_data);
    } catch (err) {
      console.error(err);
    }
  }

  const setNewDailyTime = (adding) => {
    if (dailyTime + adding > 0 && dailyTime + adding <= 24 ) {
      setDailyTime(dailyTime + adding)
    }
  }

  const handleDeleteTask = (id) => {
    // remove task from storage and append task_id in another list
    setTaskStorage(taskStorage.filter(item => item.task_id !== id))
    setRemovedTaskStorage([...removedTaskStorage, id])
    console.log(removedTaskStorage)
  }

  useEffect(() => {
    console.log(removedTaskStorage);
  }, [removedTaskStorage]);

  useEffect(() => {
    handleReschedule(false)
  }, [])

  if (!tasks) {
    return <>Loading...</>
  }

  return (
    <>
      <PageContainer marginTop="0px" maxWidth="lg">
        <Box
          sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
        >
          <Box sx={{ flexGrow: 1 }}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
            <Typography variant="h5" component="h3" marginBottom="15px">
              Daily Tasks
            </Typography>
            
            <Button sx={{
                height: '62px',
                marginLeft: '15px',
                marginRight: '5px',
              }}
              variant="outlined">{dailyTime} hours</Button>
            <Box display="flex" flexDirection="column" spacing={2}>
              <Button sx={{
                width: '100px',
                height: '30px',
                marginBottom: '2px',
              }}
              variant="contained" color="success" onClick={() => setNewDailyTime(1)}>
                +1 hour
              </Button>
              <Button sx={{
                width: '100px',
                height: '30px',
              }}
              variant="contained" color="error" onClick={() => setNewDailyTime(-1)}>
                -1 hour
              </Button>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginTop="10px"
            marginBottom="10px"
          >
            <FormControlLabel
              control={
              <Switch
                checked={shortestPossible}
                onChange={() => setShortestPossible(!shortestPossible)}
                name="checkedB"
                color="primary"
              />}
              label="Shortest Possible Schedule"
            />
            <Button
              sx={{
                width: '90%',
              }}
              variant="contained"
              onClick={() => handleReschedule(true)}
            >
              Reschedule
            </Button>
          </Box>
          
          <SmallTaskList tasks={taskStorage} handleDeleteTask={handleDeleteTask} id={parseInt(userId)} rowNums={10} height='800'/>
          </Box>
          <Box sx={{
            flexGrow: 10, 
            display:"flex", 
            flexDirection:"column",
            alignItems:"center",
            }}>
            <Typography variant="h5" component="h3" marginBottom="15px">
              Projected Weekly Schedule
            </Typography>
          </Box>
        </Box>
        
      </PageContainer>
    </>
  );
};

export default ProfileScreen;

// "schedule" : {"date": {"task_id": task_id, title:"title", "mean": }}

// Weeklyschedule 
// receives list of tasks
// display in weekly batches with first element being today.  (doesn't have to start at monday like in figma, can use dates or day of week whateveryou want)
// user can use arrows to move back and forward between batches (endpoint gives a schedule including all stasks)
// scale the component of each block according to mean relative to maximium hours workable
// if you can make it so you click on task block and get more details of task that would be great but if you dont have time, no worries
