import Head from "next/head";
import { Box, Card,  Stack,Button, CardContent, Container, Grid, Typography ,IconButton} from "@mui/material";

import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getATutor } from "backend-utils/tutor-utils";
import { TutorProfile } from "src/components/customer/tutor-account";
import { DashboardLayout } from "src/components/dashboard-layout";
import { selectUser } from "redux/userSlice";
import moment from "moment";
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { updateTutor } from "backend-utils/tutor-utils";
import { deleteParent, updateParent } from "backend-utils/parent-utils";

const TaskDetail = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const { id } = router.query;
  const [tutorData, setTutorData] = useState(null);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(true)
  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    getATutor(token, id)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTutorData(data.user);
        } else {
          setErr(data.message);
        }
      })
      .catch((err) => {
        setErr("Something went wrong");
      })
      .finally(()=>{
       
        setIsLoading(false)
      });
  }, [id]);
 
  return (
    <>
      <Head>
        <title>Account | Temaribet</title>
      </Head>
      <Backdrop
         sx={{ color: '#fff', backgroundColor: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
            <Grid item lg={4} md={3} xs={12}>
              <TutorProfile user={tutorData} />
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <Card>
                <CardContent>
                <Grid item lg={12} md={12} xs={12}>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      
                    }}
                    minHeight={300}
                  >
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      Essay
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {tutorData?.essay}
                    </Typography>
                  </Box>
                  </Grid>
                </CardContent>
              </Card>
              <br></br>
              {/* <Card>
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
                      Preferred Bank: {tutorData?.preferredBank}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Account Number: {tutorData?.bankAccountNo}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <br></br>

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
                      Contact's Information
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Name: {tutorData?.contactName}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Phone Number: {tutorData?.contactPhone1}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Other Phone No.:{tutorData?.contactPhone2}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Email: {tutorData?.contactEmail}
                    </Typography>
                  </Box>
                </CardContent>
              </Card> */}
            </Grid>
          </Grid>
          <Grid container mt={2} spacing={3} >
            <Grid  item lg={6} md={6} xs={12}  >
          <Card>
                <CardContent>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    minHeight={150}
                  >
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      Bank Information
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Preferred Bank: {tutorData?.preferredBank}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Account Number: {tutorData?.bankAccountNo}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              </Grid>
              <Grid minHeight={150}  item lg={6} md={6} xs={12}  >
              <Card >
                <CardContent>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    minHeight={150}
                  >
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      Contact's Information
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Name: {tutorData?.contactName}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Telegram Username: {tutorData?.telegramUsername}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Phone Number: {tutorData?.contactPhone1}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Other Phone No.:{tutorData?.contactPhone2}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Contact's Email: {tutorData?.contactEmail}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              </Grid>
          </Grid>
          {/* <Typography sx={{ mb: 3 }} variant="h4">
            Reports
          </Typography>
          <Grid container spacing={3}> */}
            {/* {tutorData?.reports.map((report, index) => {
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
                        <Typography color="textPrimary" gutterBottom variant="h5">
                          Report {index + 1} - {moment(report.reportdate).format("MM/DD/YYYY")}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Professionality: {report.professionality}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Total Hour Tutored: {report.semiTotalHour}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          No. of Days: {report.noDays}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Tutored Subjects: {report.subjects.toString()}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Covered Topics: {report.topics}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Enviromental Challenge: {report.envChallenge}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Enviromental Response: {report.envResponse}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Enviromental Help: {report.envHelp}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Enviromental Challenge: {report.envChallenge}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Enviromental Response: {report.envResponse}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Enviromental Help: {report.envHelp}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Tutee Challenge: {report.tuteeChallenge}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Tutee Response: {report.tuteeResponse}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Tutee Help: {report.tuteeHelp}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Your Challenge: {report.yourChallenge}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Your Response: {report.yourResponse}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Your Help: {report.yourHelp}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Feedback: {report.feedback}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Feedback: {report.feedback}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Quiz: {report.quiz}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Assignment: {report.assg}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          Test: {report.test}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ); */}
            {/* })} */}
          {/* </Grid> */}
         
          <Stack sx={{ m:2}} direction="row" spacing={2}>
          <Button
             
            variant="contained"
            color="success"
            disabled={isLoading} 
            onClick={() => {
                setIsLoading(true)
              deleteParent(token, id)
              .finally(()=>{
                router.push('/parents');
              });
              
            }}
          >
           Delete permanently
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={isLoading}
            onClick={() => {
                setIsLoading(true)
              
              updateParent(token, id, { status: "SUCCESS"}).finally(()=>{
                router.push('/parents/profile/'+id)
              });
             
            }}
          >
          Pardon 
          </Button>
        </Stack>
        </Container>
      </Box>
    </>
  );
};

TaskDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TaskDetail;
