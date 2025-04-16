export const GetAllMeanPricesLast30Days = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/mean-prices/last-30-days/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("authToken"),
        },
      });
  
      if (!response.ok) {
        throw new Error("Erro ao buscar preços médios");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar preços médios:", error);
      return [];
    }
  };