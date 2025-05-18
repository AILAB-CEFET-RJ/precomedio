import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import axios from "axios";


const ProductPage = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/precos-mensais/');
        const allData = response.data;
        const formattedSearchString = product.SearchString.replace(/\+/g, ' ');
        const filteredData = allData[formattedSearchString] || [];
        const formattedData = filteredData.map(item => ({
          month: item.month,
          price: item.price
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar o histórico de preços:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceHistory();
  }, [product.SearchString]);

  if (!product) {
    return <div className="text-center text-danger mt-5">Nenhum produto selecionado.</div>;
  }


  return (
    <div id="container-fluid container2">
      <Header />

      <section className="pt-5">
          <div className="container">
            <div className="mb-4">
              <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4">← Voltar</button>
            </div>

            <div className="mb-4">
              <img src={"images/iphone_example.avif"} style={{width: '300px'}} alt="Imagem Iphone" />
            </div>

            <h3 className="mb-4">{product.Model}</h3>
            <ul className="list-group">
              <li className="list-group-item">Preço: {product.Price.replace(".", ",")} R$</li>
              <li className="list-group-item">Fornecedor: {product.Supplier}</li>
              <li className="list-group-item">Armazenamento: {product.SearchString.split("+")[1]}</li>
              <li className="list-group-item">Data da Pesquisa: {product.DateOfSearch.split("T")[0]}</li>
            </ul>
          </div>
      </section>

      <section>
        <div className="container" style={{ width: "100%", margin: "0 auto" }}>
          <div className="text-center my-4">
            <h2>Histórico de Preços</h2>
          </div>

          {isLoading ? (
            <div className="text-center">
              <img src={"images/loading.gif"} alt="Carregando..." />
            </div>
          ) : chartData.length === 0 ? (
            <div className="text-center">
              <h3 className="text-danger">Histórico não encontrado.</h3>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#008000" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
