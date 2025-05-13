import { useEffect, useState } from "react";
import { GetLowerPriceHistory } from "../requests/requestsLowerPriceHistory";
import { GetAllMeanPricesLast30Days } from "../requests/requestsThirtyDaysAverage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer";

const HistoryProduct = () => {
  const [lowerPriceHistory, setLowerPriceHistory] = useState([]);
  const [averagePrices, setAveragePrices] = useState({});
  const [load, setLoad] = useState(false);
  const [groupedData, setGroupedData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadPriceHistory();
    axios.get('http://127.0.0.1:8000/precos-mensais/')
      .then(response => {
        const products = response.data;

        const formattedData = Object.keys(products).map(productName => {
          const prices = products[productName];
          return prices.map(priceData => ({
            month: priceData.month,
            product: productName,
            price: priceData.price
          }));
        });

        const grouped = formattedData.reduce((acc, productData) => {
          if (productData.length > 0) {
            const productName = productData[0].product;
            acc[productName] = productData;
          }
          return acc;
        }, {});

        setGroupedData(grouped);

        const firstProduct = Object.keys(grouped)[0];
        if (firstProduct) setSelectedProduct(firstProduct);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  const loadPriceHistory = async () => {
    setLoad(true);
    try {
      const response = await GetLowerPriceHistory();
      const allMeanPrices = await GetAllMeanPricesLast30Days();

      if (response && Array.isArray(response)) {
        const lowerPrices = response;
        setLowerPriceHistory(lowerPrices);
        const averagePriceMap = {};
        allMeanPrices.forEach((item) => {
          averagePriceMap[item.SearchString] = item.MeanPriceLast30Days;
        });

        setAveragePrices(averagePriceMap);
      } else {
        setLowerPriceHistory([]);
      }
    } catch (e) {
      alert("Erro ao carregar histórico");
      console.error("Erro:", e);
    }
    setLoad(false);
  };

  const chartData = selectedProduct && groupedData[selectedProduct] ? groupedData[selectedProduct] : [];

  return (
    <>
      <div id="container-fluid container2">
        <Header />
        {load ? (
          <div>
            <img src={"images/loading.gif"} className="imageIconeLoad" alt="Loading" />
          </div>
        ) : (
          <section className="pt-5">
            <article>
              <div className="container" style={{ width: "100%", margin: "0 auto" }}>
                <div className="text-center mb-3">
                  <h2 className="text-success">Histórico de Preços Por Modelo</h2>
                </div>
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th className="align-middle" scope="col">Modelo</th>
                      <th className="align-middle" scope="col">Menor Preço</th>
                      <th className="align-middle" scope="col">Preço Médio (30 dias)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowerPriceHistory.length > 0 ? (
                      lowerPriceHistory.map((item, i) => (
                        <tr key={i}>
                          <td>{item.SearchString}</td>
                          <td>R$ {Number(item.MinPrice).toFixed(2).replace(".", ",")}</td>
                          <td>R$ {Number(averagePrices[item.SearchString] || 0).toFixed(2).replace(".", ",")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">
                          <h5 style={{ color: "#7d0000" }} className="h6 text-center">
                            Nenhum histórico encontrado
                          </h5>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {Object.keys(groupedData).length > 0 && (
                  <div className="mb-4 text-center">
                    <label htmlFor="product-select" className="me-2 fw-bold">Selecionar Produto:</label>
                    <select
                      className="bg-white"
                      id="product-select"
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      value={selectedProduct || ""}
                    >
                      {Object.keys(groupedData).map((productName) => (
                        <option className="bg-white" key={productName} value={productName}>{productName}</option>
                      ))}
                    </select>
                  </div>
                )}

                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#008000" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>
        )}
        {!load && <Footer />}
      </div>
    </>
  );
};

export default HistoryProduct;
