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
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import React,{ useEffect, useState } from "react";
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
  const { tutorId, year,month, week } = router.query;
  const [value, setValue] = useState(-1);
  const [reportList , setReportList] = useState([])
  const [report, setReportDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  if (tutorId == undefined || year == undefined || month == null || week == null) {
    router.push("/reports");
  }
  
  const [err, setErr] = useState("");
  const [ratings, setRatings] = useState({}); // state to store the ratings for each object

const handleRatingChange = (id, value) => {
  setRatings({ ...ratings, [id]: value }); // update the rating for the object with the given id
};
  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    console.log(tutorId,year,month,week)
    getAReportWithSpecificWeek(token,tutorId,year,month,week)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
            console.log(data)
        setReportList(data.reports)
          setReportDetail(data.user);
          console.log(data.user.reports.inputFields);
        } else {
          setErr(data.message);
        }
      })
      .catch((err) => {
        setErr("Something went Wrong");
      }).finally(()=>setIsLoading(false));
  }, []);

  
useEffect(() => {
    // initialize the ratings object with default values of -1 for each object
    const defaultRatings = {};
    reportList.forEach((object,index) => {
      defaultRatings[index] = -1;
    });
    setRatings(defaultRatings);
  }, [reportList]);

  return (
    <div>
        <Backdrop
         sx={{ color: '#fff', backgroundColor: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="info" />
      </Backdrop>
        {reportList.map((report,index)=>{

    return (        
    <Grid alignItems="center" m={2} p={2}>
     <div>
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
            {report?.reports?.inputFields?.map((item, index) => (
              <Box key={index}  component="main" boxShadow={1}>
              <TableRow   key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Typography variant="subtitle1">On the Content</Typography>
                  {renderSubjectsTable(item.subjects)}
                <br></br>
                <Typography variant ="subtitle1">On Result</Typography>
                 {renderAssessmentsTable(item.assesments)}
                 </TableCell>
                {/* <TableCell></TableCell> */}
              </TableRow>
              </Box>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

      
      { report?.status == "PENDING" && ( 
      <Box>
      <Typography component="legend">Rate the Report </Typography>
      <Rating
        name="simple-controlled"
        color="primary"
        value={ratings[index] || 0}
          onChange={(event, newValue) => handleRatingChange(index, newValue)}
        
        
        
       
      />
      </Box>
      )
}
      
           {report?.status == "PENDING" && (
        <Stack direction="row" spacing={2}>
          <Button
             
            variant="contained"
            color="success"
            disabled={ratings[index] == -1} 
            onClick={() => {
              report.status = "SUCCESS";
              UpdateAReport(token, report?.id, { status: "SUCCESS", rate: ratings[index] });
              router.push({
                pathname: "/report/detail",
                query: {
                  tutorId: tutorId,
                  year: year,
                  month:month,
                  week: week,
                
                },
              
              })
            }}
          >
            Accept
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={ratings[index] == -1}
            onClick={() => {
              report.status = "REJECTED";
              
              UpdateAReport(token, report?.id, { status: "REJECTED", rate: ratings[index] });
              router.push({
                pathname: "/report/detail",
                query: {
                  tutorId: tutorId,
                  year: year,
                  month:month,
                  week: week,
                
                },
              
              })
            }}
          >
            Reject
          </Button>
        </Stack>
      )}
      {report?.status == "REJECTED" && <Alert severity="warning">Rejected</Alert>}
      {report?.status == "SUCCESS" && <Alert severity="success">Accepted</Alert>}
    </Grid>
    )
    })}
    </div>
  );
};

const renderAssessmentsTable =(assessments) => 
  (
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
        {assessments.map((assessment, index) => (
          assessment.units.map((unit, index) => (
            unit.types.map((type, index) => (
              <TableRow key={index}>
                <TableCell>{assessment.assesment}</TableCell>
                <TableCell>{unit.unit}</TableCell>
                <TableCell>{type.type}</TableCell>
                <TableCell>{type.result}</TableCell>
              </TableRow>
            ))
          ))
        ))}
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
        {subjects.map((subject, index) => (
          subject.chapters.map((chapter, index) => (
            chapter.topics.map((topic, index) => (
              <TableRow key={index}>
                <TableCell>{subject.subject}</TableCell>
                <TableCell>{chapter.chapter}</TableCell>
                <TableCell>{topic.topic}</TableCell>
                <TableCell>{topic.understanding}</TableCell>
              </TableRow>
            ))
          ))
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );

ReportDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ReportDetail;
