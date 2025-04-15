const basicUrl = "http://127.0.0.1:8000/"
export const GetLowerPriceHistory = async () => {
  try {
      const response = await fetch(`${basicUrl}min_prices`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + localStorage.getItem('authToken'),
      }
      });

      if (!response.ok) {
      throw new Error('Erro ao buscar histórico');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return null;
  }
}
  