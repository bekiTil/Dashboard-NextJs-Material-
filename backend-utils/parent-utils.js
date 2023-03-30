import { API_URL } from "./url";

const getPendingParents = async (token) => {
  const response = await fetch(`${API_URL}api/v1/parent/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
const getParents = async (token) => {
  const response = await fetch(`${API_URL}api/v1/parent`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const getAParent = async (token, id) => {
  const response = await fetch(`${API_URL}api/v1/parent/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const updateParent = async (token, id, parentBody) => {
  const response = await fetch(`${API_URL}api/v1/parent/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...parentBody }),
  });
  return response;
};

const createParent = async (token, parentBody) => {
  const response = await fetch(`${API_URL}api/v1/parent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...parentBody,
    }),
  });
  console.log(response)
  return response;
};

const deleteParent = async (token, id) => {
  const response = await fetch(`${API_URL}api/v1/parent/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const numberByMonth = async (token)=>{
  const response = await fetch(`${API_URL}api/v1/parent/basedOnMonth`,{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
      authorization :`Bearer ${token}`,
    }
  })
  return response;
}

export { getParents, createParent, getAParent, updateParent, deleteParent,getPendingParents, numberByMonth};
