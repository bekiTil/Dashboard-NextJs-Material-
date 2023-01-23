import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { Box, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "redux/userSlice";
import { getTutors } from "backend-utils/tutor-utils";
import { DashboardLayout } from "src/components/dashboard-layout";
import { CustomerListResults } from "src/components/customer/customer-list-results";
import { CustomerListToolbar } from "src/components/customer/customer-list-toolbar";
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const Tutors = () => {
  const user = useSelector(selectUser);
  const [tutors, setTutors] = useState([]);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();
  const dispatch = useDispatch();
  if (!user) {
    dispatch(logout());
    router.push("/login");
  }
  useEffect(() => {
    getTutors(user.accessToken)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTutors(data.users);
        } else {
          setErr(data.message);
        }
      })
      .catch((_) => {
        setErr("Something went wrong");
      }).finally(()=>{
        setIsLoading(false)
      });
  }, []);

  return (
    <>
      <Head>
        <title>Tutors | Temaribet</title>
      </Head>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar name="Tutors" setSearchTerm={setSearchTerm} />
          <Box sx={{ mt: 3 }}>
            <CustomerListResults customers={tutors} searchTerm={searchTerm} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
Tutors.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Tutors;
