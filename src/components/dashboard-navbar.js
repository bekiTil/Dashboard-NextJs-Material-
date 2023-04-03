import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Bell as BellIcon } from "../icons/bell";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { Users as UsersIcon } from "../icons/users";
import { Lock as LockIcon } from "../icons/lock";

import { useRouter } from "next/router";
import { logout, selectUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../backend-utils/user-utils";
import { getInitials } from "src/utils/get-initials";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;

  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    signout(user.accessToken, user.refreshToken)
    .then((data)=>{
      dispatch(logout());
    })
   
    router.push("/login");
  };
  return (
    <>
      <DashboardNavbarRoot
        
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Search">
            <IconButton sx={{ ml: 1 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          {/* <Tooltip title="Contacts">
            <IconButton sx={{ ml: 1 }}>
              <UsersIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge badgeContent={4} color="primary" variant="dot">
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Logout">
            <IconButton sx={{ ml: 1 }} onClick={(e) => handleLogout(e)}>
              <LockIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Avatar
            sx={{
              height: 40,
              width: 40,
              ml: 1,
            }}
            // src="/static/images/avatars/avatar_1.png"
          >
            {/* <UserCircleIcon fontSize="small" /> */}
            {getInitials(user?.user.email)}
            {/* {...stringAvatar('Kent Dodds')} */}
          </Avatar>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
