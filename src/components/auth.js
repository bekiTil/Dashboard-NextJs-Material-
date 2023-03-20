import { useEffect } from 'react';
import { logout, selectUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";


  const WithAuth = (props) => {

    const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(()=>{
    if (user) {
        const decodedToken = jwt_decode(user.accessToken);
        console.log()
        if (decodedToken.exp < Date.now()) {
          dispatch(logout());
          router.push('/login')
        }
      }

  },[])
 
  

    return <PageComponent {...props} />;
  };

export default WithAuth