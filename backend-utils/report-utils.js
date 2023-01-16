import { API_URL } from "./url";

const getReports = async (token) => {
  const response = await fetch(`${API_URL}api/v1/report`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

const getAReport = async (token,id)=>{
  
  const response = await fetch(`${API_URL}api/v1/report/${id}`, {
    method:"GET",
    headers :{
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },

  })
  console.log(response)
  return response;
}
const UpdateAReport = async (token,id,reportBody)=>{
  console.log(reportBody)
  
  const response = await fetch(`${API_URL}api/v1/report/${id}`, {
    method: "PATCH",
    headers :{
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...reportBody }),
    

  })
  console.log(response)
  return response;
}
const getReportsBasedOnWeek = async (token,year,month)=>{
  console.log(year,month)
  const response = await fetch (`${API_URL}api/v1/report/sort/${year}/${month}`,{
    method:"GET",
    headers :{
      "Content-Type":"application/json",
      authorization: `Bearer ${token}`,
    }
  }
  );

  return response;

}

export { getReports,getReportsBasedOnWeek ,getAReport,UpdateAReport};
