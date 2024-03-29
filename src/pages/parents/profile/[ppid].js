import Head from "next/head";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Alert,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getATutor, getATutorwithLocation } from "backend-utils/tutor-utils";
import moment from "moment";
import { getAParent, updateParent } from "backend-utils/parent-utils";
import { DashboardLayout } from "src/components/dashboard-layout";
import { selectUser } from "redux/userSlice";
import { deleteStudent, updateStudent } from "backend-utils/student-utils";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { DeleteOutlined, MoreHorizSharp } from "@mui/icons-material";
import { updateStudentTutor } from "backend-utils/student-utils";
import { removeStudentTutor } from "backend-utils/student-utils";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  rightAlign: {
    marginLeft: 'auto',
  },
}));


const ParentDetail = () => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const router = useRouter();
  const { ppid } = router.query;
  const [parentData, setParentData] = useState(null);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState("");
  const [existedTutor, setExistedTutor] = useState([]);
  const [prospectTutor, setProspectTutor] = useState(null);
  const [childId, setChildId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [changebutton, setChangeButton] = useState(false);
  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    getAParent(token, ppid)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setParentData(data.user);
        } else {
          setErr(data.message);
        }
        console.log(data);
        console.log(parentData);
      })
      .catch((err) => {
        setErr("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [ppid]);

  const connectTutorChild = (tutorId, childId) => {
    setChangeButton(true);
    updateStudentTutor(token, childId, tutorId, "SUCCESS")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        setErr("Something went wrong");
      })
      .finally(() => {
        setChangeButton(false);
        router.push("/parents/profile" + parentData?.id);
      });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const goToHome = () => {
    setOpen(false);
    router.push("/dashboard");
  };

  const handleTutor = (index, status) => {
    setChildId(null);
    setExistedTutor([]);
    setProspectTutor(null);
    setChangeButton(true);
    if (status === "PENDING") {
      getATutorwithLocation(token, parentData?.location)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data.users);
            console.log(prospectTutor);
            if (data.users.length > 0) {
              setProspectTutor(data.users);
            }
            console.log(parentData);

            setChildId(parentData?.students[index].id);
          } else {
            setErr(data.message);
          }
        })
        .catch((err) => {
          setErr("Something went wrong");
        })
        .finally(() => {
          setOpen(true);
          setChangeButton(false);
        });
    } else {
      setChildId(parentData?.students[index].id);
      async function fetchData() {
        const tutorIds = parentData?.students[index].tutorIds;

        if (tutorIds && tutorIds.length > 0) {
          try {
            const existedTutors = [];
            const errorMessages = [];

            for (const id of tutorIds) {
              const response = await getATutor(token, id);
              const data = await response.json();
              console.log(id, data, response, "what the hell");
              if (data.success) {
                existedTutors.push(data.user);
              } else {
                errorMessages.push(data.message);
              }
            }

            setExistedTutor(existedTutors);
            setErr(errorMessages.join(", "));
          } catch (err) {
            setErr("Something went wrong");
          }
        } else {
          // handle case where there are no tutor IDs to fetch
        }
      }

      fetchData().finally(() => {
        console.log();
        setOpen(true);
        setChangeButton(false);
      });

      // parentData?.students[index].tutorIds?.map((ids)=>{ getATutor(token,ids)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log( parentData?.students[index].tutorIds,"what a hell")
      //     if (data.success) {
      //       setExistedTutor(data.user);
      //     } else {
      //       setErr(data.message);
      //     }
      //   })
      //   .catch((err) => {
      //     setErr("Something went wrong");
      //   })
      //   .finally(() => {
      //     setOpen(true);
      //     setChangeButton(false);
      //   });})
    }
  };
  return (
    <>
      <Head>
        <title>Account | Temaribet</title>
      </Head>
      <Backdrop
        sx={{ color: "#fff", backgroundColor: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="info" />
      </Backdrop>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Account
          </Typography>
          <Grid container spacing={3}>
            <Grid item lg={6} md={6} xs={12}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Avatar
                      src={parentData?.profilePicture}
                      sx={{
                        height: 64,
                        mb: 2,
                        width: 64,
                      }}
                    />
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {parentData?.fullName}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Email: {parentData?.email}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Phone Number: {parentData?.phone1}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Other Phone No.: {parentData?.phone2}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Location: {parentData?.location}
                    </Typography>
                    <Grid container  sx={{
              
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            ml:6
          }}  spacing={3}>
                      <Grid item lg={5} md={6} xs={12}>

                      <Button
                      variant="contained"
                      onClick={() => {
                        router.push("/parents/" + parentData?.id);
                      }}
                    >
                      Add Child
                    </Button>
                      </Grid>
                      <Grid item lg={5} md={6} xs={12}>

                      <Button
                      variant="contained"
                      onClick={() => {
                        router.push("/parents/edit/" + parentData?.id);
                      }}
                    >
                      Edit Parent
                    </Button>
                      </Grid>
                   
                    </Grid>
                    
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* <Grid item lg={6} md={6} xs={12}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      Bank Information
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Preferred Bank: {parentData?.preferredBank}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Account Number: {parentData?.bankAccountNo}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
          <Typography sx={{ mb: 3, mt: 2 }} variant="h4">
            Students
          </Typography>
          <Grid container spacing={3}>
            {parentData?.students.map((student, index) => {
              return (
                <Grid item lg={6} md={6} xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                         <IconButton
         className={classes.rightAlign}
      
        onClick={()=>{deleteStudent(token,student.id)
        
        .finally(router.reload())}}
        
      >

          <DeleteOutlined />
      </IconButton>
                        <Typography color="textPrimary" gutterBottom variant="h5">
                          Student {index + 1}
                        </Typography>
                        <Box sx={{ width: 1 }}>
                          <Typography color="textSecondary" variant="body2">
                            Full Name: {student.fullName}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Nick Name: {student.nickName}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Gender: {student.gender}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Age: {student.age}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Grade: {student.grade}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            School: {student.school}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Address: {student.address}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Hobby: {student.hobby}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Previous Tutored: {student.prevTutored}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Previous Tutor Experience: {student.prevTutorExperience}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Ideal Tutor: {student.idealTutor}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Work Days: {student.workDays}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Work Hour: {student.workHour}
                          </Typography>
                          <Typography color="textSecondary" variant="body2">
                            Subjects: {student.subjects.toString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      {parentData?.status == "SUCCESS" && (
                        <Button
                          onClick={() => handleTutor(index, student.status)}
                          color="primary"
                          fullWidth
                          variant="text"
                          disabled={changebutton}
                        >
                          Tutoring Status: {student.status}
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {parentData?.status == "SUCCESS"  && <Button
          sx={{m:2}}
            variant="contained"
            color="error"
            disabled={isLoading}
            onClick={() => {
                setIsLoading(true)
              
              updateParent(token, ppid, { status: "FAILED"}).finally(()=>{
                router.push('/parents/')
              });
             
            }}
          >
          Ask SuperAdmin to Delete This Parent
          </Button>
}
        </Container>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle align="center">
            <label className="font-minionPro text-[#fdd507] md:text-3xl ">Successful</label>
          </DialogTitle>

          <DialogContent dividers  >
            {existedTutor.length === 0 && prospectTutor === null && (
              <>
                <Typography>NO TUTOR NEAR</Typography>
              </>
            )}

            {prospectTutor != null && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Location</TableCell>

                      <TableCell align="right">Action</TableCell>
                      <TableCell align="right">Detail</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prospectTutor?.map((tutor, index) => {
                      return (
                        <>
                          <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {tutor.fullName}
                            </TableCell>
                            <TableCell align="right">{tutor.location}</TableCell>
                            <TableCell align="right">
                              <Button
                                disabled={changebutton}
                                variant="contained"
                                onClick={() => connectTutorChild(tutor.id, childId)}
                              >
                                Choose
                              </Button>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="info"
                                aria-label="upload picture"
                                disabled={isLoading}
                                component="span"
                                onClick={() => {
                                  setOpen(false);
                                  setIsLoading(true);
                                  router.push("/tutors/" + tutor.id);
                                }}
                              >
                                <MoreHorizSharp />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {existedTutor.length != 0 &&
              existedTutor.map((tutorCurrent) => {
                return (
                 <div className="w-fit">
                    <Card  sx={{ width: '100%', padding:2, boxShadow:5 , margin:1,  bgcolor: 'background.paper' }}>
                      <Typography color="textPrimary" gutterBottom variant="h5">
                        {tutorCurrent?.fullName}
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        Email: {tutorCurrent?.email}
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        Detail:
                        <IconButton
                          size="small"
                          sx={{ display: "inline-flex" }}
                          color="info"
                          aria-label="upload picture"
                          disabled={isLoading}
                          component="span"
                          onClick={() => {
                            setIsLoading(true);
                            router.push("/tutors/" + tutorCurrent?.id);
                          }}
                        >
                          <MoreHorizSharp />
                        </IconButton>
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        Remove Tutor:
                        <IconButton
                          size="small"
                          sx={{ display: "inline-flex" }}
                          color="info"
                          aria-label="upload picture"
                          disabled={isLoading}
                          component="span"
                          onClick={() => {
                            setIsLoading(true);
                            setOpen(false);
                            removeStudentTutor(token, childId, tutorCurrent?.id)
                              .then((data) => data.json())
                              .then((data) => console.log(data))
                              .catch((err) => {
                                console.log(err);
                              })
                              .finally(() => {
                                setIsLoading(false);
                                
                               router.reload()
                              });
                          }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Typography>
                    </Card>
                    </div>
                  
                );
              })}
          </DialogContent>
          <DialogActions>
            <Button color="primary" variant="contained" onClick={goToHome} autoFocus>
              Go to Home
            </Button>
            {existedTutor.length ==0 && (
              <Button
                color="primary"
                variant="contained"
                onClick={() => router.push("/parents/student/" + childId)}
                autoFocus
              >
                Get Tutor
              </Button>
            )}
             {existedTutor.length >0 && (
              <Button
                color="primary"
                variant="contained"
                onClick={() => router.push("/parents/student/" + childId)}
                autoFocus
              >
                Add Tutor
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

ParentDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ParentDetail;
