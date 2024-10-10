import { AuthContext } from "../context/Auth";
import { useContext } from "react";
import PrivateRouteNav from "./PrivateRouteNav";
import PublicRouteNav from "./PublicRouteNav";



const RouteNav = () => {
  const { auth, setAuth } = useContext(AuthContext);
  setAuth(localStorage.getItem("authToken"))
  return (
    <>
      {auth ? <PrivateRouteNav /> : <PublicRouteNav />}
    </>
  );
}
export default RouteNav;
