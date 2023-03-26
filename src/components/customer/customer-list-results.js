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
} from "@mui/material";
import { getInitials } from "../../utils/get-initials";
import { DeleteOutlined, DetailsSharp, MoreHorizSharp } from "@mui/icons-material";
import { deleteTutor } from "backend-utils/tutor-utils";
import { useSelector } from "react-redux";
import { selectUser } from "redux/userSlice";
import { useRouter } from "next/router";
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import { updateTutor } from "backend-utils/tutor-utils";


export const CustomerListResults = ({ customers, searchTerm, ...rest }) => {
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

  const handleDelete = (id) => {
    deleteTutor(token, id)
      .then((res) => res.json())
      .then((_data) => {
        router.push("/tutors");
      })
      .catch((_) => {
        setErr("Something went wrong");
      });
  };
  const changeStatus =(id)=>{
    setIsLoading(true)
    updateTutor(token,id, 1,"SUCCESS")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.success) {
          console.log(data)
          setTutor(data.user);
          router.push('/tutors')
        } else {
          setErr(data.message);
        }
        
      })
      .catch((_) => {
        setErr("Something went wrong");
        
      })
      .finally(()=>{
        router.push('/tutors')
        setIsLoading(false)
      })
      
  }
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
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                
                
                {customers[0]?.status =='PENDING' &&<TableCell>Action</TableCell>}
                <TableCell>Delete</TableCell>
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
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{`${customer.location}`}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      {customer.status === "SUCCESS" && <Chip label="SUCCESS" color="success" />}
                      {customer.status === "FAILED" && <Chip label="SUCCESS" color="error" />}
                      {customer.status === "PENDING" && <Chip label="PENDING" color="primary" />}
                    </TableCell>
                    <TableCell>
                      {customer.status=="PENDING"
                      &&
                      <IconButton
                      disabled={isLoading}
                      color="error"
                      aria-label="upload picture"
                      component="span"
                      onClick=
                      {() => changeStatus(customer.id) }
                      
                    >
                      <AddTaskRoundedIcon />
                  
                      
                    </IconButton>
                      }
                      {customer.status=="SUCCESS"
                      
                      &&
                      <Chip label="Active" color="error" variant="outlined" />
                      }
                    </TableCell>
                    <TableCell>
                      <IconButton
                       disabled={isLoading}
                        color="error"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <DeleteOutlined />
                      </IconButton>
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

CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
