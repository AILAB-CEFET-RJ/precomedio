import Login from "../components/Login";
import RegisteringUser from "../components/RegisteringUser";
import ResetPassword from "../components/ResetPassword";
import { Route, Routes, BrowserRouter } from "react-router-dom";
const PublicRouteNav = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/cadastrarUsuario" element={<RegisteringUser />} />
                <Route path="/" element={<Login />} />
                <Route path="/redefinirSenha" element={<ResetPassword />} />
            </Routes>
        </BrowserRouter>
    )
}
export default PublicRouteNav;