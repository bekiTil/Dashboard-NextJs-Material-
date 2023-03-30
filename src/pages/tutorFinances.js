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
import { current } from "@reduxjs/toolkit";
import { getTimeSheetsBasedOnMonth } from "backend-utils/tutor-utils";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from '@mui/material/Backdrop';


const TutorFinance = () => {
  const [value, setValue] = useState(0);
  const [loadingOpen, setLoadingOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const months = [
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
  const currentDate = new Date();
  const [isLoading, setIsLoading] = useState(true)
  const currentYear = currentDate.getFullYear();
  const user = useSelector(selectUser);
  const [timeSheets, setTimeSheets] = useState(null);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [Week1, setFirstWeek] = useState([]);
  const [Week2, setSecondWeek] = useState([]);
  const [Week3, setThirdWeek] = useState([]);
  const [Week4, setFourthWeek] = useState([]);
  const [Week5, setFiveWeek] = useState([]);
  const [WeeklyReport, setWeeklyReport] = useState([]);
  const [totalWeeks, setTotalWeeks] = useState([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentDate.getMonth-1);
  const [totalMonths, setTotalMonths] = useState([]);
  const [tempWeeks, setTempWeeks] = useState([]);
  const [selectYear, setSelectedYear] = useState(currentYear);
  const [statusReport, setStatusReport] = useState(1);
  const years = [];
  for (let year = 2023; year <= 2050; year++) {
    years.push(year);
  }

  const d = new Date();
  const [yearIndex, setyearIndex] = useState(d.getFullYear());
  // const handleOpen = (truthValue, weekRepo = [], index) => {
  //   console.log(truthValue);
  //   console.log(weekRepo);
  //   setWeeklyReport(weekRepo);
  //   setTempWeeks(weekRepo);
  //   setSelectedMonthIndex(index);
  // };
  const handleOpen = (truthValue, weekRepo = [], index) => {
    console.log("finsed");
    console.log(truthValue);
    console.log(weekRepo);
    setLoadingOpen(true);
    if (weekRepo.length == 0) {
      setLoadingOpen(false);
    }
    if (weekRepo == WeeklyReport) {
      console.log("");
      setLoadingOpen(true);
    }
    setWeeklyReport(weekRepo);
    setTempWeeks(weekRepo);
    setSelectedMonthIndex(index);
    console.log(loadingOpen, "segermer");
  };
  useEffect(() => {
    setLoadingOpen(false);
    console.log(loadingOpen, "sealke");
  }, [WeeklyReport]);

  useEffect(() => {
    handleOpen(totalWeeks, totalWeeks[selectedMonthIndex], selectedMonthIndex);

    console.log(loadingOpen, "sealke, ks");
  }, [totalWeeks]);
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

  const assignTimeSheetWithValidMonth = (newData) => {
    console.log(newData);
    const arrOfMonth = Array.from({ length: 12 }, () => []);
    const arrOfFilterdMonth = Array.from({ length: 12 }, () => []);

    const uniqueTutorIds = [];
    newData.map((timesheet) => {
      if (timesheet.statusOfAcceptance === "SUCCESS") {
        if (!uniqueTutorIds.includes(timeSheets?.tutorId)) {
          arrOfFilterdMonth[timesheet.month - 1].push(timesheet);
          uniqueTutorIds.push(timeSheets?.tutorId);
        }

        arrOfMonth[timesheet.month - 1].push(timesheet);
      }
    });
    console.log(arrOfFilterdMonth, "arr");

    setTotalWeeks(arrOfFilterdMonth);
    setTotalMonths(arrOfMonth);
  };
  const router = useRouter();
  if (!user) router.push("/login");
  // useEffect(() => {
  //   let d = new Date();
  //   let month = d.getMonth() + 1;
  //   let year = 2023;

  //   getTimeSheetsBasedOnMonth(user.accessToken, year)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success) {
  //         console.log(data.timeSheets);
  //         setTimeSheets(data.timeSheets);
  //         return data.timeSheets;
  //       } else {
  //         setErr(data.message);
  //         return [];
  //       }
  //     })
  //     .then((newData) => assignTimeSheetWithValidMonth(newData))

  //     .catch((_) => {
  //       setErr("Something went wrong");
  //     }).finally(()=>{
  //       setIsLoading(false)
  //     });
  //     ;
  // }, []);

  useEffect(() => {
    let d = new Date();

    

    getTimeSheetsBasedOnMonth(user.accessToken, selectYear)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data.timeSheets, "data success");
          setTimeSheets(data.timeSheets);
          return data.timeSheets;
        } else {
          setErr(data.message);
          return [];
        }
      })
      .then((newData) => assignTimeSheetWithValidMonth(newData))

      .catch((_) => {
        setErr("Something went wrong");
      }).finally( ()=>{
        setIsLoading(false)
      });;
  }, [selectYear]);

  return (
    <>
      <Head>
        <title>Tutor Finance | Temaribet</title>
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
          <ReportListToolbar name="Tutor Finance" setSearchTerm={setSearchTerm} />
          <Box
            m={1}
            //margin
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
          
            <Grid>
              <Typography fontWeight="bold">Choose Year</Typography>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                name="selectYear"
                margin="normal"
                fullWidth
                value={selectYear}
                label="Hours Per Day"
                sx={{ marginLeft: "auto" }}
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {years.map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
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
              {months.map((month, index) => {
                return (
                  <Tab
                    sx={{
                      paddingX: 4,
                    }}
                    fullWidth={true}
                    label={`${month}`}
                    onClick={() => handleOpen(totalWeeks, totalWeeks[index], index)}
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
                  <TableCell align="right" >Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              {loadingOpen ? (
                <div
                  className = "py-10"
                  style={{ alignItems: "center", display: "flex", justifyContent: "center"}}
                >
                  <CircularProgress />
                </div>
              ) : (
              <TableBody>
                {tempWeeks.length > 0 &&
                  tempWeeks
                    .slice(0, 10)
                    .filter((val) => {
                      if (searchTerm == "") {
                        return val;
                      } else if (
                        val.tutor?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
                      ) {
                        return val;
                      }
                    })

                    .map((timeSheets, index) => {
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
                                  {getInitials(timeSheets.tutor?.fullName)}
                                </Avatar>
                                <Typography color="textPrimary" variant="body1">
                                  {timeSheets.tutor?.fullName}
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell align="right">
                              <IconButton
                                color="info"
                                aria-label="upload picture"
                                component="span"
                                onClick={() =>
                                  router.push({
                                    pathname: "/tutorFinance",
                                    query: {
                                      tutorId: timeSheets.tutorId,
                                      myObject: JSON.stringify(totalMonths[selectedMonthIndex]),
                                    },
                                  })
                                }
                              >
                                <MoreHorizSharp />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                {WeeklyReport.length === 0 && (
                  <Typography justifyContent="center" align="center" p={2}>
                    NO TUTOR FINANCE  FOR THIS MONTH YET
                  </Typography>
                )}
              </TableBody>
              )}
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </>
  );
};
TutorFinance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TutorFinance;
