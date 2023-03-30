import Head from "next/head";
import { useRouter } from "next/router";

// import { Box, Container, Grid, CircularProgress } from "@mui/material";
// import { Budget } from "../components/dashboard/budget";
// import { LatestOrders } from "../components/dashboard/latest-orders";
// import { LatestProducts } from "../components/dashboard/latest-products";
// import { Sales } from "../components/dashboard/sales";
// import { TasksProgress } from "../components/dashboard/tasks-progress";
// import { TotalCustomers } from "../components/dashboard/total-customers";
// import { TotalProfit } from "../components/dashboard/total-profit";
// import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
// import { DashboardLayout } from "../components/dashboard-layout";

import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "src/components/dashboard-layout";
import { logout, selectUser } from "../../redux/userSlice";
import Dashboard from "./dashboard";
import Login from "./login";
import jwt_decode from "jwt-decode";

const Loading = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch();
  if (user == null) {
    dispatch(logout());
    router.push("/login");
  }
  // if (user) {
  //   const decodedToken = jwt_decode(user.accessToken);
  //   console.log(decodedToken,Date.now())
  //   if (decodedToken.exp > Date.now()) {
  //     dispatch(logout());
  //   }
  // }
  return (
    <>
      <Head>
        <title>Dashboard | Temaribet</title>
      </Head>
      {user ? <Dashboard /> : <Login />}
    </>
  );
};

Loading.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Loading;
