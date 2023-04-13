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
  const [isLoading,setIsLoading] = useState(false);
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
    setIsLoading(true)
    deleteParent(token, id)
      .then((res) => res.json())
      .then((_data) => {
        console.log(_data,success)
        if (success=='SUCCESS'){
          router.push("/parents")

        }
        else{
          router.push("/newParent")
        }
        console.log(_data)
        window.location.reload(false);
        
      })
      .catch((_) => {
        setErr("Something went wrong");
      }).finally(
        ()=>{
          setIsLoading(false)
      });
  };
  function getDurationString(createdAt) {
    console.log(createdAt)
    console.log("see it ")
    const createdDate = new Date(createdAt);
    const now = new Date().getTime(); // Get the current timestamp in milliseconds
    const diff = now - createdDate; // Calculate the difference between the current time and the creation time
    const seconds = Math.floor(diff / 1000); // Convert the difference to seconds
  
    if (seconds < 60) {
      // If less than 1 minute has passed
      return "just now";
    } else if (seconds < 60 * 60) {
      // If less than 1 hour has passed
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else if (seconds < 60 * 60 * 24) {
      // If less than 1 day has passed
      const hours = Math.floor(seconds / (60 * 60));
      return `${hours}h`;
    
    } else {
      // If more than 1 day has passed
      const days = Math.floor(seconds / (60 * 60 * 24));
      return `${days}d`;
    }
  }
  

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
                {customers[0]?.status =='PENDING' && <TableCell>Duration</TableCell>}
                <TableCell>Action</TableCell>
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
                    <TableCell>{customer.location}</TableCell>
                    <TableCell>{customer.phone1}</TableCell>
                    
                    {customer.status=="PENDING" && 
                    <TableCell>
                 <Typography variant="body2" color="textSecondary">
                    {getDurationString(customer.createdAt)}
                    </Typography>
                    </TableCell>
                   
                  
}
                   
                    <TableCell>
                      { customer.status ==="PENDING" && 
                      <IconButton
                        color="error"
                        aria-label="upload picture"
                        disabled={isLoading}
                        component="span"
                        onClick={() => handleDelete(customer.id,customer.status)}
                      >
                        <DeleteOutlined />
                      </IconButton>
}
                      {customer.email === null && customer.status ==="PENDING" && (
                        <Button
                          color="primary"
                          variant="contained"
                          disabled={isLoading}
                          onClick={() => {
                            setIsLoading(true)
                            router.push("/newParent/" + customer.id);
                          }}
                        >
                          Create Account
                        </Button>
                      )}
                      <IconButton
                        color="info"
                        aria-label="upload picture"
                        disabled={isLoading}
                        component="span"
                        onClick={() => { setIsLoading(true);
                          router.push("/parents/profile/" + customer.id)}}
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
