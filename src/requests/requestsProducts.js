const basicUrl = "http://127.0.0.1:8000/"
export const GetProducts = async(paramts)=>{
    let prods = null;
    paramts = paramts.trim().split(" ");
    console.log(paramts)
    const url = basicUrl+"search/"+paramts[0]+"/"+paramts[1];
    console.log(url)
    const   funcGetProducts = async() => {
        let products = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Token "+localStorage.getItem("authToken")
            }
           
        }).then(data => data.json()).catch(error => error)
        return products
    }
    prods = await funcGetProducts();
    return prods
}