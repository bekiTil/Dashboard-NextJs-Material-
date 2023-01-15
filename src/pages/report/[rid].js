import Head from "next/head";
import {
  Select,
  Avatar,
  Box,
  Button,
  TextField,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { getATutor, getATutorwithLocation, getTutors } from "backend-utils/tutor-utils";
import moment from "moment";
import { getAParent } from "backend-utils/parent-utils";
import { DashboardLayout } from "src/components/dashboard-layout";
import { selectUser } from "redux/userSlice";
import { getAStudent, updateStudent } from "backend-utils/student-utils";
import { getAReport, UpdateAReport } from "backend-utils/report-utils";
import Reports from "../reports";
import Rating from "@mui/material/Rating";

const ReportDetail = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [report, setReportDetail] = useState(null);
  const { rid } = router.query;
  const [err, setErr] = useState("");

  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    getAReport(token, rid)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setReportDetail(data.user);
          console.log(data.user.reports.inputFields);
        } else {
          setErr(data.message);
        }
      })
      .catch((err) => {
        setErr("Something went Wrong");
      });
  }, [rid]);

  return (
    <Grid alignItems="center" m={2} p={2}>
      {report?.reports?.inputFields?.map((tutee, index) => {
        return (
          <Box p={5}>
            <Typography align="center">Tutee Name: {tutee.name}</Typography>

            <Grid marginTop={2} padding={2} container boxShadow={12}>
              <Typography>On the Content</Typography>
              {tutee.subjects.map((sub, index1) => {
                return (
                  <Grid
                    sx={{}}
                    item
                    rowSpacing={1}
                    spacing={2}
                    columnSpacing={2}
                    container
                    lg={12}
                    xs={12}
                  >
                    <Grid item xs={3} lg={3}>
                      {index1 === 0 && (
                        <Button
                          variant="outlined"
                          fullWidth={true}
                          sx={{
                            fontSize: {
                              sm: 15,
                              xs: 10,
                            },
                          }}
                        >
                          Subject
                        </Button>
                      )}
                      <TextField
                        style={{ wordWrap: "break-word" }}
                        disabled
                        inputProps={{
                          style: {
                            fontSize: {
                              sm: 15,
                              xs: 10,
                            },
                          },
                        }}
                        sx={{
                          my: 2,
                          fontSize: {
                            sm: 15,
                            xs: 10,
                          },
                        }}
                        value={sub.subject}
                      ></TextField>
                      {/* <Typography
                      
                        style={{ wordWrap: "break-word" }}
                        sx={{
                          fontSize: {
                            sm: 15,
                            xs: 10,
                          },
                        }}
                      >
                        {sub.subject}
                      </Typography> */}
                    </Grid>
                    <Grid item xs={9} lg={9}>
                      {sub.chapters.map((cha, index2) => {
                        return (
                          <Grid
                            item
                            rowSpacing={1}
                            spacing={2}
                            columnSpacing={2}
                            container
                            lg={12}
                            xs={12}
                          >
                            <Grid item xs={4} lg={4}>
                              {index1 == 0 && index2 == 0 && (
                                <Button
                                  style={{ wordWrap: "break-word" }}
                                  variant="outlined"
                                  fullWidth={true}
                                  sx={{
                                    fontSize: {
                                      sm: 15,
                                      xs: 10,
                                    },
                                  }}
                                >
                                  Chapter
                                </Button>
                              )}
                              <TextField
                                disabled
                                inputProps={{
                                  style: {
                                    fontSize: {
                                      sm: 15,
                                      xs: 10,
                                    },
                                  },
                                }}
                                sx={{
                                  my: 2,
                                  fontSize: {
                                    sm: 15,
                                    xs: 10,
                                  },
                                }}
                                value={cha.chapter}
                              ></TextField>
                              {/* <Typography
                                style={{ wordWrap: "break-word" }}
                                sx={{
                                  fontSize: {
                                    sm: 15,
                                    xs: 10,
                                  },
                                }}
                              >
                                {cha.chapter}
                              </Typography> */}
                            </Grid>
                            <Grid item lg={8} xs={8}>
                              {cha.topics.map((top, index3) => {
                                return (
                                  <Grid
                                    item
                                    rowSpacing={1}
                                    spacing={2}
                                    columnSpacing={2}
                                    container
                                    lg={12}
                                    xs={12}
                                  >
                                    <Grid item xs={6} lg={6}>
                                      {index1 == 0 && index2 == 0 && index3 == 0 && (
                                        <Button
                                          style={{ wordWrap: "break-word" }}
                                          variant="outlined"
                                          fullWidth={true}
                                          sx={{
                                            fontSize: {
                                              sm: 15,
                                              xs: 10,
                                            },
                                          }}
                                        >
                                          Topic
                                        </Button>
                                      )}
                                      <TextField
                                        disabled
                                        inputProps={{
                                          style: {
                                            fontSize: {
                                              sm: 15,
                                              xs: 10,
                                            },
                                          },
                                        }}
                                        sx={{
                                          my: 2,
                                          fontSize: {
                                            sm: 15,
                                            xs: 10,
                                          },
                                        }}
                                        value={top.topic}
                                      ></TextField>
                                      {/* <Typography
                                      paddingY={2}
                                        sx={{
                                          fontSize: {
                                            sm: 15,
                                            xs: 10,
                                          },
                                        }}
                                        style={{ wordWrap: "break-word" }}
                                      >
                                        {top.topic}dkfhaflakfkafjlk
                                      </Typography> */}
                                    </Grid>
                                    <Grid item xs={6} lg={6}>
                                      {index1 == 0 && index2 == 0 && index3 == 0 && (
                                        <Button
                                          style={{ wordWrap: "break-word" }}
                                          variant="outlined"
                                          fullWidth={true}
                                          sx={{
                                            fontSize: {
                                              sm: 15,
                                              xs: 9,
                                            },
                                          }}
                                        >
                                          Understanding
                                        </Button>
                                      )}
                                      <TextField
                                        style={{ wordWrap: "break-word" }}
                                        disabled
                                        inputProps={{
                                          style: {
                                            fontSize: {
                                              sm: 15,
                                              xs: 10,
                                            },
                                          },
                                        }}
                                        sx={{
                                          my: 2,
                                        }}
                                        value={top.understanding}
                                      ></TextField>
                                    </Grid>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
            <Grid
              marginTop={2}
              padding={2}
              container
              rowSpacing={1}
              spacing={2}
              columnSpacing={2}
              boxShadow={12}
            >
              <Typography>On the Result</Typography>
              {tutee.assesments.map((sub, index4) => {
                return (
                  <Grid
                    item
                    alignContent="center"
                    container
                    lg={12}
                    xs={12}
                    rowSpacing={1}
                    spacing={2}
                    columnSpacing={2}
                  >
                    <Grid item xs={3} lg={3}>
                      {index4 === 0 && (
                        <Button
                          variant="outlined"
                          fullWidth={true}
                          sx={{
                            fontSize: {
                              sm: 15,
                              xs: 10,
                            },
                          }}
                        >
                          Subject
                        </Button>
                      )}
                      <TextField
                        disabled
                        inputProps={{
                          style: {
                            fontSize: {
                              sm: 15,
                              xs: 10,
                            },
                          },
                        }}
                        sx={{
                          my: 2,
                          fontSize: {
                            sm: 15,
                            xs: 10,
                          },
                        }}
                        value={sub.assesment}
                      ></TextField>
                    </Grid>
                    <Grid item xs={9} lg={9}>
                      {sub.units.map((cha, index5) => {
                        return (
                          <Grid
                            item
                            container
                            rowSpacing={1}
                            spacing={2}
                            columnSpacing={2}
                            lg={12}
                            xs={12}
                          >
                            <Grid item xs={4} lg={4}>
                              {index4 === 0 && index5 == 0 && (
                                <Button
                                  sx={{
                                    fontSize: {
                                      sm: 15,
                                      xs: 10,
                                    },
                                  }}
                                  variant="outlined"
                                  fullWidth={true}
                                >
                                  Chapter
                                </Button>
                              )}
                              <TextField
                                style={{ wordWrap: "break-word" }}
                                disabled
                                inputProps={{
                                  style: {
                                    fontSize: {
                                      sm: 15,
                                      xs: 10,
                                    },
                                  },
                                }}
                                sx={{
                                  my: 2,
                                  fontSize: {
                                    sm: 15,
                                    xs: 10,
                                  },
                                }}
                                value={cha.unit}
                              ></TextField>
                            </Grid>
                            <Grid item lg={8} xs={8}>
                              {cha.types.map((top, index6) => {
                                return (
                                  <Grid
                                    item
                                    container
                                    rowSpacing={1}
                                    spacing={2}
                                    columnSpacing={2}
                                    lg={12}
                                    xs={12}
                                  >
                                    <Grid item xs={6} lg={6}>
                                      {index4 === 0 && index5 == 0 && index6 == 0 && (
                                        <Button
                                          sx={{
                                            fontSize: {
                                              sm: 15,
                                              xs: 10,
                                            },
                                          }}
                                          variant="outlined"
                                          fullWidth={true}
                                        >
                                          Type
                                        </Button>
                                      )}
                                      <TextField
                                        style={{ wordWrap: "break-word" }}
                                        disabled
                                        inputProps={{
                                          style: {
                                            fontSize: {
                                              sm: 15,
                                              xs: 10,
                                            },
                                          },
                                        }}
                                        sx={{
                                          my: 2,
                                          fontSize: {
                                            sm: 15,
                                            xs: 10,
                                          },
                                        }}
                                        value={top.type}
                                      ></TextField>
                                    </Grid>
                                    <Grid item xs={6} lg={6}>
                                      {index4 === 0 && index5 == 0 && index6 == 0 && (
                                        <Button
                                          sx={{
                                            fontSize: {
                                              sm: 15,
                                              xs: 10,
                                            },
                                          }}
                                          variant="outlined"
                                          fullWidth={true}
                                        >
                                          Result
                                        </Button>
                                      )}
                                      <TextField
                                        style={{ wordWrap: "break-word" }}
                                        disabled
                                        inputProps={{
                                          style: {
                                            fontSize: {
                                              sm: 15,
                                              xs: 10,
                                            },
                                          },
                                        }}
                                        sx={{
                                          my: 2,
                                          fontSize: {
                                            sm: 15,
                                            xs: 10,
                                          },
                                        }}
                                        value={top.result}
                                      ></TextField>
                                    </Grid>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>

            <Typography>On the Tutorial Delivary </Typography>
            <Grid
              marginTop={2}
              padding={2}
              container
              rowSpacing={1}
              spacing={2}
              columnSpacing={2}
              boxShadow={12}
            >
              <Grid xs={12} md={6}>
                <div className="text-lg">1.How do the tutorial go?</div>
                <TextField value={report.feedback} multiline disabled />
              </Grid>
              <Grid xs={12} md={6}>
                <div className="text-lg">2.Was there any Challenge?</div>

                <TextField value={report.pastChallenge} multiline disabled />
              </Grid>
              <Grid xs={12} md={6}>
                <div className="text-lg">3.What are you going to the Challenge?</div>
                <TextField value={report.futureChallenge} multiline disabled />
              </Grid>
              <Grid xs={12} md={6}>
                <div className="text-lg">4.How can we help you with the Challenge?</div>
                <TextField value={report.helpChallenge} multiline disabled />
              </Grid>
            </Grid>
            <Grid
              marginTop={2}
              padding={2}
              container
              rowSpacing={1}
              spacing={2}
              columnSpacing={2}
              boxShadow={12}
            >
              <Grid xs={12} md={6} my={2}>
                <TextField label="dressing" value={report.dressing} />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField label="Grooming" value={report.grooming} />
              </Grid>
              <Grid xs={12} md={6} my={2}>
                <TextField label="Hygiene" value={report.hygiene} />
              </Grid>
              <Grid xs={12} md={6} my={2}>
                <TextField label="Punctuality" value={report.punctuality} />
              </Grid>
              <Grid xs={12} md={6} my={2}>
                <TextField label="Manner" value={report.manner} />
              </Grid>
              <Grid xs={12} md={6} my={2}>
                <TextField label="Elequence" value={report.elequence} />
              </Grid>
            </Grid>
            
          </Box>
        );
      })}
      <Typography component="legend">Rate the Report </Typography>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          report.rate=newValue
          setValue(newValue);
          
        }}
      />
       { report?.status=="PENDING" && (
     <Stack direction="row" spacing={2}>
     
<Button variant="contained" color="success"
onClick={()=>{
report.status="SUCCESS"
UpdateAReport(token,rid,{status:"SUCCESS",rate:value})}

}
>
  Success
</Button>

<Button

variant="contained" color="error"
onClick={()=>{
  report.status="FAILED"
  UpdateAReport(token,rid,{status:"FAILED",rate:value})}
  
  }
>
  Reject
</Button>
    
     </Stack>
       )
      }
         {
      report?.status=="FAILED" &&(
        <Alert severity="warning"
        
      
        >
          Rejected
        </Alert>




      )
    }
      {
      report?.status=="SUCCESS" &&(
        <Alert severity="success" 
        
      
        >
          Accepted
        </Alert>




      )
    }
    </Grid>
 
  );
};

ReportDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ReportDetail;
