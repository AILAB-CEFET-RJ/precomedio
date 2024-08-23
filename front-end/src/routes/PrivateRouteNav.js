import HomeComponent from "../components/HomeComponent";
import HistoryProduct from "../components/HistoryProduct";
import { Route, Routes, BrowserRouter } from "react-router-dom";

const PrivateRouteNav = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="/historicoProduto" element={<HistoryProduct />} />
            </Routes>
        </BrowserRouter>
    )
}
export default PrivateRouteNav;