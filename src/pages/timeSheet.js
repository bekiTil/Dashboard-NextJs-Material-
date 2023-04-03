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
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { DashboardLayout } from "../components/dashboard-layout";
import { UpdateAnImage,UpdateAnImageWithAMessage } from "backend-utils/tutor-utils";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";

const TimeSheet = () => {
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
    router.push("/timeSheets");
  }
  const parsedArray = [];
  if (myObject) {
    parsedArray = JSON.parse(myObject);
  }

  const [listOfTimeSheet, setListOfTimeSheet] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let temp = [];

    parsedArray.map((val) => {
      if (val.tutorId == tutorId) {
        temp.push(val);
      }
    });
    console.log(temp[0].tutorId, "the value");
    setListOfTimeSheet(temp);
    temp.map((val, index) =>
      UpdateAnImage(user.accessToken, val.id, { view: "SEEN" })
        .then((data) => console.log(data))
        .catch((error) => {
          console.log(error);
        })
    );
  }, []);

  const handleClickOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleStatusChange = (timeId, newStatus) => {
    setIsLoading(true);
    UpdateAnImage(user.accessToken, timeId, { statusOfAcceptance: newStatus }).then((data) => {
      let val = [...listOfTimeSheet];
      val.map((timesheet, index) => {
        if (timesheet.id == timeId) {
          timesheet.statusOfAcceptance = newStatus;
        }
      });
      console.log(val);

      setListOfTimeSheet(val);
    }).catch((error)=>console.log(error)).finally(()=>{setIsLoading(false)});;
  };
  const handleStatusChangeWithMessage = (timeId, newStatus) => {
    setIsLoading(true);
    UpdateAnImageWithAMessage(user.accessToken, timeId, { statusOfAcceptance: newStatus })
    .then(
      (data) => {
        let val = [...listOfTimeSheet];
        val.map((timesheet, index) => {
          if (timesheet.id == timeId) {
            timesheet.statusOfAcceptance = newStatus;
          }
        });
        console.log(val);

        setListOfTimeSheet(val);
      }
    ).catch((error)=>console.log(error)).finally(()=>{setIsLoading(false)});
  };

  return (
    <Container maxWidth="md">
      <Card>
        <CardHeader title={`Tutor: ${listOfTimeSheet[0]?.tutor.fullName}`}></CardHeader>
      </Card>
      <Box mt={2}>
        <Card>
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
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {listOfTimeSheet.map((val, index) => (
                          <>
                            {/* <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    {/* <CardMedia
                      component="img"
                      image={val.cloudinary_id}
                      alt="Cloudinary Image"
                      onClick={() => handleClickOpen(val.cloudinary_id)}
                    /> */}
                            {/* </Box>
                </Grid> */}

                            {/* <Box display="flex" >
                  <Typography variant="subtitle1">{`Year: ${val.year}`}</Typography>
                  <Typography sx={{mx:2}}  variant="subtitle1">{`Month: ${months[val.month]}`}</Typography>
                  </Box>
                 
                  <Typography variant="subtitle1">
                    Status of Acceptance:
                    {val.statusOfAcceptance === "SUCCESS" && (
                      <Chip variant="outlined" label="SUCCESS" color="primary" />
                    )}
                    {val.statusOfAcceptance === "FAILED" && (
                      <Chip variant="outlined" label="REJECTED" color="error" />
                    )}
                    {val.statusOfAcceptance === "PENDING" && (
                      <Chip variant="outlined" label="PENDING" color="success" />
                    )}
                  </Typography> */}

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
                                  {val.statusOfAcceptance}
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
                                <TableCell align="center">
                                  {index == 0 && val.statusOfAcceptance === "PENDING" && (
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                      <Button
                                        disabled={isLoading}
                                        onClick={() =>
                                          handleStatusChangeWithMessage(val.id, "SUCCESS")
                                        }
                                        color="inherit"
                                      >
                                        <ThumbUpOutlinedIcon />
                                      </Button>
                                      <Button
                                        disabled={isLoading}
                                        sx={{ mx: 1 }}
                                        onClick={() => handleStatusChange(val.id, "REJECTED")}
                                        color="inherit"
                                      >
                                        <ThumbDownOffAltOutlinedIcon />
                                      </Button>
                                    </Box>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <Box display="flex" minWidth="fit-content" justifyContent="center" alignItems="center">
            <CardMedia component="img" image={selectedImage} alt="Cloudinary Image" />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};
TimeSheet.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TimeSheet;
