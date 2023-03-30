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
import { getAllTutors, getATutorwithLocation, getTutors } from "backend-utils/tutor-utils";
import moment from "moment";
import { getAParent } from "backend-utils/parent-utils";
import { DashboardLayout } from "src/components/dashboard-layout";
import { selectUser } from "redux/userSlice";
import { getAStudent, updateStudentTutor } from "backend-utils/student-utils";
import { ChoiceListToolbar } from "src/components/choice/choice-list-toolbar";
import { ChoiceListResults } from "src/components/choice/choice-list-results";
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const StudentDetail = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [student, setStudentDetail] = useState(null);
  const { sid } = router.query;
  const [tutors, setTutors] = useState([]);
  const [parentData, setParentData] = useState(null);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState("");
  const [existedTutor, setExistedTutor] = useState(null);
  const [prospectTutor, setProspectTutor] = useState(null);
  const [childId, setChildId] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");
  

  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    getAllTutors(token)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setTutors(data.users);
        } else {
          setErr(data.message);
        }
        console.log(tutors);
      })
      .then(
        getAStudent(token, sid)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.success) {
              setStudentDetail(data.user);
            } else {
              setErr(data.message);
            }
            console.log(data);
          })
      )
      .catch((err) => {
        setErr("Something went wrong");
      }).finally(()=>{
        setIsLoading(false)
      });
      ;
  }, [sid]);

  const connectTutorChild = (tutorId, childId) => {
    console.log(tutorId, childId, token);
    updateStudentTutor(token, childId, tutorId, "SUCCESS")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        setErr("Something went wrong");
      })
      .finally(() => {
        console.log(student);
        router.push("/parents/profile/" + student?.parentId);
      });
  };
  return (
    <>
      <Head>
        <title>Tutors | Temaribet</title>
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
        <Container maxWidth={false}>
          <ChoiceListToolbar name="Tutors" setSearchTerm={setSearchTerm} />
          <Box sx={{ mt: 3 }}>
            <ChoiceListResults customers={tutors} searchTerm={searchTerm} sid={sid} student={student} />
          </Box>
        </Container>
        {/* <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Location</TableCell>

                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tutors?.map((tutor, index) => {
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
                        <Button onClick={() => connectTutorChild(tutor.id, sid)}>Choose</Button>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer> */}
      </Box>
    </>
  );
};
StudentDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default StudentDetail;
