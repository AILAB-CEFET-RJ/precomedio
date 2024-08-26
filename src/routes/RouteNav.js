import { AuthContext } from "../context/Auth";
import { useContext } from "react";
import PrivateRouteNav from "./PrivateRouteNav";
import PublicRouteNav from "./PublicRouteNav";



const RouteNav = () => {
  const { auth, setAuth } = useContext(AuthContext);
  console.log("Entrou aqui: "+auth)
  console.log("Entrou aqui: "+localStorage.getItem("authToken"))
  setAuth(localStorage.getItem("authToken"))
  return (
    <>
      {auth ? <PrivateRouteNav /> : <PublicRouteNav />}
    </>
  );
}
export default RouteNav;
