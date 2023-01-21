import Head from "next/head";
import { useRouter } from "next/router";

import { Box, Container, Grid } from "@mui/material";
import { Budget } from "../components/dashboard/budget";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { LatestProducts } from "../components/dashboard/latest-products";
import { Sales } from "../components/dashboard/sales";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { DashboardLayout } from "../components/dashboard-layout";
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../redux/userSlice";
import { useEffect, useState } from "react";
import { getTutors } from "backend-utils/tutor-utils";
import { getParents, numberByMonth } from "backend-utils/parent-utils";
import { getJobs } from "backend-utils/job-utils";
import { getReports } from "backend-utils/report-utils";
import { getNumberOfStudentsByGrade } from "backend-utils/student-utils";

const Dashboard = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [tutors, setTutors] = useState([]);
  const [parents, setParents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [reports, setReports] = useState([]);
  const [err, setErr] = useState("");
  const [gradeNumber,setGradeNumber] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [numberofParentWithMonth, setNumberOfParentWithMonth]= useState([])
  const dispatch = useDispatch();
  const  currentMonth=new Date().getMonth() ;

  if (user == null) {
    dispatch(logout());
    router.push("/login");
    return;
  } else {
    var token = user.accessToken;
    useEffect(() => {
      getTutors(token)
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
      getParents(token)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setParents(data.users);
          } else {
            setErr(data.message);
          }
        })
        .catch((_) => {
          setErr("Something went wrong");
        })
        .finally(
           ()=>{

          setIsLoading(false)
           }
        );
      getJobs(token)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setJobs(data.users);
          } else {
            setErr(data.message);
          }
        })
        .catch((_) => {
          setErr("Something went wrong");
        });
      getReports(token)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReports(data.users);
          } else {
            setErr(data.message);
          }
        })
        .catch((_) => {
          setErr("Something went wrong");
        });
        getNumberOfStudentsByGrade(token)
        .then((res)=>res.json())
        .then((data)=>{
          console.log(data)
          if (data.success){
            console.log(data.gradeNumber)
            setGradeNumber(data.gradeNumber)
        
          }
          else{ 
            setErr(data.message);          
          }
        })
        .catch((_) => {
          setErr("Something went wrong");
        });
      numberByMonth(token)
      .then((res)=>res.json())
      .then((data)=>{
        let temp= new Array(10).fill(0)
        let currentMonth = new Date().getMonth() 
        console.log(data,"new datas")
        if (data.success)
        {
          console.log(data,"helel")
          data.numberinMonths.map((value,index)=>{
            console.log(value)
            temp[value.month-1]=value.parentRegisterNumber
            console.log(temp)
          })
          
            console.log(temp,currentMonth)
            if (currentMonth>6){
              
              const value = temp.slice(currentMonth-6,currentMonth+1)
              console.log(value)
              setNumberOfParentWithMonth( temp.slice(currentMonth-6,currentMonth+1))
            }
            else{
              console.log("hi")
              
              setNumberOfParentWithMonth(temp.slice(0,7) )
            }
           
          console.log(temp,"heel")
          c
          
        }
        else{
          setErr(data.message);
        }
      })
      .catch((_)=>{
        setErr("Something went wrong");
      })
    }, []);
  }

  return (
    <>
      <Head>
        <title>Dashboard | Temaribet</title>
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
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={4} xs={12}>
              <Budget length={tutors.length} />
            </Grid>
            <Grid item xl={4} lg={3} sm={6} xs={12}>
              <TotalCustomers length={parents.length} />
            </Grid>
            {/* <Grid item xl={3} lg={3} sm={6} xs={12}>
              <TasksProgress length={jobs.length} />
            </Grid> */}
            <Grid item xl={4} lg={3} sm={6} xs={12}>
              <TotalProfit sx={{ height: "100%" }} length={reports.length} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <Sales months={numberofParentWithMonth} currentMonth={currentMonth} />
            </Grid>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <TrafficByDevice numbers={gradeNumber} sx={{ height: "100%" }} />
            </Grid>
            {/* <Grid item lg={4} md={6} xl={3} xs={12}>
              <LatestProducts sx={{ height: "100%" }} />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestOrders />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
