import { API_URL } from "./url";

const signin = async (email, password) => {
  const response = await fetch(`${API_URL}api/v1/user/adminLogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password,
      email,
    }),
  });
  console.log(response)
  return response;
};

const register = async (email,password,role="ADMINTHREE") =>{
  console.log(email,password)
  const response = await fetch(`${API_URL}api/v1/user/adminRegister`,{
    method : "POST",
    headers: {"Content-Type" : "application/json"},
    body:JSON.stringify({
      password,
      email,
     role
    })
  })
  console.log(response)
  return response;
}
const signout = async (accessToken, token) => {
  const response = await fetch(`${API_URL}api/v1/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      token,
    }),
  });
  console.log(response)
  return response;
};
const getUserById = async (id, token) => {
  const response = await fetch(`${API_URL}api/v1/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
 
  return response
}

export { signin, signout,register,getUserById };
