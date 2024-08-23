import { useState } from "react";
import { GetProducts } from "../requests/requestsProducts";
import Header from "./Header";
import Footer from "./Footer";
import { Pagination } from "./Pagination";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SchemaHome from "../schemas/SchemaHome";
const HomeComponent = () => {
  const [productChosen, setProductChosen] = useState([]);
  const [statistical_parameters, setStatistical_Parameters] = useState([]);
  const [numpages, setNumPages] = useState([]);
  const [data2, setData2] = useState("");
  const [load, setLoad] = useState(false);
  let num = 0;
  let listNum = []
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(SchemaHome)
  });
  const onSubmit = async (data1, e, check = false) => {
    let n = null;
    setData2(data1);
    if (!check) {
      n = e.target.name;
    } else {
      n = e;
    }
    setLoad(true);
    let { data, dataStatistic } = await GetProducts();
    if (data) {
      [data, listNum] = Pagination(data, num, n);
      setNumPages([...listNum]);
      setStatistical_Parameters(dataStatistic);
      setProductChosen(data);
    }
    setLoad(false);
  }
  return (
    <div id="container-fluid container2">
      <Header mainTitle="Preço Médio" title="Favorito" path="/historicoProduto" />
      <section>
        {load ? <h>carregando</h> :
          <article>
            <form className="row gy-2 gx-3  align-items-center">
              <div className="col-auto">
                <div className="input-group">
                  <input type="text"  {...register("search_product_home")} className="form-control w-100" name="search_product_home" id="search_product_home" placeholder="produto" />
                </div>
              </div>
              <div className="col-auto">
                <div className="col-auto">
                  <button id="enviar-produto-pesquisa" className="btn btn-primary" onClick={handleSubmit(onSubmit)}>Enviar Pesquisa</button>
                  <button id="limpar-produto" className="btn btn-danger mx-1">Limpar</button>
                </div>
              </div>
            </form>
            <div style={{ color: "orange" }}>{errors.search_product_home?.message}</div>
          </article>}
        <article id="table-home">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" className="text-success">Média</th>
                  <th scope="col" className="text-success">Mediana</th>
                  <th scope="col" className="text-success">Desvio Padrão</th>
                  <th scope="col" className="text-success">Variância</th>
                  <th scope="col" className="text-success">Menor valor</th>
                  <th scope="col" className="text-success">Maior valor</th>
                </tr>
              </thead>
              <tbody>
                {statistical_parameters.length > 0 ? statistical_parameters.map((parametros, i) => (
                  <tr key={i}>
                    <td>{parametros.media}</td>
                    <td>{parametros.mediana}</td>
                    <td>{parametros.desvio_padrao}</td>
                    <td>{parametros.variancia}</td>
                    <td>{parametros.menor_valor_encontrado}</td>
                    <td>{parametros.maior_valor_encontrado}</td>
                  </tr>
                )) : <h5 className="h6 text-danger">Nenhum dado carregado</h5>
                }
              </tbody>
            </table>
          </div>
        </article>
        <article id="table-home">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th class="align-middle text-primary" scope="col">Modelo</th>
                  <th class="align-middle text-primary" scope="col">Preço</th>
                  <th class="align-middle text-primary" scope="col">Fornecedor</th>
                  <th class="align-middle text-primary" scope="col">Marca</th>
                  <th class="align-middle text-primary" scope="col">Armazenamento GB</th>
                  <th class="align-middle text-primary" scope="col">Data</th>
                </tr>
              </thead>
              <tbody>
                {productChosen.length > 0 ? productChosen.map((prod, i) => (
                  <tr key={i}>
                    <th hidden="hidden" className="align-middle idProduto">{prod.ProductId}</th>
                    <td>{prod.Model}</td>
                    <td>R$ {prod.Price}</td>
                    <td>{prod.Supplier}</td>
                    <td>{prod.Brand}</td>
                    <td> {prod.StorageGB}</td>
                    <td>{prod.DateOfSearch}</td>
                  </tr>)) : <h5 className="h6 text-danger">Nenhum dado carregado</h5>
                }
              </tbody>
            </table>
            {productChosen && <tr className="my-5">
              <td className="d-flex my-5 align-items-center justify-content-end"><button className="text-success text-light border-warning btn btn-warning btn-sm">Adicionar ao favorito</button></td>
            </tr>
            }
          </div>
        </article>
        {numpages.length > 0 &&
          <nav aria-label="Navegação de página exemplo">
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button className="page-link" href="#" name={0}
                  onClick={() => { onSubmit(data2, 0, true) }}
                >Primeiro</button>
              </li>
              {numpages.map((nps) => (
                <li className="page-item" key={nps}><button name={nps}
                  className="page-link" href="#"
                  onClick={() => { onSubmit(data2, nps, true) }}
                >{nps + 1}</button></li>
              ))}
              <li className="page-item">
                <button className="page-link" href="#" name={numpages.length - 1} onClick={() => { onSubmit(data2, numpages.length - 1, true) }} >Último</button>
              </li>
            </ul>
          </nav>}
      </section>
      <Footer />
    </div>

  );

}
export default HomeComponent;