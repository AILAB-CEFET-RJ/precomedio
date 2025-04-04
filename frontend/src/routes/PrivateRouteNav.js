import HomeComponent from "../components/HomeComponent";
// import HistoryProduct from "../components/HistoryProduct";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
// import Page from "../components/Page";
import FavoritesComponent from "../components/FavoritesComponent";

const PrivateRouteNav = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="/favoritos" element={<FavoritesComponent />} />
                <Route path="*" element={<Navigate to={"/"}/>} />
            </Routes>
        </BrowserRouter>
    )
}
export default PrivateRouteNav;