const basicUrl = "http://127.0.0.1:8000/"
export const GetProducts = async(params)=>{
    let prods = null;
    params = params.trim().split(" ");
    const url = basicUrl+"search/"+params[0]+"/"+params[1];
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