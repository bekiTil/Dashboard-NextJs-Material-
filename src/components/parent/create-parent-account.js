import { useEffect, useRef, useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
} from "@mui/material";
import { selectUser } from "redux/userSlice";
import { useSelector } from "react-redux";
import { updateParent } from "backend-utils/parent-utils";
import { useRouter } from "next/router";

function getStyles(name, subjects, theme) {
  return {
    fontWeight:
      subjects.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

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

export const CreateParentAccountForm = (props) => {
  const user = useSelector(selectUser);
  const router = useRouter();

  const [parent, setParent] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [err, setErr] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    setInitialValues({
      id: props.parent?.id,
      fullName: props.parent?.fullName,
      phone1: props.parent?.phone1,
      phone2: props.parent?.phone2,
      location: props.parent?.location,
      preferredBank: props.parent?.preferredBank,
     
    });
  }, [props.parent]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: initialValues?.fullName,
      email: null,
      phone1: initialValues?.phone1,
      phone2: initialValues?.phone2,
      location: initialValues?.location,
      preferredBank: initialValues?.preferredBank!=null ? initialValues?.preferredBank :"",
     
    },
    validationSchema: Yup.object({
      fullName: Yup.string().max(255).required("Full name is required"),
      email: Yup.string().email("Must be a valid email").max(255).nullable(),
      location: Yup.string().max(255).required("Location is required"),
      phone1: Yup.string().max(255).required("Phone is required"),
      phone2: Yup.string().max(255).nullable(),
      preferredBank: Yup.string().max(255).nullable(),
    
    }),
    onSubmit: () => {
      setLoggingIn(true);
      setErr("");
      setShowAlert(false);

      const parentBody = { ...formik.values };
      updateParent(user.accessToken, initialValues.id, parentBody)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data)
            setParent(data.parent);
          } else {
            setErr(data.message);
          }
        })
        .catch((_) => {
          setErr("Something went wrong");
        })
        .finally(() => {
          if (isMounted.current) {
            // ? preserve memory leak
            // ? state is updated only if mounted
            setLoggingIn(false);
            router.push("/parents");
          }
        });
    },
  });
  const submitHandle =() => {
    setLoggingIn(true);
    setErr("");
    setShowAlert(false);
    console.log(formik.isValid===true,formik.isValid)
    console.log(formik)
    if (formik.isValid=== true){
    const parentBody = { ...formik.values,status:"SUCCESS" };
    updateParent(user.accessToken, initialValues.id, parentBody)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data)
          setParent(data.parent);
        } else {
          setErr(data.message);
        }
      })
      .catch((_) => {
        setErr("Something went wrong");
      })
      .finally(() => {
        if (isMounted.current) {
          // ? preserve memory leak
          // ? state is updated only if mounted
          setLoggingIn(false);
          router.push("/parents");
        }
      });
    }
    else{
      formik.validateForm()
    }
  }
  return (
    <form autoComplete="off" noValidate {...props} onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Fill Parent Requirement" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
                fullWidth
                label="Full Name"
                name="fullName"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.fullName || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
                label="Email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.phone1 && formik.errors.phone1)}
                helperText={formik.touched.phone1 && formik.errors.phone1}
                fullWidth
                label="Phone 1"
                name="phone1"
                rows={4}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone1 || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.phone2 && formik.errors.phone2)}
                helperText={formik.touched.phone2 && formik.errors.phone2}
                fullWidth
                label="Phone 2"
                name="phone2"
                rows={4}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone2 || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.location && formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
                fullWidth
                label="Location"
                name="location"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.location || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.preferredBank && formik.errors.preferredBank)}
                helperText={formik.touched.preferredBank && formik.errors.preferredBank}
                fullWidth
                label="Preferred Bank"
                name="preferredBank"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.preferredBank || ""}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" type="submit"
          
          disabled={loggingIn}
          onClick={submitHandle}>
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};
