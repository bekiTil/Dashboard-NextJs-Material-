import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { AccountProfile } from "/src/components/account/account-profile";
import { DashboardLayout } from "/src/components/dashboard-layout";
import { useRouter } from "next/router";
import { CreateTutorAccountForm } from "src/components/tutor/create-tutor-accout";
import { selectUser } from "redux/userSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getATutor } from "backend-utils/tutor-utils";
const CreateTutorAccount = () => {
  const user = useSelector(selectUser);

  const router = useRouter();
  const { tid } = router.query;
  const [tutor, setTutor] = useState(null);
  const [err, setErr] = useState("");
  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    getATutor(token, tid)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.success) {
          setTutor(data.user);
        } else {
          setErr(data.message);
        }
      })
      .catch((err) => {
        setErr("Something went wrong");
      });
  }, [tid]);

  return (
    <>
      <Head>
        <title>Create Tutor | Temaribet</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Create Tutor
          </Typography>
          <Grid container spacing={3}>
            {/* <Grid item lg={4} md={6} xs={12}>
              <AccountProfile />
            </Grid> */}
            <Grid item lg={12} md={12} xs={12}>
              <CreateTutorAccountForm tutor={tutor} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

CreateTutorAccount.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateTutorAccount;
