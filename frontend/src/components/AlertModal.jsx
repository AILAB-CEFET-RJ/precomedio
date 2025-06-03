import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createAlert, deleteAlert } from "../requests/requestsAlerts";

export function AlertModal({ status, changeStatus, searchString, deleteMode, alertId, updateAlerts }) {
  return (
    <>
      <Modal show={status} onHide={changeStatus} style={{ backgroundColor: 'transparent', backdropFilter: "blur(5px)", top: "20%" }}>
        <Modal.Header closeButton>
          <Modal.Title>{deleteMode ? "Deletar alerta para o produto" : "Criar alerta para o produto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {deleteMode ? "Você pode deletar o alerta para o produto." : "Você pode criar um alerta para o produto pesquisado. Assim que o preço atingir o valor desejado, você receberá uma notificação."}
          </p>
          {!deleteMode && (
            <form>
              <label
              >
                Preço desejado:
                <input type="number" />
              </label>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant={deleteMode ? "danger" : "primary"} onClick={async () => {
            try {
              if (deleteMode) {
                await deleteAlert(alertId);
                updateAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
              } else {
                const targetPrice = document.querySelector("input[type='number']").value;
                if (!targetPrice || isNaN(targetPrice) || targetPrice <= 0) {
                  alert("Por favor, insira um preço válido.");
                  return;
                }
                const data = await createAlert(searchString, targetPrice);
                updateAlerts(prevAlerts => [...prevAlerts, data]);
              }
              changeStatus();
            } catch (err) {
              console.log(err)
            }
          }}>
            {deleteMode ? "Deletar" : "Criar"}
          </Button>
        </Modal.Footer>
      </Modal >
    </>
  );
}
