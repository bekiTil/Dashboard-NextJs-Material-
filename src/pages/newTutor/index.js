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
import { getPendingTutors } from "backend-utils/tutor-utils";

const NewTutors = () => {
  const user = useSelector(selectUser);
  const [tutors, setTutors] = useState([]);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  if (!user) {
    dispatch(logout());
    router.push("/login");
  }
  useEffect(() => {
    getPendingTutors(user.accessToken)
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
      });
  }, []);

  return (
    <>
      <Head>
        <title>Tutors | Temaribet</title>
      </Head>
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
NewTutors.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NewTutors;
