import React from 'react'
import NextHead from 'next/head'

import {
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  InputLabel,
  Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Typography
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { createParentFollowup, getParents } from 'backend-utils/parent-utils'
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { DashboardLayout } from 'src/components/dashboard-layout'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const ParentFollowupPage = () => {
    const router = useRouter()
    const date = new Date()
    const user = useSelector(selectUser);
    const [isLoading, setIsLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [parents, setParents] = useState([]);
    const [parentId, setParentId] = useState('');
    const [selectedParent, setSelectedParent] = useState(null)
    const [selectedMonth, setMonth] = useState('')
    const [satisfaction, setSatisfaction] = useState('')
    const [open, setOpen] = React.useState(false)
  const handleSatisfaction = (event) => {
    setSatisfaction(event.target.value)
  }
  const handleClose = () => {
    setOpen(false)
    router.push('/dashboard')
  }
  const [status, setStatus] = useState('')
  const handleStatus = (event) => {
    setStatus(event.target.value)
  }
    const handleMonth = (event) => {
        setMonth(event.target.value)
      }
  const styles = {
    input: {
      backgroundColor: '#f1f1f1', // Replace with desired gray color
    },
    boxContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
  }
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const renderSelectedParent = (value) => {
    if (!value) {
      return '';
    }

    return value.fullName;
  };
  const [comment, setComment] = useState('')
  const handleComment = (event) => {
    setComment(event.target.value)
  }
 
    const handleParentSelection = (event) => {
        const parent = event.target.value;
        console.log(parent,"selected Parent")
        let value = []
        console.log(parent.fullName)
        setSelectedParent(parent);
        setParentId(parent.id)
    }

  useEffect(()=>{

    getParents(user.accessToken)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setParents(data.users);
      } else {
       
      }
    })
    .catch((_) => {
      
    })
    .finally(
       ()=>{

      setIsLoading(false)
       }
    );
  },[])
  const year = date.getFullYear()

  const  handleSubmit = ()=>{
    event.preventDefault()
    setButtonLoading(true);
    console.log(buttonLoading)
    
    createParentFollowup(user.accessToken,
       
        {
        parentId :parentId,
        month: selectedMonth,
        year: year,
        comment:comment,
        satisfaction: satisfaction,
        status:status
        }
        )
        .then((res)=>res.json())
        .then((data)=>{console.log(data)})
        .catch((er)=>{
            console.log(er)
        })
        .finally(()=>{
            setOpen(true)
            setButtonLoading(false);
        })
  }

  return (
    <div className="h-screen p-10">
      <NextHead>
        <title>Parent Follow Up </title>
      </NextHead>
      <Backdrop
        sx={{ color: '#fff', backgroundColor: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="info" />
      </Backdrop>
      <div className="flex justify-center ">
        <div className=" mt-1 font-minionPro">
        
          <h1 className="text-lg text-[#000000] md:text-2xl">
            Parent Follow Up
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="justify-center px-10 font-minionPro  md:px-20 ">
        <Grid container p={4} rowSpacing={1} columnSpacing={2}>
          <Grid item xs={16} md={8} lg={3}>
          <InputLabel id="demo-select-small" sx={{ marginBottom: 2 }}>Parent Name</InputLabel>
              <Select
                fullWidth
                SelectDisplayProps={{ style: styles.input }}
                value={selectedParent}
                renderValue={renderSelectedParent}
                onChange={handleParentSelection}
              >
                {parents.map((parent) => (
                  <MenuItem key={parent.id} value={parent}>
                    {parent.fullName}
                  </MenuItem>
                ))}
              </Select>
          </Grid>
          <Grid item xs={16} md={8} lg={3}>
            <InputLabel id="demo-select-small" sx={{ marginBottom: 2 }}>
              Month
            </InputLabel>
            <Select
                          value={selectedMonth}
                          onChange={(event) => handleMonth(event)}
            fullWidth SelectDisplayProps={{ style: styles.input }}>
              {months.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={16} md={8}>
            <InputLabel id="demo-select-small">Comment</InputLabel>
            <TextField
              fullWidth
              required={true}
              margin="normal"
              value={comment}
              onChange={(event) => handleComment(event)}
              InputProps={{ style: styles.input }}
              multiline
              rows={8}
            />
          </Grid>

          <Grid item xs={16} md={4} lg={4}>
            <InputLabel id="demo-select-small" sx={{ marginBottom: 2 }}>
              Satisfaction
            </InputLabel>
            <Select 
            value={satisfaction}
            onChange={(event) => handleSatisfaction(event)}
            fullWidth SelectDisplayProps={{ style: styles.input }}>
              <MenuItem value="Satisfied">Satisfied</MenuItem>
              <MenuItem value="Neutral">Neutral</MenuItem>
              <MenuItem value="Dissatisfied">Dissatisfied</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={16} md={4} lg={4}>
            <InputLabel id="demo-select-small" sx={{ marginBottom: 2 }}>
              Status
            </InputLabel>
            <Select
            value={satisfaction}
            onChange={(event) => handleSatisfaction(event)}
            fullWidth SelectDisplayProps={{ style: styles.input }}>
              <MenuItem value="On Track">On Track</MenuItem>
              <MenuItem value="Needs Improvement">Needs Improvement</MenuItem>
              <MenuItem value="Behind Schedule">Behind Schedule</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <div className="my-2 mx-2 mb-4 flex justify-center ">
          <button
          disabled={buttonLoading}
            class=" focus:shadow-outline my-1 mb-3 w-1/2 rounded-xl bg-[#1A3765] py-2 px-4 font-bold text-white hover:bg-[#6793d9] focus:outline-none disabled:bg-[#6793d9] md:w-1/6 md:text-xl"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle align="center">
            <label className="font-minionPro text-[#fdd507] md:text-3xl ">
              Successful
            </label>
          </DialogTitle>

          <DialogContent dividers>
            <Typography gutterBottom>
             Parent Followup Created
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={handleClose}
              autoFocus
            >
              Go to Home
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}
ParentFollowupPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default ParentFollowupPage
