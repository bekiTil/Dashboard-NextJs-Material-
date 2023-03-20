import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { selectUser,logout } from 'redux/userSlice';

export default function withAuth(Component) {
  return function WithAuth(props) {
    const user = useSelector(selectUser);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      } else {
        const decodedToken = jwtDecode(user.accessToken);
        if (decodedToken.exp < Date.now() / 1000) {
          dispatch(logout());
          router.push('/login');
        }
      }
    }, [user]);

    return <Component {...props} />;
  };
}
