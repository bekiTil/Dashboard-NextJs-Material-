import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  CardActions,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { DashboardLayout } from "../components/dashboard-layout";
import { UpdateAnImage } from "backend-utils/tutor-utils";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";


const TFinance = () => {
  const router = useRouter();
  const { tutorId, myObject } = router.query;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (myObject == undefined || tutorId == undefined || myObject == null) {
    router.push("/tutorFinances");
  }
  const parsedArray = [];
  if (myObject) {
    parsedArray = JSON.parse(myObject);
  }
  const [listOfTimeSheet, setListOfTimeSheet] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [pendings, setPendings] = useState(false);

  useEffect(() => {
    let temp = [];

    parsedArray.map((val) => {
      if (val.tutorId == tutorId) {
        temp.push(val);
        if (val.statusOfMoneyPaid == "PENDING"){
          setPendings(true)
        }
      }
      
    });
    setListOfTimeSheet(temp);
  }, []);

  const handleClickOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };
  const countNumberOfHOurs = ()=>{
    let hour = 0;
    listOfTimeSheet.map((val,index)=>{
      console.log(val.timestamp)
      console.log("Hidss")
      val.listStudent?.listStudent.map((student, index)=>{
        hour= Number(student?.workHour) + Number(hour)
      }
      )
    })
    return hour
  }
  const countNumberOfMoney = ()=>{
    let temp = 0;
    listOfTimeSheet.map((te,index)=>{
      te.listStudent?.listStudent.map((val, index)=>{
        if (val.grade == "11" || val.grade == "12")
      {
       
       temp += Number(val.workHour) * 200 
     
       
      }
      else {
        temp += Number(val.workHour) * 175
        
      }
     
      }
      )
    })
    return temp;
  }

  const handlePayment = ()=>{
    
    setButtonDisable(true)
    listOfTimeSheet.map((sheet,index)=>{
      UpdateAnImage(user.accessToken, sheet.id,{statusOfMoneyPaid:"SUCCESS"}).then((data)=>data.json())
      .then((data)=>console.log(data))
      .catch((error)=>{
        console.log(error)

      })
      .finally(()=>{
        setButtonDisable(false)
        router.push("/tutorFinances")
      })
    })
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box mt={2}>
        <Card>
          <CardHeader title={`Tutor: ${listOfTimeSheet[0]?.tutor.fullName}`}></CardHeader>
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={12} md={12}>
                <Box mt={2}>
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Parent Name</TableCell>
                          <TableCell align="center">Student Name</TableCell>
                          <TableCell align="center">Grade</TableCell>
                          <TableCell align="center">Work Hour</TableCell>
                          <TableCell align="center">Month</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="center">Image</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {listOfTimeSheet.map((val, index) => (
                          <>
                            {val.listStudent?.listStudent.map((student, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  {index == 0 && <Typography>{val.parent.fullName}</Typography>}
                                </TableCell>
                                <TableCell align="center">{student.studentName.fullName}</TableCell>
                                <TableCell align="center">{student.grade}</TableCell>
                                <TableCell align="center">{student.workHour}</TableCell>
                                <TableCell align="center">{months[val.month - 1]}</TableCell>
                                <TableCell align="center">
                                  {val.statusOfMoneyPaid === "SUCCESS" && (
                                    <Typography>Paid</Typography>
                                  )}
                                  {val.statusOfMoneyPaid === "PENDING" && (
                                    <Typography>Not Paid</Typography>
                                  )}
                                  {/* {val.statusOfAcceptance === "SUCCESS" && (
                                    <Chip variant="outlined" label="SUCCESS" color="primary" />
                                  )}
                                  {val.statusOfAcceptance === "FAILED" && (
                                    <Chip variant="outlined" label="REJECTED" color="error" />
                                  )}
                                  {val.statusOfAcceptance === "PENDING" && (
                                    <Chip variant="outlined" label="PENDING" color="success" />
                                  )} */}
                                </TableCell>

                                <TableCell align="center">
                                  {index == 0 && (
                                    <Button onClick={() => handleClickOpen(val.cloudinary_id)}>
                                      <ArrowDropDownCircleOutlinedIcon color="action" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

      </Box>

      {
         <Grid container>
          <Grid item xs={12} sm={12} md={4}>
           <TextField
            margin="normal"
           disabled={true}
           value={countNumberOfHOurs()}
           >
           
           </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            
          <TextField
           disabled={true}
           margin="normal"
           value={countNumberOfMoney()}
           >
            
           </TextField>

          </Grid>
          <Grid item xs={12} sm={12} md={4}>
         
       { pendings &&  <Button
          sx={{ mt:2 }}
          variant="contained"
          color="info"
          disabled={buttonDisable}
          
          onClick={()=>handlePayment()}
          >
            Payment Made

          </Button>
}
          
        
          </Grid>
          </Grid>
}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CardMedia component="img" image={selectedImage} alt="Cloudinary Image" />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};
TFinance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TFinance;
