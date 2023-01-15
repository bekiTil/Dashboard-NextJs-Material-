import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { AccountProfile } from "/src/components/account/account-profile";
import { DashboardLayout } from "/src/components/dashboard-layout";
import { useRouter } from "next/router";
import { CreateParentAccountForm } from "src/components/parent/create-parent-account";
import { selectUser } from "redux/userSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAParent } from "backend-utils/parent-utils";
const CreateParentAccount = () => {
  const user = useSelector(selectUser);

  const router = useRouter();
  const { pid } = router.query;
  const [parent, setParent] = useState(null);
  const [err, setErr] = useState("");
  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    getAParent(token, pid)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setParent(data.user);
        } else {
          setErr(data.message);
        }
      })
      .catch((err) => {
        setErr("Something went wrong");
      });
  }, [pid]);

  return (
    <>
      <Head>
        <title>Create Parent | Temaribet</title>
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
            Create Parent
          </Typography>
          <Grid container spacing={3}>
            {/* <Grid item lg={4} md={6} xs={12}>
              <AccountProfile />
            </Grid> */}
            <Grid item lg={12} md={12} xs={12}>
              <CreateParentAccountForm parent={parent} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

CreateParentAccount.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateParentAccount;
