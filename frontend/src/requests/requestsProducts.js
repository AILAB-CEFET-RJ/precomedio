const basicUrl = "http://127.0.0.1:8000/"
export const GetProducts = async(params)=>{
    let prods = null;
    params = params.trim().split(" ");
    const url = basicUrl+"search/"+params[0]+"/"+params[1];
    const funcGetProducts = async() => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + localStorage.getItem("authToken")
                }
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return null;
        }
    }
    prods = await funcGetProducts();
    return prods
}