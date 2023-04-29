import React ,  { useEffect, useState }  from 'react'
import NextHead from 'next/head'
import { useSelector } from 'react-redux'
import { selectUser } from 'redux/userSlice'
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

import { DashboardLayout } from 'src/components/dashboard-layout'


import { createTutorFollowup } from 'backend-utils/tutor-utils'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { getTutors } from 'backend-utils/tutor-utils'
import { useRouter } from 'next/router'

const TutorStandupPage = () => {
    const router = useRouter()

  const user = useSelector(selectUser)
  const [open, setOpen] = React.useState(false)
  if (user) {
    var token = user.accessToken
   
  }
  const date = new Date()
  const [isLoading, setIsLoading] = useState(true);
  const [parentId, setParentId] = useState('');
  const [selectedParent, setSelectedParent] = useState(null)
  const [selectedMonth, setMonth] = useState('')
  const handleMonth = (event) => {
    setMonth(event.target.value)
  }
  const [isSending , setIsSending]= useState(false)
  const year = date.getFullYear()
  const [strength, setStrength] = useState('')
  const handleStrength = (event) => {
    setStrength(event.target.value)
  }
  const [weakness, setWeakness] = useState('')
  const handleWeakness = (event) => {
    setWeakness(event.target.value)
  }
  const handleClose = () => {
    setOpen(false)
    router.push('/dashboard')
  }
  const [tutors, setTutors] = useState([]);
  const [opportunity, setopportunity] = useState('')
  const handleOpportunity = (event) => {
    setopportunity(event.target.value)
  }
  const [threat, setThreat] = useState('')
  const handleThreat = (event) => {
    setThreat(event.target.value)
  }
  const [userData, setUserData] = useState(null)
  const [assesment, setAssesment] = useState('')
  const handleAssesment = (event) => {
    setAssesment(event.target.value)
  }
  const [satisfaction, setSatisfaction] = useState('')
  const handleSatisfaction = (event) => {
    setSatisfaction(event.target.value)
  }
  const [status, setStatus] = useState('')
  const handleStatus = (event) => {
    setStatus(event.target.value)
  }
  const [authenticity, setAuthenticity] = useState('')
  const handleAuthenticity = (event) => {
    setAuthenticity(event.target.value)
  }

  useEffect(() => {
    getTutors(token)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTutors(data.users);
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
   
  }, [])
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
  const handleSubmit = () => {
    event.preventDefault()
    console.log("hi")
    setIsSending(true)
    createTutorFollowup(
        token,
        {
        
      tutorId: parentId,
      month: Number(selectedMonth),
      year: Number(year),
      strength: strength,
      weakness: weakness,
      opportunity: opportunity,
      threat: threat,
      assesment: assesment,
      satisfaction: satisfaction,
      status: status,
      authenticity: authenticity,
      comment:""
   
    })
      .then((data) => data.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err))
      .finally(() => {


        setIsSending(false)
        setOpen(true)
      })
  }
  const handleParentSelection = (event) => {
    const parent = event.target.value;
    console.log(parent,"selected Tutor")
 
    console.log(parent.fullName)
    setSelectedParent(parent);
    setParentId(parent.id)
}

  return (
    <div className="h-screen">

      <NextHead>
        <title>Tutor Monthly Standup</title>
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
            Tutor Monthly Standup
          </h1>
        </div>
      </div>

      <form
      method='post'
        onSubmit={handleSubmit}
        className="justify-center px-10 font-minionPro  md:px-20 "
      >
        <Grid container p={4} rowSpacing={1} columnSpacing={2}>
          <Grid item xs={16} md={8} lg={3}>
          <InputLabel id="demo-select-small" sx={{ marginBottom: 2 }}>Tutor Name</InputLabel>
              <Select
                fullWidth
                SelectDisplayProps={{ style: styles.input }}
                value={selectedParent}
                renderValue={renderSelectedParent}
                onChange={handleParentSelection}
              >
                {tutors.map((parent) => (
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
              fullWidth
              required={true}
              value={selectedMonth}
              onChange={(event) => handleMonth(event)}
              SelectDisplayProps={{ style: styles.input }}
            >
              {months.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={16} md={8}>
            <InputLabel id="demo-select-small">Strength</InputLabel>
            <TextField
              fullWidth
              required={true}
              margin="normal"
              InputProps={{ style: styles.input }}
              multiline
              rows={4}
              value={strength}
              onChange={(event) => handleStrength(event)}
            />
          </Grid>
          <Grid item xs={16} md={8}>
            <InputLabel id="demo-select-small">Weakness</InputLabel>
            <TextField
              fullWidth
              required={true}
              margin="normal"
              InputProps={{ style: styles.input }}
              multiline
              rows={4}
              value={weakness}
              onChange={(event) => handleWeakness(event)}
            />
          </Grid>
          <Grid item xs={16} md={8}>
            <InputLabel id="demo-select-small">Opportunity</InputLabel>
            <TextField
              fullWidth
              required={true}
              margin="normal"
              InputProps={{ style: styles.input }}
              multiline
              rows={4}
              value={opportunity}
              onChange={(event) => handleOpportunity(event)}
            />
          </Grid>
          <Grid item xs={16} md={8}>
            <InputLabel id="demo-select-small">Threat</InputLabel>
            <TextField
              fullWidth
              required={true}
              margin="normal"
              InputProps={{ style: styles.input }}
              multiline
              rows={4}
              value={threat}
              onChange={(event) => handleThreat(event)}
            />
          </Grid>
          <Grid item xs={16} md={8}>
            <InputLabel id="demo-select-small">Assesment</InputLabel>
            <TextField
              fullWidth
              required={true}
              margin="normal"
              InputProps={{ style: styles.input }}
              multiline
              rows={4}
              value={assesment}
              onChange={(event) => handleAssesment(event)}
            />
          </Grid>
          <Grid item xs={16} md={4} lg={4}>
            <InputLabel id="demo-select-small" sx={{ marginBottom: 2 }}>
              Satisfaction
            </InputLabel>
            <Select
              required={true}
              fullWidth
              SelectDisplayProps={{ style: styles.input }}
              value={satisfaction}
              onChange={(event) => handleSatisfaction(event)}
            >
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
              value={status}
              onChange={(event) => handleStatus(event)}
              required={true}
              fullWidth
              SelectDisplayProps={{ style: styles.input }}
            >
              <MenuItem value="On Track">On Track</MenuItem>
              <MenuItem value="Needs Improvement">Needs Improvement</MenuItem>
              <MenuItem value="Behind Schedule">Behind Schedule</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={16} md={4} lg={4}>
            <InputLabel id="demo-select-small" sx={{ marginBottom: 2 }}>
              Authenticity
            </InputLabel>
            <Select
              value={authenticity}
              onChange={(event) => handleAuthenticity(event)}
              required={true}
              fullWidth
              SelectDisplayProps={{ style: styles.input }}
            >
              <MenuItem value="Authentic">Authentic</MenuItem>
              <MenuItem value="Inauthentic">Inauthentic</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <br />
        <br />
        <div className="my-2 mx-2 mb-4 flex justify-center md:my-2 ">
          <button
            class=" focus:shadow-outline my-1 w-1/2 rounded-xl bg-[#1A3765] py-2 px-4 font-bold text-white hover:bg-[#6793d9] focus:outline-none disabled:bg-[#6793d9] md:w-1/6 md:text-xl"
            type="submit"
            disabled={isSending}
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
             Tutor Followup Created
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
TutorStandupPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default TutorStandupPage
