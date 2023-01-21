import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Button,
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
import { useRouter } from "next/router";
import { deleteParent } from "backend-utils/parent-utils";
import { useSelector } from "react-redux";
import { selectUser } from "redux/userSlice";
import { DeleteOutlined, MoreHorizSharp } from "@mui/icons-material";

export const ParentListResults = ({ customers, searchTerm, ...rest }) => {
  const user = useSelector(selectUser);
  const router = useRouter();
  if (user) {
    var token = user.accessToken;
  }

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
    setPage(newPage);
  };

  const handleDelete = (id,success) => {
    deleteParent(token, id)
      .then((res) => res.json())
      .then((_data) => {
        if (success=='SUCCESS'){
          router.push("/parents")

        }
        else{
          router.push("/newParent")
        }
        console.log(_data)
        
      })
      .catch((_) => {
        setErr("Something went wrong");
      });
  };

  return (
    <Card {...rest}>
      
        <Box 
       
        
        >
          <TableContainer>
          <Table
          
          >
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
                <TableCell>Phone</TableCell>
                
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers
                .slice((limit*page), (limit)*(page+1))
                .filter((val) => {
                  if (searchTerm == "") {
                    return val;
                  } else if (val.fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return val;
                  }
                })
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
                    <TableCell>{customer.location}</TableCell>
                    <TableCell>{customer.phone1}</TableCell>
                   
                    <TableCell>
                      <IconButton
                        color="error"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => handleDelete(customer.id,customer.status)}
                      >
                        <DeleteOutlined />
                      </IconButton>
                      {customer.email === null && customer.status ==="PENDING" && (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            router.push("/newParent/" + customer.id);
                          }}
                        >
                          Create Account
                        </Button>
                      )}
                      <IconButton
                        color="info"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => router.push("/parents/profile/" + customer.id)}
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

ParentListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
