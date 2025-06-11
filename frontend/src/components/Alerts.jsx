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

    const loadPriceAlerts = async () => {
        try {
            const response = await getAlerts();
            setAlertPrices(response);
        } catch (err) {
            alert("Erro ao carregar alerta de preços");
            console.log(err);
        }
    };

    useEffect(() => {
        loadPriceAlerts()
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
