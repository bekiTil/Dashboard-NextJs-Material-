import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Facebook as FacebookIcon } from "../icons/facebook";
import { Google as GoogleIcon } from "../icons/google";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "../../redux/userSlice";
import { signin } from "../../backend-utils/user-utils";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().min(8).max(255).required("Password is required"),
    }),
    onSubmit: () => {
      setLoggingIn(true);
      setErr("");
      setShowAlert(false);
      signin(formik.values.email, formik.values.password)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.status)
          if (data.success) {
            dispatch(
              login({
                user: data.user,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                loggedIn: true,
              })
            );
            router.push("/dashboard");
          } else {
            if (data.status != 500)
            {
            setErr(data.message)
            }
            else{
            setErr('Something went wrong')
            }
          }
        })
        .catch((_err) => {
          setErr("Something went wrong");
        })
        .finally(() => {
          if (isMounted.current) {
            // ? preserve memory leak
            // ? state is updated only if mounted
            setLoggingIn(false);
          }
        });
    },
  });

  return (
    <>
      <Head>
        <title>Dashboard | Temaribet</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
              <div>
                <Typography color="textPrimary" variant="h4" style={{ textAlign: "center" }}>
                  Sign in
                </Typography>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Sign in on the internal platform
                </Typography>
              </div>
            </Box>

            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={loggingIn}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                {loggingIn ? "Signing in..." : "Sign In Now"}
              </Button>
            </Box>
          </form>
          {err !== "" && <Alert severity="error">{err}</Alert>}
        </Container>
      </Box>
    </>
  );
};

export default Login;
