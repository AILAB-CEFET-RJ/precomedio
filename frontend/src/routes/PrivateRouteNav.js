import HomeComponent from "../components/HomeComponent";
import HistoryProduct from "../components/HistoryProduct";
import ProductPage from "../components/Product"
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import FavoritesComponent from "../components/FavoritesComponent";
import AlertsPage from "../components/Alerts";

const PrivateRouteNav = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="/favoritos" element={<FavoritesComponent />} />
                <Route path="*" element={<Navigate to={"/"} />} />
                <Route path="/historico" element={<HistoryProduct />} />
                <Route path="/produto" element={<ProductPage />} />
                <Route path="/alertas" element={<AlertsPage />} />
            </Routes>
        </BrowserRouter>
    )
}
export default PrivateRouteNav;