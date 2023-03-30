import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button
} from "@mui/material";
import { getInitials } from "../../utils/get-initials";
import { DeleteOutlined, DetailsSharp, MoreHorizSharp } from "@mui/icons-material";
import { deleteTutor } from "backend-utils/tutor-utils";
import { useSelector } from "react-redux";
import { selectUser } from "redux/userSlice";
import { useRouter } from "next/router";
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import { updateTutor } from "backend-utils/tutor-utils";
import { updateStudentTutor } from "backend-utils/student-utils";



export const ChoiceListResults = ({ customers, searchTerm,sid, student,...rest }) => {
  const user = useSelector(selectUser);
  const router = useRouter();
  if (user) {
    var token = user.accessToken;
  }
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [err, setErr] = useState("");

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    console.log()
    setPage(newPage);
    
  };
  const connectTutorChild = (tutorId, childId) => {
    console.log(tutorId, childId, token);
    setIsLoading(true)
    updateStudentTutor(token, childId, tutorId, "SUCCESS")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        setErr("Something went wrong");
      })
      .finally(()=>
      
      {
        setIsLoading(false)
      
        router.push("/parents/profile/" + student?.parentId)}
      
      )
  };
  return (
    <Card {...rest}>
        <Box >
          <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0 &&
                      selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers

               .filter((val) => {
                  if (searchTerm == "") {
                    return val;
                  } else if (val.fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return val;
                  }
                })
                .slice((limit*page), (limit)*(page+1))
               
                .map((customer) => (
                  <TableRow
                    hover
                    key={customer.id}
                    selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                        onChange={(event) => handleSelectOne(event, customer.id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
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
                          {getInitials(customer.fullName)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer.fullName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{`${customer.location}`}</TableCell>
                    
                 
                    <TableCell>
                      
                      <Button
                       disabled={isLoading}
                       variant="contained"
                       color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => connectTutorChild(customer.id,sid)}
                      >
                       Choose
                      </Button>
                    
                    </TableCell>

                    <TableCell>
                      <IconButton
                        color="info"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => {
                        
                          router.push("/tutors/" + customer.id);
                        }}
                      >
                        <MoreHorizSharp />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          </TableContainer>
        </Box>
      
      <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ChoiceListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
