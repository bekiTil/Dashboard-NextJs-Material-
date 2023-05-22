import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  InputLabel,
  MenuItem,
  Select,
  Box,
  CardContent,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Avatar,
  Chip,
  Badge,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { ReportListResults } from "../components/report/report-list-results";
import { ReportListToolbar } from "../components/report/report-list-toolbars";
import { DashboardLayout } from "../components/dashboard-layout";
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import { getReports, getReportsBasedOnWeek } from "../../backend-utils/report-utils";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { DeleteOutlined, MoreHorizSharp } from "@mui/icons-material";
import { getInitials } from "src/utils/get-initials";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { data } from "autoprefixer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MailIcon from "@mui/icons-material/Mail";

const Reports = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const user = useSelector(selectUser);
  const [reports, setReports] = useState(null);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [Week1, setFirstWeek] = useState([]);
  const [Week2, setSecondWeek] = useState([]);
  const [Week3, setThirdWeek] = useState([]);
  const [Week4, setFourthWeek] = useState([]);
  const [Week5, setFiveWeek] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [WeeklyReport, setWeeklyReport] = useState([]);
  const [totalWeeks, setTotalWeeks] = useState([]);
  const [tempWeeks, setTempWeeks] = useState([]);
  const [selectMonth, setSelectedMonth] = useState(currentMonth);
  const [statusReport, setStatusReport] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [monthNotify, setMonthNotify] = useState([]);
  const [totalEvery, setTotalEvery]= useState([])
  const [weekIndex, setWeekIndex] = useState(0);
  const monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = new Date();
  const [monthIndex, setMonthIndex] = useState(d.getMonth());
  const handleOpen = (truthValue, weekRepo = []) => {
    console.log(truthValue);
    console.log(weekRepo, value);
    setWeeklyReport(weekRepo);
    setTempWeeks(weekRepo);
  };
  const getDay = (date) => {
    // get day number from 0 (monday) to 6 (sunday)
    let day = date.getDay();
    if (day == 0) day = 7; // make Sunday (0) the last day
    return day - 1;
  };
  const createCalander = async (year, month, newData) => {
    let data = [];
    console.log(newData, "createCalander");
    let mon = month - 1;
    let d = new Date(year, mon);
    let temp = [];
    console.log(d.getMonth(), mon);
    while (d.getMonth() == mon) {
      temp.push(d.getDate());
      if (getDay(d) % 7 == 6) {
        // sunday, last day of week - newline

        data.push([temp[0], temp[temp.length - 1]]);
        temp = [];
      }

      d.setDate(d.getDate() + 1);
    }
    if (temp.length > 0) {
      data.push([temp[0], temp[temp.length - 1]]);
      temp = [];
    }

    setWeeks(data);

    return [data, newData];
  };
  const [pendingCounts, setPendingCounts] = useState({});
  const updatePendingCounts = (report) => {
    const tutorWeekKey = `${report.tutorId}${report.week}`;
    console.log(tutorWeekKey,"HI find");
    const currentCount = pendingCounts[tutorWeekKey] || 0;
    const newCount = report.status === 'PENDING' ? currentCount + 1 : currentCount;
    setPendingCounts({
      ...pendingCounts,
      [tutorWeekKey]: newCount,
    });
  };

  const assignReporWithValidWeek = (newData, week) => {
    console.log(newData, week);
    let firstData = [];
    let secondData = [];
    let thirdData = [];
    let fourthData = [];
    let fiveData = [];
    let first_Data = [];
    let second_Data = [];
    let third_Data = [];
    let fourth_Data = [];
    let five_Data = [];
    let firstNo = Number(0);
    let secondNo = Number(0);
    let thirdNo = Number(0);
    let fourthNo = Number(0);
    let fiveNo = Number(0);
    let total = [];
    let totals = [];
    console.log(reports);
    console.log(total);
    console.log(week);
    const uniqueTutorIds = [];
    newData.map((report) => {
      const date = report.reportDate;
      if (date >= week?.[0]?.[0] && date <= week?.[0]?.[1]) {
        if (!uniqueTutorIds.includes(report.tutorId + report.week)) {
          uniqueTutorIds.push(report.tutorId + report.week);
          firstData.push(report);
        }

        if (report.status == "PENDING") {
          firstNo = Number(firstNo) + 1;
        }
        updatePendingCounts(report);
        first_Data.push(report)
      } else if (date >= week?.[1]?.[0] && date <= week?.[1]?.[1]) {
        if (!uniqueTutorIds.includes(report.tutorId + report.week)) {
          uniqueTutorIds.push(report.tutorId + report.week);
          secondData.push(report);
        }
        if (report.status == "PENDING") {
          secondNo = Number(secondNo) + 1;
        }
        updatePendingCounts(report);
        second_Data.push(report)
      } else if (date >= week?.[2]?.[0] && date <= week?.[2]?.[1]) {
        if (!uniqueTutorIds.includes(report.tutorId + report.week)) {
          uniqueTutorIds.push(report.tutorId + report.week);
          thirdData.push(report);
        }
        if (report.status == "PENDING") {
          thirdNo = Number(thirdNo) + 1;
        }
        updatePendingCounts(report);
        third_Data.push(report);
      } else if (date >= week?.[3]?.[0] && date <= week?.[3]?.[1]) {
        if (!uniqueTutorIds.includes(report.tutorId + report.week)) {
          uniqueTutorIds.push(report.tutorId + report.week);

          fourthData.push(report);
        }
        if (report.status == "PENDING") {
          fourthNo = Number(fourthNo) + 1;
        }
        updatePendingCounts(report);
        fourth_Data.push(report);
      } else {
        if (!uniqueTutorIds.includes(report.tutorId + report.week)) {
          uniqueTutorIds.push(report.tutorId + report.week);
          fiveData.push(report);
        }
        if (report.status == "PENDING") {
          fiveNo = Number(fiveNo) + 1;
        }
        updatePendingCounts(report);
        five_Data.push(report);
      }
    });
    total.push(firstData);
    total.push(secondData);
    total.push(thirdData);
    total.push(fourthData);
    total.push(fiveData);
    totals.push(first_Data);
    totals.push(second_Data);
    totals.push(third_Data);
    totals.push(fourth_Data);
    totals.push(five_Data);
    console.log(total);
    let notifArr = [];
    notifArr.push(firstNo);
    notifArr.push(secondNo);
    notifArr.push(thirdNo);
    notifArr.push(fourthNo);
    notifArr.push(fiveNo);
    setTotalWeeks(total);
    console.log(total,"total");
    setMonthNotify(notifArr);
    setTotalEvery(totals);
    console.log(weeks);
  };
  const router = useRouter();
  if (!user) router.push("/login");
  useEffect(() => {
    let d = new Date();
    let month = d.getMonth() + 1;
    let year = 2023;
   

    getReportsBasedOnWeek(user.accessToken, year, month)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data.reports);
          setReports(data.reports);
          return data.reports;
        } else {
          setErr(data.message);
          return [];
        }
      })
      .then((newData) => createCalander(year, month, newData))
      .then((newData) => assignReporWithValidWeek(newData[1], newData[0]))
      .then(() => setMonthIndex(month - 1))
      .catch((_) => {
        setErr("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    handleOpen(totalWeeks, totalWeeks[value]);
  }, [totalWeeks]);

  useEffect(() => {
    let d = new Date();
    let month = selectMonth;
    let year = d.getFullYear();
    setPendingCounts({});

    getReportsBasedOnWeek(user.accessToken, year, month)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data.reports, "data success");
          setReports(data.reports);
          return data.reports;
        } else {
          setErr(data.message);
          return [];
        }
      })
      .then((newData) => createCalander(year, month, newData))
      .then((newData) => assignReporWithValidWeek(newData[1], newData[0]))
      .then(() => setMonthIndex(month - 1))
      .catch((_) => {
        setErr("Something went wrong");
      });
  }, [selectMonth]);

  useEffect(() => {
    let data = [];
    if (totalEvery.length > 0) {
      
      const uniqueTutorIds = [];
      totalEvery[weekIndex].map((report) => 
        {
         
          if (statusReport == 2 && report.status == "SUCCESS") {
             if (!uniqueTutorIds.includes(report.tutorId)) {
              data.push(report)
             
              uniqueTutorIds.push(report.tutorId);
             
            }
            
          } else if (statusReport == 3 &&  report.status == "PENDING") {
            if (!uniqueTutorIds.includes(report.tutorId)) {
              data.push(report)
             
              uniqueTutorIds.push(report.tutorId);
             
            }
          } else if (statusReport == 4 && report.status == "REJECTED") {
            if (!uniqueTutorIds.includes(report.tutorId)) {
              data.push(report)
             
              uniqueTutorIds.push(report.tutorId);
             
            }
          }
        }
      );
      
      if (statusReport !=1){
        setTempWeeks(data)
      }
      else{
          if (totalWeeks[weekIndex])
          {
          setTempWeeks(totalWeeks[weekIndex])
          }
      }

    }},
        
  
   [statusReport]);
   const countNotification = (tutorId) => {
    var count = 0;
    console.log(tutorId)
    totalEvery[weekIndex]?.map((val) => {
      if (val.tutorId == tutorId) {
        if (val.status == "PENDING") {
          count += 1;
        }
      }
    });
  
    return count;
  };
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Head>
        <title>Reports | Temaribet</title>
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
          <ReportListToolbar name="Reports" setSearchTerm={setSearchTerm} />
          <Box
            m={1}
            //margin
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Grid marginX={2}>
              <Typography fontWeight="bold">Status</Typography>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                name="statusReport"
                margin="normal"
                value={statusReport}
                label="Hours Per Day"
                sx={{ marginLeft: "auto" }}
                onChange={(event) => setStatusReport(event.target.value)}
              >
                <MenuItem value={1}>All</MenuItem>
                <MenuItem value={2}>Accepted</MenuItem>
                <MenuItem value={3}>Pending</MenuItem>
                <MenuItem value={4}>Rejected</MenuItem>
              </Select>
            </Grid>
            <Grid>
              <Typography fontWeight="bold">Choose Month</Typography>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                name="selectMonth"
                margin="normal"
                value={selectMonth}
                label="Hours Per Day"
                sx={{ marginLeft: "auto" }}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                <MenuItem value={1}>January</MenuItem>
                <MenuItem value={2}>February</MenuItem>
                <MenuItem value={3}>March</MenuItem>
                <MenuItem value={4}>April</MenuItem>
                <MenuItem value={5}>May</MenuItem>
                <MenuItem value={6}>June</MenuItem>
                <MenuItem value={7}>July</MenuItem>
                <MenuItem value={8}>August</MenuItem>
                <MenuItem value={9}>September</MenuItem>
                <MenuItem value={10}>October</MenuItem>
                <MenuItem value={11}>November</MenuItem>
                <MenuItem value={12}>December</MenuItem>
              </Select>
            </Grid>
          </Box>
          <Grid></Grid>

          <div className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-md">
            <Tabs
              value={value}
              sx={{
                paddingLeft: 2,
              }}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {weeks.map((week, index) => {
                return (
                  <Tab
                    sx={{
                      paddingX: 4,
                    }}
                    fullWidth={true}
                    icon={
                      <Badge badgeContent={Number(monthNotify[index])} color="secondary">
                        {" "}
                        <MailIcon color="action" />
                      </Badge>
                    }
                    label={`${monthName[monthIndex]} ${week[0]} - ${week[1]}`}
                    onClick={() =>{ 

                      setPage(0)
                      setLimit(10)
                      setWeekIndex(index);
                      handleOpen(totalWeeks, totalWeeks[index])}
                    
                    }
                  ></Tab>

                  //   {/* <Button
                  //   fullWidth

                  //     onClick={() => handleOpen(totalWeeks, totalWeeks[index])}
                  //     startIcon={<AssignmentLateRoundedIcon />}
                  //     sx={{

                  //     }}

                  //   >
                  //     <p className="text-xs "></p>
                  //   </Button> */}
                  // </ToggleButton>
                );
              })}
            </Tabs>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                 
                  <TableCell>Pendings</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tempWeeks.length > 0 &&
                  tempWeeks
                  
                    .filter((val) => {
                      if (searchTerm == "") {
                        return val;
                      } else if (val.tutorName.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return val;
                      }
                    })
                    .slice((limit*page), (limit)*(page+1))
                    .map((report, index) => {
                      return (
                        <>
                          <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              <Box
                                sx={{
                                  alignItems: "center",
                                  display: "flex",
                                }}
                              >
                                <Avatar
                                  // src={customer.avatarUrl}
                                  sx={{ mr: 2 }}
                                >
                                  {getInitials(report.tutorName)}
                                </Avatar>
                                <Typography color="textPrimary" variant="body1">
                                  {report.tutorName}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                           { countNotification(report.tutorId) }
                            </TableCell>
                            {/* <TableCell>
                              {pendingCounts[report.tutorId+report.week]  "SUCCESS" && (
                                <Chip variant="outlined" label="SUCCESS" color="success" />
                              )}
                              {report.status === "REJECTED" && (
                                <Chip variant="outlined" label="REJECTED" color="error" />
                              )}
                              {report.status === "PENDING" && (
                                <Chip variant="outlined" label="PENDING" color="primary" />
                              )}
                            </TableCell> */}
                            <TableCell align="right">
                              <IconButton
                                color="info"
                                aria-label="upload picture"
                                component="span"
                                onClick={() => {
                                  router.push({
                                    pathname: "/report/detail",
                                    query: {
                                      tutorId: report.tutorId,
                                      year: report.reportYear,
                                      month: report.reportMonth,
                                      week: report.week,
                                    },
                                  });
                                }}
                              >
                                <MoreHorizSharp />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                {WeeklyReport.length === 0 && (
                  <Typography align="center" p={2}>
                    NO REPORT FOR THIS WEEK
                  </Typography>
                )}
              </TableBody>
            </Table>
          </TableContainer>
      <TablePagination
        component="div"
        count={tempWeeks.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
        </Container>
      </Box>
    </>
  );
};
Reports.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Reports;
