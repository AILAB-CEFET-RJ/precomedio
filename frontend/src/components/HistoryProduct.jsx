import { useEffect, useState } from "react";
import { GetLowerPriceHistory } from "../requests/requestsLowerPriceHistory";
import { GetThirtyDaysAverage } from "../requests/requestsThirtyDaysAverage";
import Header from "./Header";
import Footer from "./Footer";
// Vai funcionar como uma dashboard com várias tabelas e gráficos.
const HistoryProduct = () => {
  const [lowerPriceHistory, setLowerPriceHistory] = useState([]);
  const [averagePrices, setAveragePrices] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    loadPriceHistory();
  }, []);

  const loadPriceHistory = async () => {
    setLoad(true);
    try {
      const response = await GetLowerPriceHistory();
      if (response && Array.isArray(response)) {
        const lowerPrices = response;
        setLowerPriceHistory(lowerPrices);

        const averages = await Promise.all(
          lowerPrices.map(async (item) => {
            const avg = await GetThirtyDaysAverage(item.SearchString);
            return { searchString: item.SearchString, avgPrice: avg };
          })
        );

        const averagePriceMap = {};
        averages.forEach((entry) => {
          averagePriceMap[entry.searchString] = entry.avgPrice;
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
                          <td>
                            {averagePrices[item.SearchString] !== null && averagePrices[item.SearchString] !== undefined
                              ? `R$ ${Number(averagePrices[item.SearchString]).toFixed(2).replace(".", ",")}`
                              : "N/A"}
                          </td>
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
