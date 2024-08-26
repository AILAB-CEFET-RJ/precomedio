import { useState } from "react";
import { GetProducts } from "../requests/requestsProducts";
import Header from "./Header";
import Footer from "./Footer";
import { Pagination } from "./Pagination";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SchemaHome from "../schemas/SchemaHome";
import { GetStatisticMeanProduct,GetStatisticLowerProduct } from "../requests/StatisticProduct";
const HomeComponent = () => {
  const [productChosen, setProductChosen] = useState([]);
  const [statistical_mean, setStatistical_mean] = useState(null);
  const [statistical_lower, setStatistical_lower] = useState(null);
  const [numpages, setNumPages] = useState([]);
  const [data2, setData2] = useState("");
  const [load, setLoad] = useState(false);
  let num = 0;
  let listNum = []
  const { register, handleSubmit,reset, formState: { errors } } = useForm({
    resolver: yupResolver(SchemaHome)
  });
  const onSubmit = async(data1, e, check = false) => {
    let n = null;
    setData2(data1);
    if (!check) {
      n = e.target.name;
    } else {
      n = e;
    }
    setLoad(true);
    let res = await Promise.all([
       GetStatisticMeanProduct(data1.search_product_home),
       GetStatisticLowerProduct(data1.search_product_home),
       GetProducts(data1.search_product_home)
    ]);
    let [dataStatisticMean,dataStatisticLower,prods] = res;
      [prods, listNum] = Pagination(prods, num, n);
      setNumPages([...listNum]);
      setStatistical_mean(dataStatisticMean);
      setStatistical_lower(dataStatisticLower);
      setProductChosen(prods);
      setLoad(false);
  }
  return (
    <>
  
    <div id="container-fluid container2">
      <Header mainTitle="Preço Médio" title="Favorito" path="/historicoProduto" />
      {load ? <div><img src={"images/loading.gif"} className="imageIconeLoad" /></div> :
      <section>
          <article>
            <form className="row gy-2 gx-3  align-items-center">
              <div className="col-auto">
                <div className="input-group">
                  <input type="text"  {...register("search_product_home")} className="form-control w-100" name="search_product_home" id="search_product_home" placeholder="Exemplo: iphone12 256gb" />
                </div>
              </div>
              <div className="col-auto">
                <div className="col-auto">
                  <button id="enviar-produto-pesquisa" className="btn btn-primary" onClick={handleSubmit(onSubmit)}>Pesquisar iphone</button>
                  <button id="limpar-produto"  onClick={()=>reset()} className="btn btn-danger mx-1">Limpar</button>
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
                  <th scope="col" className="text-success">Média</th>
                   {/*<th scope="col" className="text-success">Mediana</th>
                  <th scope="col" className="text-success">Desvio Padrão</th>
                  <th scope="col" className="text-success">Variância</th>*/}
                  <th scope="col" className="text-success">Menor valor</th>
                   {/*<th scope="col" className="text-success">Maior valor</th>*/}
                </tr>
              </thead>
              <tbody>
                {statistical_mean && statistical_lower ?
                  <tr>
                    <td>{statistical_mean.replace(".",",")}</td>
                    {/*
                    <td>-</td>
                    <td>-</td>
                    <td>-</td> */}
                    <td>{statistical_lower.replace(".",",")}</td>
                     {/*<td>-</td>*/}
                  </tr>
                : <h5 className="h6 text-danger">Nenhum dado carregado</h5>
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
                  <th class="align-middle text-primary" scope="col">Armazenamento</th>
                  <th class="align-middle text-primary" scope="col">Data</th>
                </tr>
              </thead>
              <tbody>
                {productChosen.length > 0 ? productChosen.map((prod, i) => (
                  <tr key={i}>
                    <th hidden="hidden" className="align-middle idProduto">{prod.ProductId}</th>
                    <td>{prod.Model}</td>
                    <td>R$ {prod.Price.replace(".",",")}</td>
                    <td>{prod.Supplier}</td>
                    <td> {prod.SearchString.split(" ")[1]}</td>
                    <td>{prod.DateOfSearch.split(/((\d){2,4}-(\d){2,2}-(\d){2,2})/)[1]}</td>
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
        {numpages.length >= 1 &&
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
      }{!load && <Footer />}
    </div>
    </>
  );

}
export default HomeComponent;