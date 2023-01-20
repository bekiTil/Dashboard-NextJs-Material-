import Head from "next/head";
import {
  Select,
  Avatar,
  Box,
  Button,
  TextField,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getATutor, getATutorwithLocation, getTutors } from "backend-utils/tutor-utils";
import moment from "moment";
import { getAParent } from "backend-utils/parent-utils";
import { DashboardLayout } from "src/components/dashboard-layout";
import { selectUser } from "redux/userSlice";
import { getAStudent, updateStudent } from "backend-utils/student-utils";
import { getAReport, UpdateAReport } from "backend-utils/report-utils";
import Reports from "../reports";
import Rating from "@mui/material/Rating";

const ReportDetail = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [report, setReportDetail] = useState(null);
  const { rid } = router.query;
  const [err, setErr] = useState("");

  if (user) {
    var token = user.accessToken;
  }
  useEffect(() => {
    getAReport(token, rid)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setReportDetail(data.user);
          console.log(data.user.reports.inputFields);
        } else {
          setErr(data.message);
        }
      })
      .catch((err) => {
        setErr("Something went Wrong");
      });
  }, [rid]);

  return (
    <Grid alignItems="center" m={2} p={2}>
      {report?.reports?.inputFields?.map((tutee, index) => {
        return (
          <div key={index} className="grid grid-cols-1 gap-4">
            <div className="flex flex-row">
              <div className="">
                <label className="col mt-2 text-lg font-semibold md:text-xl">Tutee Name</label>
                <br></br>
                <input
                  className="mr-1 w-full h-full rounded-lg border border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none md:w-3/4"
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required={true}
                  value={tutee.name}
                  disabled={true}
                />
              </div>
            </div>
            <div className=" w-fit my-10 border border-gray-200 rounded-lg shadow-md md:px-3 md:py-2 ">
              <div className="text-lg">On the Content</div>

              {tutee.subjects.map((sub, valu) => {
                return (
                  <div className=" mt-10  flex flex-row px-3 py-2">
                    <div className="col basis-1/4 mr-2 md:mr-0">
                      {index == 0 && valu == 0 && (
                        <div className=" inline-block w-fit md:w-2/3   rounded bg-[#1A3765] px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out">
                          Subject
                        </div>
                      )}
                      <input
                        className="mr-1 my-2 w-fit py-4 break-words rounded-lg text-xs border border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none"
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        disabled={true}
                        value={sub.subject}
                      />
                    </div>
                    <div className="col flex basis-3/4 flex-col">
                      {sub.chapters.map((chap, chapter_index) => {
                        return (
                          <div className="row flex flex-row" key={chapter_index}>
                            <div className="col mr-2 md:mr-0">
                              {index == 0 && valu == 0 && chapter_index == 0 && (
                                <div className=" w-fit  md:w-2/3 rounded bg-[#1A3765] px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out">
                                  {" "}
                                  Chapter
                                </div>
                              )}
                              <input
                                className="mr-1  my-2 w-fit py-4 break-words rounded-lg text-xs border border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none"
                                type="text"
                                placeholder="Chapter"
                                name="chapter"
                                disabled={true}
                                value={chap.chapter}
                              />
                            </div>
                            <div className="col flex basis-2/3 flex-col">
                              {chap.topics.map((top, topic_index) => {
                                return (
                                  <div className="row flex flex-row" key={topic_index}>
                                    <div className="col mr-2 md:mr-0">
                                      {index == 0 &&
                                        valu == 0 &&
                                        chapter_index == 0 &&
                                        topic_index == 0 && (
                                          <div className="w-fit md:w-2/3  rounded bg-[#1A3765] px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out">
                                            {" "}
                                            Topic
                                          </div>
                                        )}
                                      <input
                                        
                                        className="mr-1  my-2 w-fit py-4 break-words  text-xs rounded-lg border border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none"
                                        type="textarea"
                                        placeholder="Topic"
                                        value={top.topic}
                                        disabled={true}
                                        name="topic"
                                      />
                                    </div>
                                    <div className="col  mr-2 md:mx-1">
                                      {index == 0 &&
                                        valu == 0 &&
                                        chapter_index == 0 &&
                                        topic_index == 0 && (
                                          <div className=" w-fit md:w-2/3 rounded bg-[#1A3765] text-center py-2.5 text-xs  uppercase  text-white shadow-md ">
                                            Understanding
                                          </div>
                                        )}
                                      <input
                                        className="mr-1 my-2 w-fit py-4 break-words text-xs rounded-lg border border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none "
                                        type="text"
                                        placeholder="Understanding"
                                        disabled={true}
                                        value={top.understanding}
                                        name="understanding"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className=" w-fit my-10 border border-gray-200 rounded-lg shadow-md  md:px-3 md:py-2 ">
              <div className="text-lg">On Result</div>

              {tutee.assesments.map((asses, assesments_index) => {
                return (
                  <div className=" mt-10  flex flex-row px-3 py-2" key={assesments_index}>
                    <div className="col basis-1/4 mr-2 md:mr-0">
                      {assesments_index == 0 && (
                        <div className=" inline-block w-fit md:w-2/3  rounded bg-[#1A3765] px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out">
                          Subject
                        </div>
                      )}
                      <input
                        className="mr-1 my-2 w-fit py-4 break-words rounded-lg border text-xs border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none "
                        type="text"
                        placeholder="Subject"
                        disabled={true}
                        name="assesment"
                        value={asses.assesment}
                      />
                    </div>
                    <div className="col flex basis-3/4 flex-col">
                      {asses.units.map((uni, unit_index) => {
                        return (
                          <div className="row flex flex-row" key={unit_index}>
                            <div className="col  mr-2 md:mr-0 ">
                              {assesments_index == 0 && unit_index == 0 && (
                                <div className=" w-fit md:w-2/3  rounded bg-[#1A3765] px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out">
                                  {" "}
                                  Chapter
                                </div>
                              )}
                              <input
                                className="mr-1 my-2 w-fit py-4 break-words text-xs rounded-lg border border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none "
                                type="text"
                                name="unit"
                                placeholder="Chapter"
                                disabled={true}
                                value={uni.unit}
                              />
                            </div>
                            <div className="col flex basis-2/3 flex-col">
                              {uni.types.map((typ, type_index) => {
                                return (
                                  <div className="row flex flex-row" key={type_index}>
                                    <div className="col  mr-2 md:mr-0">
                                      {assesments_index == 0 &&
                                        unit_index == 0 &&
                                        type_index == 0 && (
                                          <div className=" mb-1  w-fit md:w-2/3  rounded bg-[#1A3765] px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out">
                                            {" "}
                                            Type
                                          </div>
                                        )}
                                      <input
                                    
                                        className="mr-1 my-2 w-fit py-4 break-words text-xs rounded-lg border border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none "
                                        type="text"
                                        placeholder="Type"
                                        value={typ.type}
                                        disabled={true}
                                        name="type"
                                      />
                                    </div>
                                    <div className="col mr-2 md:mr-0 ">
                                      {assesments_index == 0 &&
                                        unit_index == 0 &&
                                        type_index == 0 && (
                                          <div className=" mb-1  w-fit md:w-2/3  rounded bg-[#1A3765] px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out">
                                            Result
                                          </div>
                                        )}
                                      <input
                                        className="mr-1 my-2 w-fit py-4 break-words text-xs rounded-lg border border-gray-400 bg-gray-200 text-gray-700  transition duration-500 focus:border-gray-900 focus:outline-none "
                                        type="text"
                                        placeholder="Result"
                                        disabled={true}
                                        value={typ.result}
                                        name="result"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      
      { report?.status == "PENDING" && ( 
      <Box>
      <Typography component="legend">Rate the Report </Typography>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          report.rate = newValue;
          setValue(newValue);
        }}
      />
      </Box>
      )
}
      
           {report?.status == "PENDING" && (
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              report.status = "SUCCESS";
              UpdateAReport(token, rid, { status: "SUCCESS", rate: value });
            }}
          >
            Success
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              report.status = "FAILED";
              UpdateAReport(token, rid, { status: "FAILED", rate: value });
            }}
          >
            Reject
          </Button>
        </Stack>
      )}
      {report?.status == "FAILED" && <Alert severity="warning">Rejected</Alert>}
      {report?.status == "SUCCESS" && <Alert severity="success">Accepted</Alert>}
    </Grid>
  );
};

ReportDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ReportDetail;
