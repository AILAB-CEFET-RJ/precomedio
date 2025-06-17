import Header from "./Header";
import { getAlerts } from "../requests/requestsAlerts";
import { useState, useEffect } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { AlertModal } from "./AlertModal"


const Alerts = () => {
  const [alertPrices, setAlertPrices] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [isAlertCreated, setIsAlertCreated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPrice, setCurrentPrice] = useState("");
  const [alertProducts, setAlertProducts] = useState([]);

  const loadPriceAlerts = async () => {
    try {
      const response = await getAlerts();
      setAlertPrices(response);
    } catch (err) {
      alert("Erro ao carregar alerta de preços");
      console.log(err);
    }
  };

  const loadAlertProducts = () => {
    try {
        const storedProducts = localStorage.getItem('idealPriceProducts');
        if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setAlertProducts(parsedProducts);
      } else {
        setAlertProducts([]);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos de alerta do localStorage:", error);
      setAlertProducts([]);
    }
  };

  useEffect(() => {
    loadPriceAlerts()
    loadAlertProducts();
  }, []);


  const handleAlertModal = () => {
    setShowAlertModal(!showAlertModal);
  }

  const handleDeleteAlertModal = (alert) => {
    setLastSearch(alert.SearchString);
    setIsAlertCreated(true);
    setEditMode(false);
    setShowAlertModal(true);
  };

  const handleEditAlertModal = (alert) => {
    setLastSearch(alert.SearchString);
    setIsAlertCreated(false);
    setEditMode(true);
    setCurrentPrice(alert.target_price);
    setShowAlertModal(true);
  };

  return (
      <>
        <div id="container-fluid container2">
          <Header />

          <section className="pt-5">
            <article>
              <div className="container">
                <table className="table table-striped">
                  <thead className="thead-dark">
                    <tr >
                        <th id="item-header-table" className="align-middle" scope="col">Id</th>
                        <th id="item-header-table" className="align-middle" scope="col">Busca</th>
                        <th id="item-header-table" className="align-middle" scope="col">Meta de Preço</th>
                        <th id="item-header-table" className="align-middle" scope="col">Excluir</th>
                        {<th id="item-header-table" className="align-middle" scope="col">Editar</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {alertPrices.length > 0 && alertPrices ? alertPrices.map((alert, i) => (
                        <tr
                            key={i}
                        >
                            <td>{alert.id}</td>
                            <td>{alert.SearchString}</td>
                            <td>{alert.target_price}</td>
                            <td>
                                <button
                                    onClick={() => handleDeleteAlertModal(alert)}
                                    type="button"
                                    className="btn bg-danger"
                                >
                                    <FaRegTrashAlt size={20} className="bg-danger text-white" />
                                </button>
                            </td>
                            {<td>
                                <button
                                    onClick={() => handleEditAlertModal(alert)}
                                    type="button"
                                    className="btn bg-success"
                                >
                                    <FaEdit size={20} className="bg-success text-white" />
                                </button>
                            </td>}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" style={{ color: "#7d0000" }} className="h6 text-center ">
                                Nenhum alerta criado
                            </td>
                        </tr>
                    )}
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
                    {alertProducts.length > 0 ? alertProducts.map((prod, i) => (
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
          </section>
        </div>

      <AlertModal status={showAlertModal} changeStatus={handleAlertModal} searchString={lastSearch} deleteMode={isAlertCreated} editMode={editMode} alertId={
          alertPrices.find(alert => alert.SearchString.toLowerCase() === lastSearch.toLowerCase())?.id
      } currentPrice={currentPrice} updateAlerts={setAlertPrices}

      />
    </>
  );
};

export default Alerts;
