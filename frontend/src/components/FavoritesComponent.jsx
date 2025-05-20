import { useState, useEffect } from "react";
import { GetFavoriteSearches, GetProducts } from "../requests/requestsProducts";
import Header from "./Header";
import Footer from "./Footer";
import { Pagination } from "./Pagination";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FavoritesComponent = () => {
  // const [favorites, setFavorites] = useState([]);
  const [favoritesSearches, setFavoritesSearches] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState("");
  const [load, setLoad] = useState(false);
  // const navigate = useNavigate();
  const [productChosen, setProductChosen] = useState([]);
  const [numpages, setNumPages] = useState([]);
  const [prodSlice, setProdSlice] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let num = 0;
  let listNum = [];
  const onPagination = (e, check = false) => {
    let n = null;
    if (!check) {
      n = e.target.name;
    } else {
      n = e;
    }
    setLoad(true);
    let [prods, listNum] = Pagination(prodSlice, num, n);
    setNumPages([...listNum]);
    setProductChosen(prods);
    setLoad(false);
  }

  // useEffect(() => {
  //   loadFavorites();
  // }, []);

  // const loadFavorites = async () => {
  //   setLoad(true);
  //   try {
  //     const response = await GetFavorites();
  //     setFavorites(response);
  //   } catch (e) {
  //     alert("Erro ao carregar favoritos");
  //     console.error("Erro:", e);
  //   }
  //   setLoad(false);
  // };

  const loadFavoritesSearches = async () => {
    setLoad(true);
    try {
      const response = await GetFavoriteSearches();
      setFavoritesSearches(response);
    } catch (e) {
      alert("Erro ao carregar buscas favoritas");
      console.error("Erro:", e);
    }
    setLoad(false);
  };

  useEffect(() => {
    loadFavoritesSearches();
  }, []);

  const handleProducts = async () => {

    if (!selectedSearch) return

    setLoad(true);

    try {
      let res = await GetProducts(selectedSearch);
      let { products } = res;

      setProdSlice(products);
      [products, listNum] = Pagination(products, num, null);
      setNumPages([...listNum]);
      setProductChosen(products);
    } catch (e) {
      alert("Erro no servidor");
    }

    setLoad(false);
  }

  const fetchPriceHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/precos-mensais/');
      const allData = response.data;
      const filteredData = allData[selectedSearch] || [];
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
 
  useEffect(() => {
    handleProducts();
    fetchPriceHistory();
    // eslint-disable-next-line
  }, [selectedSearch]);

  return (
    <>
      <div id="container-fluid container2">
        <Header />
        
        <article className="pt-4">
          <div>
            {favoritesSearches.length > 0 && (
              <div className="mb-4 text-center">
                <label htmlFor="search-select" className="me-2 fw-bold">
                  Selecionar busca favorita:
                </label>
                <select
                  className="bg-white"
                  id="search-select"
                  onChange={(e) => setSelectedSearch(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Selecione uma busca</option>
                  {favoritesSearches.map((search) => (
                    <option key={search.id} value={search.search_string}>
                      {search.search_string}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </article>

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
                    <tr >
                      <th id="item-header-table" className="align-middle" scope="col">Modelo</th>
                      <th id="item-header-table" className="align-middle" scope="col">Preço</th>
                      <th id="item-header-table" className="align-middle" scope="col">Fornecedor</th>
                      <th id="item-header-table" className="align-middle" scope="col">Armazenamento</th>
                      <th id="item-header-table" className="align-middle" scope="col">Data</th>
                      {/* <th id="item-header-table" className="align-middle" scope="col">Favoritar</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {productChosen.length > 0 && productChosen ? productChosen.map((prod, i) => (
                      <tr 
                        key={i}
                        // style={{ cursor: "pointer" }}
                        // onClick={() => navigate("/produto", { state: prod })}
                      >
                        <td>{prod.Model}</td>
                        <td>R$ {prod.Price.replace(".", ",")}</td>
                        <td>{prod.Supplier}</td>
                        <td>{prod.SearchString.split("+")[1]}</td>
                        <td>{prod.DateOfSearch.split(/((\d){2,4}-(\d){2,2}-(\d){2,2})/)[1]}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" style={{ color: "#7d0000" }} className="h6 text-center ">
                          Nenhum dado carregado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {numpages.length > 1 &&
              <nav aria-label="Navegação de página exemplo">
                <ul className="pagination justify-content-center">
                  {numpages.map((nps) => (
                    <li className="page-item" key={nps}><button name={nps}
                      className="page-link" href="#"
                      onClick={() => { onPagination(nps, true) }}
                    >{nps +1}</button></li>
                  ))}
                </ul>
              </nav>}

              <div className="container">
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
            </article>
          </section>
        )}
        {!load && <Footer />}
      </div>
    </>
  );
};

export default FavoritesComponent; 