import { useState, useEffect } from "react";
import { GetProducts, SaveFavoriteSearch, GetFavoriteSearches, DeleteFavoriteSearch } from "../requests/requestsProducts";
import Header from "./Header";
import Footer from "./Footer";
import { Pagination } from "./Pagination";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SchemaHome from "../schemas/SchemaHome";
import { FaHeart, FaBell } from "react-icons/fa";
import { getAlerts } from "../requests/requestsAlerts";
import { AlertModal } from "./AlertModal"
import { ToastContainer, toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const notify = (message) => toast(message, {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: true,
})

const HomeComponent = () => {
  const [productChosen, setProductChosen] = useState([]);
  const [statistical_mean, setStatistical_mean] = useState(null);
  const [statistical_lower, setStatistical_lower] = useState(null);
  const [numpages, setNumPages] = useState([]);
  const [load, setLoad] = useState(false);
  const [prodSlice, setProdSlice] = useState([])
  const [lastSearch, setLastSearch] = useState("");
  const [hasProducts, setHasProducts] = useState(false);
  const [favoritesSearches, setFavoritesSearches] = useState([]);
  const [isSearchFavorited, setIsSearchFavorited] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showOptionAlertModal, setShowOptionAlertModal] = useState(false);
  const [alertModalType, setAlertModalType] = useState("create");
  const [alertPrices, setAlertPrices] = useState([])
  const [isAlertCreated, setIsAlertCreate] = useState(false)
  let num = 0;
  let listNum = [];
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(SchemaHome)
  });

  const saveIdealPriceProductsToLocalStorage = (products) => {
    try {
      const existingProducts = JSON.parse(localStorage.getItem('idealPriceProducts') || '[]');
      
      const newProducts = products.filter(newProd => 
        !existingProducts.some(existingProd => 
          existingProd.Model === newProd.Model && 
          existingProd.Supplier === newProd.Supplier &&
          existingProd.Price === newProd.Price
        )
      );
      
      const productsWithTimestamp = newProducts.map(prod => ({
        ...prod,
        savedAt: new Date().toISOString()
      }));
      
      const updatedProducts = [...existingProducts, ...productsWithTimestamp];
      
      localStorage.setItem('idealPriceProducts', JSON.stringify(updatedProducts));
      
      console.log(`${newProducts.length} produtos com preço ideal salvos no localStorage`);
      
      return newProducts.length;
    } catch (error) {
      console.error('Erro ao salvar produtos no localStorage:', error);
      return 0;
    }
  };

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

  const loadPriceAlerts = async () => {
    try {
      const response = await getAlerts();
      setAlertPrices(response)
    } catch (err) {
      alert("Erro ao carregar alerta de preços")
      console.log(err)
    }
  }

  useEffect(() => {
    loadFavoritesSearches();
    loadPriceAlerts();
  }, [hasProducts]);

  useEffect(() => {
    const isAlreadyFavorited = favoritesSearches.some(
      fav => fav.search_string.toLowerCase() === lastSearch.toLowerCase()
    );

    setIsSearchFavorited(isAlreadyFavorited);
  }, [lastSearch, favoritesSearches]);

  useEffect(() => {
    const isAlreadyAlerted = alertPrices.some(
      alert => alert.SearchString.toLowerCase() === lastSearch.toLowerCase()
    );

    setIsAlertCreate(isAlreadyAlerted);
  }, [lastSearch, alertPrices])

  const handleSaveSearch = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Usuário não autenticado.");
        return;
      }

      if (!lastSearch) {
        alert("Nenhuma busca realizada.");
        return;
      }

      if (isSearchFavorited) {
        const favorite = favoritesSearches.find(
          fav => fav.search_string.toLowerCase() === lastSearch.toLowerCase()
        );

        if (favorite) {
          try {
            await DeleteFavoriteSearch(favorite.id);
            alert("Busca favorita deletada com sucesso!");
          } catch (error) {
            alert("Erro ao deletar a busca favorita.");
          }
        }

      } else {
        await SaveFavoriteSearch(lastSearch, Number(userId));
        alert("Busca salva com sucesso!");
      }

      await loadFavoritesSearches();
    } catch (e) {
      alert("Erro ao salvar ou deletar a busca.");
      console.error("Erro:", e);
    }
  };

  const onSubmit = async (data1) => {
    setLoad(true);

    try {
      let res = await GetProducts(data1.search_product_home);
      let { products, mean, lowestPrice } = res;

      if (products) setHasProducts(true)

      setProdSlice(products);
      [products, listNum] = Pagination(products, num, null);
      setNumPages([...listNum]);
      setStatistical_lower(lowestPrice);
      setStatistical_mean(mean);
      setProductChosen(products);
      setLastSearch(data1.search_product_home);
    } catch (e) {
      alert("Erro no servidor");
    }
    setLoad(false);
  }

  const handleOptionAlertModal = () => {
    setShowOptionAlertModal(!showOptionAlertModal);
  }

  const handleAlertModal = () => {
    setShowAlertModal(!showAlertModal);
  }

  useEffect(() => {
    if (alertPrices.length > 0 && productChosen.length > 0) {
      const productChosenAlerts = alertPrices.filter(alert => {
        return productChosen.some(prod => prod.SearchString.replace("+", " ") === alert.SearchString.toLowerCase())
      });

      if (productChosenAlerts.length > 0) {
        const productsWithIdealPrice = productChosen.filter(prod => {
          return productChosenAlerts.some(alert => Number(prod.Price) < Number(alert.target_price))
        });

        if (productsWithIdealPrice.length > 0) {
          saveIdealPriceProductsToLocalStorage(productsWithIdealPrice);
          notify(`Alerta de Preço: Há ${productsWithIdealPrice.length} produtos com preço abaixo do esperado!`);
          
        }
      }
    }
  }, [productChosen, alertPrices]);

  return (
    <>
      <div id="container-fluid container2">
        <Header />
        {load ? <div><img src={"images/loading.gif"} className="imageIconeLoad" alt="Loading" /></div> :
          <section className="pt-5">
            <article>
              <form className="row gy-2 gx-3  align-items-center">
                <div className="col-auto">
                  <div className="input-group">
                    <input type="text"  {...register("search_product_home")} className="form-control w-100" name="search_product_home" id="search_product_home" placeholder="Exemplo: iphone12 256gb" />
                  </div>
                </div>
                <div className="col-auto">
                  <div className="col-auto">
                    <button id="enviar-produto-pesquisa" className="btn" onClick={handleSubmit(onSubmit)}>Pesquisar iphone</button>
                    <button id="limpar-produto" onClick={() => { reset(); setHasProducts(false) }} className="btn btn-danger mx-1">Limpar</button>
                    {hasProducts && <button
                      id="salvar-busca"
                      type="button"
                      className="btn"
                      onClick={handleSaveSearch}
                      title={isSearchFavorited ? "Remover dos favoritos" : "Salvar nos favoritos"}
                    >
                      <FaHeart size={20} color={isSearchFavorited ? "red" : "black"} />
                    </button>}
                    {hasProducts &&
                      <button
                        onClick={() => {
                          if (!isAlertCreated) {
                            setAlertModalType("create");
                            handleAlertModal();
                          } else {
                            handleOptionAlertModal();
                          }
                        }}
                        type="button"
                        className="btn">
                        <FaBell size={20} color={isAlertCreated ? "yellow" : "black"} />
                      </button>}
                  </div>
                </div>
              </form>
              <div style={{ color: "orange" }}>{errors.search_product_home?.message}</div>
            </article>
            <article id="table-home">
              <div className="table-responsive ">
                <table className="table table-striped ">
                  <thead className="thead-dark">
                    <tr >
                      <th id="item-statistic-table" scope="col" className="text-center">Média</th>
                      <th id="item-statistic-table" scope="col" className="text-center">Menor valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">{statistical_mean ? statistical_mean : <span style={{ backgroundColor: "#f2f2f2", color: "red" }}>-</span>}</td>
                      <td className="text-center">{statistical_lower ? statistical_lower : <span style={{ backgroundColor: "#f2f2f2", color: "red" }}>-</span>}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
            <article id="table-home">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr >
                      <th id="item-header-table" className="align-middle" scope="col">Modelo</th>
                      <th id="item-header-table" className="align-middle" scope="col">Preço</th>
                      <th id="item-header-table" className="align-middle" scope="col">Fornecedor</th>
                      <th id="item-header-table" className="align-middle" scope="col">Armazenamento</th>
                      <th id="item-header-table" className="align-middle" scope="col">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productChosen.length > 0 && productChosen ? productChosen.map((prod, i) => (
                      <tr key={i}>
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
            </article>
            {numpages.length > 1 &&
              <nav aria-label="Navegação de página exemplo">
                <ul className="pagination justify-content-center">
                  {numpages.map((nps) => (
                    <li className="page-item" key={nps}><button name={nps}
                      className="page-link" href="#"
                      onClick={() => { onPagination(nps, true) }}
                    >{nps + 1}</button></li>
                  ))}
                </ul>
              </nav>}
          </section>
        }{!load && <Footer />}
      </div>
      <Modal show={showOptionAlertModal} onHide={handleOptionAlertModal} style={{ backgroundColor: 'transparent', backdropFilter: "blur(5px)", top: "20%" }}>
        <Modal.Header>
          <Modal.Title>Deletar ou editar o alerta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você deseja deletar ou editar o alerta?</p>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", backgroundColor: "transparent" }}>
            <Button variant="danger" onClick={() => {
              setAlertModalType("delete");
              setShowOptionAlertModal(false);
              setShowAlertModal(true);
            }}>Deletar</Button>
            <Button variant="primary" onClick={() => {
              setAlertModalType("edit");
              setShowOptionAlertModal(false);
              setShowAlertModal(true);
            }}>Editar</Button>
          </div>
        </Modal.Footer>
      </Modal>
      <AlertModal status={showAlertModal} changeStatus={handleAlertModal} searchString={lastSearch} deleteMode={alertModalType === "delete"} editMode={alertModalType === "edit"} alertId={
        alertPrices.find(alert => alert.SearchString.toLowerCase() === lastSearch.toLowerCase())?.id
      } updateAlerts={setAlertPrices}
      />
      <ToastContainer style={{ top: "160px", backgroundColor: "transparent" }} />
    </>
  );

}

export default HomeComponent;