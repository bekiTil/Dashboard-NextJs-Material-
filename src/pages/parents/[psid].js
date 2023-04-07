import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createParent } from "backend-utils/parent-utils";
import { createStudent } from "backend-utils/student-utils";
import { DashboardLayout } from "src/components/dashboard-layout";
import { useSelector } from "react-redux";
import { selectUser } from "redux/userSlice";

import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Box,
  Item,
  Button,
  Tabs,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  Tab,
  Typography,
  Grid,
  MenuItem,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from "@mui/material";

import TextField from "@mui/material/TextField";
import { Router } from "@mui/icons-material";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const IndividualStudentRegistration = () => {
  const router = useRouter();
  const { psid } = router.query;
  const [studnets, setStudentField] = useState([
    {
      studentName: "",
      age: 0,
      gender: "M",
      grade: "",
      schoolName: "",
      workDays: 0,
      workHour: 0,
      subjects: [],
    },
  ]);

  const user = useSelector(selectUser);
  const createStudentParent = () => {
    event.preventDefault()
    setIsLoading(true);
    studnets.map((val) =>
      createStudent(user.accessToken, {
        fullName: val.studentName,
        gender: val.gender,
        address: "",
        age: parseInt(val.age),
        grade: val.grade,
        hobby: null,
        idealTutor: null,
        nickName: null,
        parentId: psid,
        prevTutorExperience: null,
        prevTutored: null,
        school: val.schoolName,
        subjects: val.subjects,
        workDays: parseInt(val.workDays),
        workHour: parseInt(val.workHour),
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        .finally(() => {
        
         
          router.push("/parents/profile/" + psid);
        })
    );
  };
  const handleStudentField = (event, index) => {
    let data = [...studnets];
    console.log(data);

    if (event.target.name == "subjects") {
      const {
        target: { value },
      } = event;
      console.log(value);
      if (typeof value === "string") {
        data[index].subjects = value.split(",");
      } else {
        data[index].subjects = value;
      }
      console.log();

      // console.log(event.target.value)
      // data[index].subjects.push(event.target.value)
    } else {
      data[index][event.target.name] = event.target.value;
    }
   
    setStudentField(data);
  };
  const [isLoading, setIsLoading] = useState(false);
  const subjects = [
    "Physics",
    "Maths",
    "Chemistry",
    "Biology",
    "Histroy",
    "Geography",
    "Amharic",
    "English",
    "Programming",
  ];

  return (
    <>
      <div>
        <Box
          component="main"
          boxShadow={10}
          sx={{
            flexGrow: 1,
            py: 10,
            px: 10,
          }}
        >
          <div className="justify-center px-10 font-minionPro md:flex  md:px-16 ">
            {studnets.map((val, index) => {
              return (
                <form method="post" onSubmit={createStudentParent}>
                  <div key={index}>
                    <Box
                      sx={{
                        boxShadow: 1,

                        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#101010" : "#fff"),
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "black.300" : "grey.800",
                        p: 4,
                        my: 3,
                        borderRadius: 2,
                      }}
                    >
                      <Typography fontWeight="bold" variant="h5">
                        Child Information (Child {index + 1})
                      </Typography>

                      <Grid container p={2} rowSpacing={1} spacing={2} columnSpacing={2}>
                        <Grid item xs={16} md={8} lg={3}>
                          <InputLabel id="demo-select-small">Child Name</InputLabel>
                          <TextField
                            fullWidth
                            required
                            margin="normal"
                            name="studentName"
                            onChange={(event) => handleStudentField(event, index)}
                            value={val.studentName}
                          />
                        </Grid>
                        <Grid item xs={16} md={8} lg={3}>
                          <InputLabel id="demo-select-small">Age</InputLabel>
                          <TextField
                            fullWidth
                            required
                            margin="normal"
                            name="age"
                            InputProps={{
                              inputProps: { min: 0 },
                            }}
                            onChange={(event) => handleStudentField(event, index)}
                            value={val.age}
                            type="number"
                          />
                        </Grid>
                        <Grid item xs={16} md={8} lg={3}>
                          <InputLabel
                            sx={{
                              pb: 2,
                              font: "inherit",
                            }}
                            id="demo-select-small"
                          >
                            Gender
                          </InputLabel>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            name="gender"
                            margin="normal"
                            required
                            value={val.gender}
                            label="gender"
                            fullWidth
                            onChange={(event) => handleStudentField(event, index)}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                          </Select>
                        </Grid>

                        <Grid item xs={16} md={8} lg={3}>
                          <InputLabel
                            sx={{
                              pb: 2,
                              font: "inherit",
                            }}
                            id="demo-select-small"
                          >
                            Grade
                          </InputLabel>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            name="grade"
                            margin="normal"
                            value={val.grade}
                            required
                            label="grade"
                            fullWidth
                            onChange={(event) => handleStudentField(event, index)}
                          >
                            <MenuItem value="K-G">KG</MenuItem>
                            <MenuItem value="1">G-1</MenuItem>
                            <MenuItem value="2">G-2</MenuItem>
                            <MenuItem value="3">G-3</MenuItem>
                            <MenuItem value="4">G-4</MenuItem>
                            <MenuItem value="5">G-5</MenuItem>
                            <MenuItem value="6">G-6</MenuItem>
                            <MenuItem value="7">G-7</MenuItem>
                            <MenuItem value="8">G-8</MenuItem>
                            <MenuItem value="9">G-9</MenuItem>
                            <MenuItem value="10">G-10</MenuItem>
                            <MenuItem value="11">G-11</MenuItem>
                            <MenuItem value="12">G-12</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={16} md={8} lg={3}>
                          <InputLabel id="demo-select-small">School Name</InputLabel>
                          <TextField
                            fullWidth
                            margin="normal"
                            name="schoolName"
                            required
                            onChange={(event) => handleStudentField(event, index)}
                            value={val.schoolName}
                          />
                        </Grid>
                      </Grid>
                      <Typography fontWeight="bold" variant="h5">
                        Tutorial Detail
                      </Typography>

                      <Grid container p={2} rowSpacing={1} spacing={2} columnSpacing={2}>
                        <Grid item xs={16} md={8} lg={3}>
                          <InputLabel
                            sx={{
                              pb: 2,
                              font: "inherit",
                            }}
                            id="demo-select-small"
                          >
                            Days per Week
                          </InputLabel>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            name="workDays"
                            margin="normal"
                            value={val.workDays}
                            required
                            label="Hours Per Day"
                            fullWidth
                            onChange={(event) => handleStudentField(event, index)}
                          >
                            <MenuItem value={1}>1 Day</MenuItem>
                            <MenuItem value={2}>2 Days</MenuItem>
                            <MenuItem value={3}>3 Days</MenuItem>
                            <MenuItem value={4}>4 Days</MenuItem>
                            <MenuItem value={5}>5 Days</MenuItem>
                            <MenuItem value={6}>6 Days</MenuItem>
                            <MenuItem value={7}>7 Days</MenuItem>
                            <MenuItem value={8}>8 Days</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={16} md={8} lg={3}>
                          <InputLabel
                            sx={{
                              pb: 2,
                              font: "inherit",
                            }}
                            id="demo-select-small"
                          >
                            Hours Per Day
                          </InputLabel>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            name="workHour"
                            margin="normal"
                            value={val.workHour}
                            required
                            label="Hours Per Day"
                            fullWidth
                            onChange={(event) => handleStudentField(event, index)}
                          >
                            <MenuItem value={1}>1 Hour</MenuItem>
                            <MenuItem value={2}>2 Hour</MenuItem>
                            <MenuItem value={3}>3 Hour</MenuItem>
                            <MenuItem value={4}>4 Hour</MenuItem>
                            <MenuItem value={5}>5 Hour</MenuItem>
                            <MenuItem value={6}>6 Hour</MenuItem>
                            <MenuItem value={7}>7 Hour</MenuItem>
                            <MenuItem value={8}>8 Hour</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={16} md={8} lg={3}>
                          <InputLabel
                            sx={{
                              pb: 2,
                            }}
                            id="demo-multiple-chip-label"
                          >
                            Subjects
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            margin="normal"
                            fullWidth
                            name="subjects"
                            value={val.subjects}
                            required
                            onChange={(event) => handleStudentField(event, index)}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {subjects.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                    </Box>
                  </div>
                  <button
                    class=" focus:shadow-outline w-1/2 rounded-xl bg-[#1A3765] py-2 px-4 font-bold text-white disabled:bg-[#6793d9] hover:bg-[#6793d9] focus:outline-none md:w-1/4 md:text-xl"
                    type="submit"
                    disabled={isLoading}
                  >
                    Submit
                  </button>
                </form>
              );
            })}
          </div>
        </Box>
      </div>
    </>
  );
};

IndividualStudentRegistration.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default IndividualStudentRegistration;
