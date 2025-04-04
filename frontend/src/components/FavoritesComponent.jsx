import { useState, useEffect } from "react";
import { GetFavorites } from "../requests/requestsProducts";
import Header from "./Header";
import Footer from "./Footer";

const FavoritesComponent = () => {
  const [favorites, setFavorites] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoad(true);
    try {
      const response = await GetFavorites();
      setFavorites(response);
    } catch (e) {
      alert("Erro ao carregar favoritos");
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
              <div className="container">
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th id="item-header-table" className="align-middle" scope="col">
                        Modelo
                      </th>
                      <th id="item-header-table" className="align-middle" scope="col">
                        Preço
                      </th>
                      <th id="item-header-table" className="align-middle" scope="col">
                        Fornecedor
                      </th>
                      <th id="item-header-table" className="align-middle" scope="col">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {favorites.length > 0 ? (
                      favorites.map((fav, i) => (
                        <tr key={i}>
                          <td>{fav.price_tracker.Model}</td>
                          <td>R$ {fav.price_tracker.Price.replace(".", ",")}</td>
                          <td>{fav.price_tracker.Supplier}</td>
                          <td>
                            {fav.price_tracker.DateOfSearch.split(
                              /((\d){2,4}-(\d){2,2}-(\d){2,2})/
                            )[1]}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">
                          <h5 style={{ color: "#7d0000" }} className="h6">
                            Nenhum favorito encontrado
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

export default FavoritesComponent; 