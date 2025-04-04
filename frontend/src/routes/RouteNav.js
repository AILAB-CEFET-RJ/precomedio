import { AuthContext } from "../context/Auth";
import { useContext, useEffect } from "react";
import PrivateRouteNav from "./PrivateRouteNav";
import PublicRouteNav from "./PublicRouteNav";

const RouteNav = () => {
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
  setAuth(localStorage.getItem("authToken"))
  }, [setAuth]);

  return (
    <>
      {auth ? <PrivateRouteNav /> : <PublicRouteNav />}
    </>
  );
}
export default RouteNav;
