import HomeComponent from "../components/HomeComponent";
import HistoryProduct from "../components/HistoryProduct";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Page from "../components/Page";

const PrivateRouteNav = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<HomeComponent />} />
                <Route path="/historicoProduto" element={<HistoryProduct />} />
                <Route path="*" element={<Page />} />
            </Routes>
        </BrowserRouter>
    )
}
export default PrivateRouteNav;