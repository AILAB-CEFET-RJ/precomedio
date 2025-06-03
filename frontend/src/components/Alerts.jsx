import Header from "./Header";
import { getAlerts } from "../requests/requestsAlerts";
import { useState, useEffect } from "react";
import { FaRegTrashAlt  } from "react-icons/fa";
import { AlertModal } from "./AlertModal"


const Alerts = () => {
    const [alertPrices, setAlertPrices] = useState([]);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [lastSearch, setLastSearch] = useState("");
    const [isAlertCreated, setIsAlertCreated] = useState(false);

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
                            {/* <th id="item-header-table" className="align-middle" scope="col">Editar</th> */}
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
                                {/* <td>
                                    <button
                                        onClick={() => {}}
                                        type="button"
                                        className="btn"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                </td> */}
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

            <AlertModal status={showAlertModal} changeStatus={handleAlertModal} searchString={lastSearch} deleteMode={isAlertCreated} alertId={
                alertPrices.find(alert => alert.SearchString.toLowerCase() === lastSearch.toLowerCase())?.id
            } updateAlerts={setAlertPrices}

            />
        </>
    );
};

export default Alerts;
