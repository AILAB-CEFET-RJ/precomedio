import { useEffect, useState } from "react";
import { GetLowerPriceHistory } from "../requests/requestsLowerPriceHistory";
import Header from "./Header";
import Footer from "./Footer";

// Vai funcionar como uma dashboard com várias tabelas e gráficos.
const HistoryProduct = () => {
  const [lowerPriceHistory, setLowerPriceHistory] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    loadLowerPriceHistory();
  }, []);

  const loadLowerPriceHistory = async () => {
    setLoad(true);
    try {
      const response = await GetLowerPriceHistory();
      console.log(response)
      setLowerPriceHistory(response || []);
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
                  <h2 className="text-success">Menor Preço Histórico Por Modelo</h2>
                </div>
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th className="align-middle" scope="col">Modelo</th>
                      <th className="align-middle" scope="col">Menor Preço</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {lowerPriceHistory.length > 0 ? (
                      lowerPriceHistory.map((item, i) => (
                        <tr key={i}>
                          <td>{item.SearchString}</td>
                          <td>R$ {Number(item.MinPrice).toFixed(2).replace(".", ",")}</td>
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
