const basicUrl = "http://127.0.0.1:8000/";

export const GetThirtyDaysAverage = async (searchString) => {
  try {
    const response = await fetch(
      `${basicUrl}history/?searchString=${encodeURIComponent(searchString)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("authToken"),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar preço médio dos últimos 30 dias");
    }

    const data = await response.json();
    return data?.average_price_30_days ?? null;
  } catch (error) {
    console.error("Erro ao buscar preço médio:", error);
    return null;
  }
};