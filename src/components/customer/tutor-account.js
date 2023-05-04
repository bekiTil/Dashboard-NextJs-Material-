import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

export const TutorProfile = (props) => {
  const user = {
    avatar: "/static/images/avatars/avatar_6.png",
    city: "Addis Ababa",
    country: "Ethiopia",
    jobTitle: "Senior Developer",
    name: "Katarina Smith",
    timezone: "GTM-7",
  };
  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            wordWrap: "break-word",
            wordBreak: "break-all",
          }}
        >
          <Avatar
            src={props.user?.profilePicture}
            sx={{
              height: 64,
              mb: 2,
              width: 64,
            }}
          />

          <Typography color="textPrimary" gutterBottom variant="h5">
            {props.user?.fullName}
          </Typography>
          <Box>
          <Typography color="textSecondary" variant="body2" >
           <b>Email</b> : {props.user?.email}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
           <b>Location</b> : {props.user?.location}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Phone</b>: {props.user?.phone}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Gender</b>: {props.user?.gender}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Age</b>: {props.user?.age}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Academic Status</b>: {props.user?.acadStatus}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>UEE</b>: {props.user?.UEE}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>cGPA</b>: {props.user?.cGPA}
          </Typography>
          <Typography color="textSecondary" variant="body2"  >
            <b>Field of Study</b>: {props.user?.field}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>University/College</b>: {props.user?.college}
          </Typography>
          <Typography color="textSecondary" variant="body2">
           <b>Volunteerism</b> : {props.user?.volenteerism}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Hobby</b>: {props.user?.hobby}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Has Tutored Previously</b>: {props.user?.prevTutored}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Previous Tutor Experience</b>: {props.user?.prevTutorExperience}
          </Typography>
          <Typography color="textSecondary" variant="body2"  >
            <b>Ideal Tutor</b>: {props.user?.idealTutor}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Work days</b>: {props.user?.workDays}
          </Typography>
          <Typography color="textSecondary" variant="body2" >
            <b>Work hours</b>: {props.user?.workHour}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            <b>Subjects</b>: {props.user?.subjects.toString()}
          </Typography>
          </Box>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="primary" fullWidth variant="text">
          Tutoring Status: {props.user?.status}
        </Button>
      </CardActions>
    </Card>
  );
};
