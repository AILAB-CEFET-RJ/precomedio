import { AuthContext } from "../context/Auth";
import { useContext } from "react";
import PrivateRouteNav from "./PrivateRouteNav";
import PublicRouteNav from "./PublicRouteNav";

const RouteNav = () => {
  const { auth } = useContext(AuthContext);
  return (
    <>
      {auth ? <PrivateRouteNav /> : <PublicRouteNav />}
    </>
  );
}
export default RouteNav;
