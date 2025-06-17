import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/Auth";
import Modal from "./Modal";
const Header = () => {
  const { setAuth } = useContext(AuthContext);
  const [open, setopen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const getIdealPriceProductsFromLocalStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('idealPriceProducts') || '[]');
    } catch (error) {
      console.error('Erro ao recuperar produtos do localStorage:', error);
      return [];
    }
  };

  useEffect(() => {
    const updateNotificationCount = () => {
      const savedProducts = getIdealPriceProductsFromLocalStorage();
      setNotificationCount(savedProducts.length);
    };

    updateNotificationCount();

    const handleStorageChange = (e) => {
      if (e.key === 'idealPriceProducts') {
        updateNotificationCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(updateNotificationCount, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (<>
    <header className="bg-white shadow">
      <Link to="/">
        <img id="logo" src="images/preco_medio_logo.png" alt="Logo Preço Médio" />
      </Link>

      <nav className="bg-white" id="itens-navegacao">
        <div className="container mx-auto flex justify-between items-center bg-white">
          <div className="bg-white" >
            <Link to={"/historico"} >Histórico</Link>
            <Link to={"/favoritos"} >Favorito</Link>

            <Link to={"/"} onClick={() => {
              setAuth(false);
              localStorage.setItem("authToken", "")
            }} >Logout</Link>

            <div className="notification-container bg-white" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Link to={"/alertas"}>Alertas</Link>
              {notificationCount > 0 && (
                <span
                  className={`notification-badge ${notificationCount > 99 ? 'large-number' : ''} notification-badge-pulse`}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={`${notificationCount} produtos com preço ideal encontrados`}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </div>

            <button onClick={() => setopen(true)}>Sobre</button>
          </div>
        </div>
      </nav>
    </header>
    <Modal isopen={open} setClose={() => setopen(!open)} />
  </>)
}
export default Header;