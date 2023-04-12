import { API_URL } from "./url";

const getPendingTutors = async (token) => {
  const response = await fetch(`${API_URL}api/v1/tutor/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
const getTutors = async (token) => {
  const response = await fetch(`${API_URL}api/v1/tutor`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};
const getAllTutors = async (token) => {
  const response = await fetch(`${API_URL}api/v1/tutor/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const getATutorwithLocation = async (token, location) => {
  const response = await fetch(`${API_URL}api/v1/tutor/location/${location}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};


const getATutor = async (token, id) => {
  console.log(id)
  const response = await fetch(`${API_URL}api/v1/tutor/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const updateTutor = async (token, id, status) => {
  const response = await fetch(`${API_URL}api/v1/tutor/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
     ... status
    }),
  });
  return response;
};

const deleteTutor = async (token, id) => {
  const response = await fetch(`${API_URL}api/v1/tutor/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const fetchTimesheet = async(token)=>{
  const response = await fetch(`${API_URL}api/v1/tutor/fetchTimeSheet`, {
    method:"GET",
    headers :{
      "Content-Type": "application/json",
      authorization : `Bearer ${token}` ,
    },
  });
  return response;
}
const getTimeSheetsBasedOnMonth = async (token,year)=>{
  
  const response = await fetch (`${API_URL}api/v1/tutor/fetchImage/${year}`,{
    method:"GET",
    headers :{
      "Content-Type":"application/json",
      authorization: `Bearer ${token}`,
    }
  }
  );
  console.log(response,"backend", year)

  return response;

}
const UpdateAnImage = async (token,id,imageBody)=>{
  console.log(imageBody)
  
  const response = await fetch(`${API_URL}api/v1/tutor/image/${id}`, {
    method: "PATCH",
    headers :{
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...imageBody }),
    

  })
  console.log(response)
  return response;
}
const UpdateAnImageWithAMessage = async (token,id,imageBody)=>{
  console.log(imageBody)
  
  const response = await fetch(`${API_URL}api/v1/tutor/imagestatus/${id}`, {
    method: "PATCH",
    headers :{
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...imageBody }),
    

  })
  console.log(response)
  return response;
}

export { getTutors, updateTutor, deleteTutor, getATutor ,getATutorwithLocation,getPendingTutors,getTimeSheetsBasedOnMonth, UpdateAnImage, getAllTutors,UpdateAnImageWithAMessage};
