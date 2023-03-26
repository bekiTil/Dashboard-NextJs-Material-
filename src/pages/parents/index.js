import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { Box, Container } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";

import { getParents,getPendingParents } from "backend-utils/parent-utils";
import { useSelector } from "react-redux";
import { selectUser } from "redux/userSlice";
import { ParentListResults } from "src/components/parent/parent-list-results";
import { ParentListToolbar } from "src/components/parent/parent-list-toolbar";
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
const Parents = () => {
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true)
  const [parents, setParents] = useState([]);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  if (!user) router.push("/login");
  useEffect(() => {
    getParents(user.accessToken)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data)
          setParents(data.users);
        } else {
          setErr(data.message);
        }
      })
      .catch((_) => {
        setErr("Something went wrong");
      })
      .finally(()=>{
        setIsLoading(false)
      })
      ;
  }, []);


  

  return (
    <>
      <Head>
        <title>Parents | Temaribet</title>
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
        <Container maxWidth={false}>
          <ParentListToolbar
            name="Parents"
            setSearchTerm={setSearchTerm}
            route="/parents/create-parent"
          />
          <Box sx={{ mt: 3 }}>
            <ParentListResults customers={parents} searchTerm={searchTerm} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Parents.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Parents;
