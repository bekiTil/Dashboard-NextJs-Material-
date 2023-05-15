import Head from "next/head";
import {
  Select,
  Avatar,
  Box,
  Button,
  TextField,
  Card,
  CardActions,
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
  CardHeader,
  CardContent,
  Chip,
  InputLabel,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import { getATutor, getATutorwithLocation, getTutors } from "backend-utils/tutor-utils";
import moment from "moment";
import { getAParent } from "backend-utils/parent-utils";
import { DashboardLayout } from "src/components/dashboard-layout";
import { selectUser } from "redux/userSlice";
import { getAStudent, updateStudent } from "backend-utils/student-utils";
import { getAReport, UpdateAReport, getAReportWithSpecificWeek } from "backend-utils/report-utils";
import Reports from "../reports";
import Rating from "@mui/material/Rating";

const ReportDetail = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const { tutorId, year, month, week } = router.query;
  const [value, setValue] = useState(-1);
  const [reportList, setReportList] = useState([]);
  const [report, setReportDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentD, setCommentD] =  useState({});
  if (tutorId == undefined || year == undefined || month == null || week == null) {
    router.push("/reports");
  }

  const [err, setErr] = useState("");
  const [ratings, setRatings] = useState({}); // state to store the ratings for each object

  const handleRatingChange = (id, value) => {
    setRatings({ ...ratings, [id]: value }); // update the rating for the object with the given id
  };
  const handleCommentChange = (id,value)=>{
    setCommentD({...commentD,[id]:value})
  }
  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    console.log(tutorId, year, month, week);
    getAReportWithSpecificWeek(token, tutorId, year, month, week)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          console.log(data);
          setReportList(data.reports);
          setReportDetail(data.user);
          console.log(data.user.reports.inputFields);
        } else {
          setErr(data.message);
        }
      })
      .catch((err) => {
        setErr("Something went Wrong");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // initialize the ratings object with default values of -1 for each object
    const defaultRatings = {};
    const defaultComment ={}
    reportList.forEach((object, index) => {
      defaultRatings[index] = -1;
      defaultComment[index] ="";
    });
    setRatings(defaultRatings);
    setCommentD(defaultComment);
  }, [reportList]);
  const monthNames = [
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

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", backgroundColor: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="info" />
      </Backdrop>

      {reportList.map((report, index) => {
        return (
          <>
            <Grid alignItems="center" m={2} p={2}>
              <Typography variant="subtitle1">Report {index + 1}</Typography>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Report Date
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <Typography>
                        {monthNames[report.reportMonth - 1]} {report.reportDate} ,{" "}
                        {report.reportYear}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography>Total Hours: {report.totalHours}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography>Total Days: {report.totalDays}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <div className="my-1">
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Report Summary
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell rowSpan={2}>Report</TableCell>
                            </TableRow>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          { report?.reports?.inputFields?.map((item, index) => (
                            <Box key={index} component="main" boxShadow={1}>
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell style={{ width: '100%' }} >
                                  <Typography variant="subtitle1">On the Content</Typography>
                                  {renderSubjectsTable(item.subjects)}
                                  <br></br>
                                  <Typography variant="subtitle1">On Result</Typography>
                                  {renderAssessmentsTable(item.assesments)}
                                </TableCell>
                                {/* <TableCell></TableCell> */}
                              </TableRow>
                            </Box>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    On the Tutorial Delivery
                  </Typography>
                  <Typography variant="h6"></Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography>1.How do the tutorials go?</Typography>
                      <Typography paddingLeft={2}>{report.feedback}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>2.Was there any challenge?</Typography>
                      <Typography paddingLeft={2}>{report.pastChallenge}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>3.What are you going to the challenge?</Typography>
                      <Typography paddingLeft={2}>{report.futureChallenge}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>4.How can we help you with the challenge?</Typography>
                      <Typography paddingLeft={2}>{report.helpChallenge}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ my: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    On Professionality (10%)
                  </Typography>

                  <Grid container alignItems="center" m={2} p={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">Dressing:</Typography>
                      <Chip label={`${report.dressing}/10`} variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">Grooming:</Typography>
                      <Chip label={`${report.grooming}/10`} variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">Hygiene:</Typography>
                      <Chip label={`${report.hygiene}/10`} variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">Punctuality:</Typography>
                      <Chip label={`${report.punctuality}/10`} variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">Manner:</Typography>
                      <Chip label={`${report.manner}/10`} variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">Eloquence:</Typography>
                      <Chip label={`${report.elequence}/10`} variant="outlined" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {!report?.comment && (
  <>
    <InputLabel id="demo-select-small">Comment</InputLabel>
    <TextField
     
      required={true}
      margin="normal"
      multiline
      rows={4}
      value={commentD[index]}
      onChange={(event) => handleCommentChange(index, event.target.value)}
      error={commentD[index] === "" || commentD[index] === null }
      helperText={commentD[index] === "" || commentD[index] === null && "Please fill out this field"}
    />
  </>
)}
{report?.status == "PENDING" && (
  <Box marginTop={2}>
    <Typography component="legend">Rate the Report </Typography>
    <Rating
      name="simple-controlled"
      color="primary"
      value={ratings[index] || 0}
      onChange={(event, newValue) => handleRatingChange(index, newValue)}
    />
  </Box>
)}

{report?.status == "PENDING" && (
  <Stack direction="row" spacing={2}>
    <Button
      variant="contained"
      color="success"
      disabled={commentD[index] === "" || commentD[index] ===null}
      onClick={async () => {
        if (commentD !== "") {
          console.log(commentD[index])
          report.status = "SUCCESS";

          await UpdateAReport(token, report?.id, { status: "SUCCESS",
          rate: ratings[index],   comment: commentD[index] });
          
          router.reload()
        

        
        } else {
          setSubmitted(true);
        }
      }}
    >
      Accept
    </Button>

    <Button
      variant="contained"
      color="error"
      disabled={ratings[index] == -1 || commentD === "" || commentD ===null}
      onClick={() => {
        report.status = "REJECTED";
        UpdateAReport(token, report?.id, {
          status: "REJECTED",
          rate: ratings[index],
          comment: commentD
        });
      router.reload()
      }}
    >
      Reject
    </Button>
  </Stack>
)}
              {report?.comment && <><InputLabel id="demo-select-small">Comment</InputLabel>
    <TextField
      
      disabled
      margin="normal"
      multiline
      rows={4}
      value={report?.comment}
    
    /> </>}
              {report?.status == "REJECTED" && <Alert severity="warning">Rejected</Alert>}
              {report?.status == "SUCCESS" && <Alert severity="success">Accepted</Alert>}
             
            </Grid>
          </>
        );
      })}
    </div>
  );
};

const renderAssessmentsTable = (assessments) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Course</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Result</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {assessments.map((assessment, index2) =>
          assessment.units.map((unit, index1) =>
            unit.types.map((type, index) => (
              <TableRow key={index}>
                <TableCell>{index1 == 0 && index ==0  &&assessment.assesment}</TableCell>
                <TableCell>{index ==0 &&  unit.unit}</TableCell>
                <TableCell>{type.type}</TableCell>
                <TableCell>{type.result}</TableCell>
              </TableRow>
            ))
          )
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const renderSubjectsTable = (subjects) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Subject</TableCell>
          <TableCell>Chapter</TableCell>
          <TableCell>Topic</TableCell>
          <TableCell>Understanding</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {subjects.map((subject, index2) =>
          subject.chapters.map((chapter, index1) =>
            chapter.topics.map((topic, index) => (
              <TableRow key={index}>
                <TableCell>{index1 == 0 && index ==0  && subject.subject}</TableCell>
                <TableCell>{index ==0 && chapter.chapter}</TableCell>
                <TableCell>{topic.topic}</TableCell>
                <TableCell>{topic.understanding}</TableCell>
              </TableRow>
            ))
          )
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

ReportDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ReportDetail;
