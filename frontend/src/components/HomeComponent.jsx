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
  const [statistical_mean, setStatistical_mean] = useState(null);
  const [statistical_lower, setStatistical_lower] = useState(null);
  const [numpages, setNumPages] = useState([]);
  const [load, setLoad] = useState(false);
  const [prodSlice, setProdSlice] = useState([])
  let num = 0;
  let listNum = [];
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(SchemaHome)
  });
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
  const onSubmit = async (data1) => {
    setLoad(true);

    try {
      let res = await GetProducts(data1.search_product_home);
      let { products, mean, lowestPrice } = res;

      setProdSlice(products);
      [products, listNum] = Pagination(products, num, null);
      setNumPages([...listNum]);
      setStatistical_lower(lowestPrice);
      setStatistical_mean(mean);
      setProductChosen(products);
    } catch (e) {
      alert("Erro no servidor");
      console.log("Erro no servidor");
    }
    setLoad(false);

  }
  return (
    <>
      <div id="container-fluid container2">
        <Header/>
        {load ? <div><img src={"images/loading.gif"} className="imageIconeLoad" /></div> :
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
                    <button id="limpar-produto" onClick={() => reset()} className="btn btn-danger mx-1">Limpar</button>
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
                      {/*<th scope="col" className="text-success">Mediana</th>
                  <th scope="col" className="text-success">Desvio Padrão</th>
                  <th scope="col" className="text-success">Variância</th>*/}
                      <th id="item-statistic-table" scope="col" className="text-center">Menor valor</th>
                      {/*<th scope="col" className="text-success">Maior valor</th>*/}
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td className="text-center">{statistical_mean ? statistical_mean:<span style={{ backgroundColor:"#f2f2f2", color:"red"}}>-</span>}</td>
                        {/*
                    <td>-</td>
                    <td>-</td>
                    <td>-</td> */}
                        <td className="text-center">{statistical_lower ? statistical_lower:<span style={{backgroundColor:"#f2f2f2",color:"red"}}>-</span>}</td>
                        {/*<td>-</td>*/}
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
                        <th hidden="hidden" className="align-middle idProduto">{prod.ProductId}</th>
                        <td>{prod.Model}</td>
                        <td>R$ {prod.Price.replace(".", ",")}</td>
                        <td>{prod.Supplier}</td>
                        <td> {prod.SearchString.split(" ")[1]}</td>
                        <td>{prod.DateOfSearch.split(/((\d){2,4}-(\d){2,2}-(\d){2,2})/)[1]}</td>
                      </tr>)) : <h5 style={{color: "#7d0000"}} className="h6">Nenhum dado carregado</h5>
                    }
                  </tbody>
                </table>
                {productChosen && <tr className="my-5">
                  <td className="d-flex my-3 align-items-center justify-content-end"><button style={{backgroundColor: "#fcfd87", color: "#2f3f2e"}} className="btn btn-sm">Adicionar ao favorito</button></td>
                </tr>
                }
              </div>
            </article>
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
          </section>
        }{!load && <Footer />}
      </div>
    </>
  );

}
export default HomeComponent;