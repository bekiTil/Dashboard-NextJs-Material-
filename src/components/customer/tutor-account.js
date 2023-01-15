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
          <Typography color="textSecondary" variant="body2">
            Email: {props.user?.email}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Location: {props.user?.location}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Phone: {props.user?.phone}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Gender: {props.user?.gender}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Age: {props.user?.age}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Academic Status: {props.user?.acadStatus}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            UEE: {props.user?.UEE}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            cGPA: {props.user?.cGPA}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Field of Study: {props.user?.field}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            University/College: {props.user?.college}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Volunteerism: {props.user?.volenteerism}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Hobby: {props.user?.hobby}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Has Tutored Previously: {props.user?.prevTutored}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Previous Tutor Experience: {props.user?.prevTutorExperience}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Ideal Tutor: {props.user?.idealTutor}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Work days: {props.user?.workDays}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Work hours: {props.user?.workHour}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            Subjects: {props.user?.subjects.toString()}
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
