const basicUrl = "http://127.0.0.1:8000/";
export const GetStatisticMeanProduct = async(params)=>{
  let dataStatisticMean = null;
  params = params.trim().split(" ");
  const url = basicUrl+"averagePrice/"+params[0]+"/"+params[1];
  const funcGetProducts = async() => {
      let mean = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization":"Token "+localStorage.getItem("authToken")
          }
         
      }).then(data => data.json()).catch(error => error)
      return mean
  }
  dataStatisticMean = await funcGetProducts();
  return dataStatisticMean.mean
   
}
export const GetStatisticLowerProduct = async(params)=>{
  let dataStatisticLower = null;
  params = params.trim().split(" ");
  const url = basicUrl+"lowestPrice/"+params[0]+"/"+params[1];
  const   funcGetProducts = async() => {
      let lowestPrice = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization":"Token "+localStorage.getItem("authToken")
          }
         
      }).then(data => data.json()).catch(error => error)
      return lowestPrice
  }
  dataStatisticLower = await funcGetProducts();
  return dataStatisticLower.lowestPrice
   
}
