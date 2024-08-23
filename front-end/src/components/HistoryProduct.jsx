import { useState } from "react";
import { GetProducts } from "../requests/requestsProducts";
import Header from "./Header";
import { Pagination } from "./Pagination";
const HistoryProduct = () => {
  const [historicoEscolhido, setProdutoEscolhido] = useState([]);
  const [setParametros_Estatisticos] = useState([]);
  const [numpages, setNumPages] = useState([]);
  const [setLoad] = useState(false);
  let num = 0;
  let listNum = []
  const fetchGetProdutos = async (e) => {
    e.preventDefault();
    setLoad(true);
    let { data, dadosEstatisticos } = await GetProducts();
    setParametros_Estatisticos(dadosEstatisticos);
    [data, listNum] = Pagination(data, num, e.target.name)
    setNumPages([...listNum]);
    setProdutoEscolhido(data);
    setLoad(false);
  }
  return (
    <div id="container-fluid container2">
      <Header mainTitle="Favorito" title="Home" path="/" />
      <article id="table-home">
        <div class="table-responsive">
          <table class="table table-striped ">
            <thead class="thead-dark">
              <tr>
                <th class="align-middle text-success" scope="col">Modelo</th>
                <th class="align-middle text-success" scope="col">Preço</th>
                <th class="align-middle text-success" scope="col">Fornecedor</th>
                <th class="align-middle text-success" scope="col">Marca</th>
                <th class="align-middle text-success" scope="col">Armazenamento GB</th>
                <th class="align-middle text-success" scope="col">Data</th>
              </tr>
            </thead>
            <tbody>
              {historicoEscolhido.length > 0 ? historicoEscolhido.map((prod, ids) => (
                <tr key={ids}>
                  <th hidden="hidden" className="align-middle idProduto">{prod.ProductId}</th>
                  <td>{prod.Model}</td>
                  <td>R$ {prod.Price}</td>
                  <td>{prod.Supplier}</td>
                  <td>{prod.Brand}</td>
                  <td> {prod.StorageGB}</td>
                  <td>{prod.DateOfSearch}</td>
                  <td id="img-lixeira"  >
                    <img title="editar produto" id={prod.id} className="mx-3 btn-editar-produto" src="images/editar.jpg" alt="editar" />
                    <img title="excluir produto" id={prod.id} className="deletarProduto deletProduto" src="images/lixeira.jpg" alt="excluir" />

                  </td>
                </tr>)) : <h5 className="h6 text-danger">Nenhum dado carregado</h5>
              }</tbody>
          </table>
        </div>
      </article>
      {numpages.length > 0 &&
        <nav aria-label="Navegação de página exemplo">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <button className="page-link" href="#" name={0} onClick={(e) => {
                fetchGetProdutos(e)
              }} >Primeiro</button>
            </li>
            {numpages.map((nps) => (
              <li className="page-item" key={nps}><button name={nps} onClick={(e) => {
                fetchGetProdutos(e)
              }}
                className="page-link" href="#">{nps + 1}</button></li>
            ))}
            <li className="page-item">
              <button className="page-link" href="#" name={numpages.length - 1} onClick={(e) => {
                fetchGetProdutos(e)
              }}>Último</button>
            </li>
          </ul>
        </nav>}
    </div>
  )
}
export default HistoryProduct;