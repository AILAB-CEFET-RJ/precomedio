import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createAlert, deleteAlert, updateAlert } from "../requests/requestsAlerts";
import { useState, useEffect } from "react";

export function AlertModal({ status, changeStatus, searchString, deleteMode, editMode, alertId, updateAlerts, currentPrice }) {
  const [priceInput, setPriceInput] = useState("");

  useEffect(() => {
    if (editMode || !deleteMode) {
      setPriceInput(currentPrice || "");
    }
  }, [status, currentPrice, editMode, deleteMode]);

  const handleConfirm = async () => {
    try {
      if (deleteMode) {
        await deleteAlert(alertId);
        updateAlerts(prev => prev.filter(alert => alert.id !== alertId));
      } else if (editMode) {
        if (!priceInput || isNaN(priceInput) || priceInput <= 0) {
          alert("Insira um preço válido.");
          return;
        }
        const updated = await updateAlert(alertId, priceInput);
        updateAlerts(prev =>
          prev.map(alert =>
            alert.id === alertId ? updated : alert
          )
        );
      } else {
        if (!priceInput || isNaN(priceInput) || priceInput <= 0) {
          alert("Insira um preço válido.");
          return;
        }
        const created = await createAlert(searchString, priceInput);
        updateAlerts(prev => [...prev, created]);
      }
      changeStatus();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal show={status} onHide={changeStatus} style={{ backgroundColor: 'transparent', backdropFilter: "blur(5px)", top: "20%" }}>
      <Modal.Header closeButton>
        <Modal.Title>
          {deleteMode
            ? "Deletar alerta"
            : editMode
              ? "Editar alerta"
              : "Criar alerta"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {deleteMode
            ? "Tem certeza que deseja deletar esse alerta?"
            : "Você pode criar um alerta para o produto pesquisado. Assim que o preço atingir o valor desejado, você receberá uma notificação."}
        </p>
        {!deleteMode && (
          <form>
            <label>Preço desejado:</label>
            <input
              type="number"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="form-control"
            />
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant={deleteMode ? "danger" : "primary"} onClick={handleConfirm}>
          {deleteMode ? "Deletar" : editMode ? "Salvar" : "Criar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
