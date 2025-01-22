import { Link } from "react-router-dom";
import { useState, useContext } from 'react';
import { AuthContext } from "../context/Auth";
import Modal from "./Modal";
const Header = () => {
  const { setAuth } = useContext(AuthContext);
  const [open, setopen] = useState(false);
  
  return (<>
    <header className="bg-white shadow">
      <img id="logo"  src="images/preco_medio_logo.png" alt="Logo Preço Médio" />
      
      <nav className="bg-white" id="itens-navegacao">
        <div className="container mx-auto flex justify-between items-center bg-white">
          <div className="bg-white" >
            <Link to={"/historicoProduto"} >Favorito</Link>

            <Link to={"/"} onClick={() => {
              setAuth(false);
              localStorage.setItem("authToken", "")
            }} >Logout</Link>

            <button onClick={() => setopen(true)}>Sobre</button>
          </div>
        </div>
      </nav>
    </header>
    <Modal isopen={open} setClose={() => setopen(!open)} />
  </>)
}
export default Header;