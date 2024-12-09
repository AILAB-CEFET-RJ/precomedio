import Login from "../components/Login";
import RegisteringUser from "../components/RegisteringUser";
import ResetPassword from "../components/ResetPassword";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Page from "../components/Page";
const PublicRouteNav = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/cadastrarUsuario" element={<RegisteringUser />} />
                <Route path="/" element={<Login />} />
                <Route path="/redefinirSenha" element={<ResetPassword />} />
                <Route path="*" element={<Navigate to={"/"}/>} />
            </Routes>
        </BrowserRouter>
    )
}
export default PublicRouteNav;