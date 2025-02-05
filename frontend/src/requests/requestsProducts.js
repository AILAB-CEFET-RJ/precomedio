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

export const SaveFavorites = async (products, userId) => {
  try {
    if (!userId) {
      throw new Error('UserId não encontrado');
    }

    const response = await fetch(basicUrl+'favorites/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({ 
        products: products,
        userId: userId
      })
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar favoritos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

export const GetFavorites = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error('UserId não encontrado');
    }

    const response = await fetch(`${basicUrl}favorites/list/?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar favoritos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}