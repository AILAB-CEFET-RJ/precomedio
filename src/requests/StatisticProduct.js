const basicUrl = "http://127.0.0.1:8000/";
export const GetStatisticMeanProduct = async(paramts)=>{
  let dataStatisticMean = null;
  paramts = paramts.trim().split(" ");
  const url = basicUrl+"preco/"+paramts[0].toLowerCase().split("iphone")[1];
  const   funcGetProducts = async() => {
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
  return dataStatisticMean.message.split("R$")[1]
   
}
export const GetStatisticLowerProduct = async(paramts)=>{
  let dataStatisticLower = null;
  paramts = paramts.trim().split(" ");
  const url1 = basicUrl+"lowprice/"+paramts[0]+"/"+paramts[1];
  const   funcGetProducts = async() => {
      let mean = await fetch(url1, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization":"Token "+localStorage.getItem("authToken")
          }
         
      }).then(data => data.json()).catch(error => error)
      return mean
  }
  dataStatisticLower = await funcGetProducts();
  return dataStatisticLower.message.split("R$")[1]
   
}
