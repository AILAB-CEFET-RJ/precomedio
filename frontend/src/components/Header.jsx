import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from 'react';
import { AuthContext } from "../context/Auth";
import Modal from "./Modal";
const Header = (props) => {
  const { setAuth } = useContext(AuthContext);
  let nav = useNavigate();
  const [open, setopen] = useState(false);
  return (<>
    <header>
      <h4 className="title" style={{ color: "blue", fontSize: "26px" }}>{props.mainTitle}</h4>
      <nav className="navbar navbar-light bg-light" id="itens-navegacao">
        <div className="container-fluid">
          <div className="navbar-text">
            <Link to={props.path} className="btn text-primary btn-light btn-sm">{props.title}</Link>
            <button style={{ border: "none", outline: "none", fontSize: "15px" }} onClick={() => {
              setAuth(false);
              localStorage.setItem("authToken", "")
              nav("/");
            }} className="btn bg-light">Logout </button>
            <button style={{ border: "none", outline: "none", fontSize: "15px" }} className="btn bg-light" onClick={() => setopen(true)} >Sobre</button>
          </div>
        </div>
      </nav>
    </header>
    <Modal isopen={open} setClose={() => setopen(!open)} />
  </>)
}
export default Header;