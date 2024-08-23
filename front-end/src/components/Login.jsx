import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PostUsersLogin } from "../requests/requestsUsers";
import { AuthContext } from "../context/Auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SchemaLogin from "../schemas/SchemaLogin";
const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const nav = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(SchemaLogin)
    });
    const [errorForm,setErroForm] = useState(false);
    const [messageErrorForm] = useState("Erro no usuário ou senha");
    const onSubmit = async (data1) => {
        let { token } = await PostUsersLogin(data1.user, data1.password);
        if (token !== undefined) {
            localStorage.setItem("authToken", token)
            setAuth(true)
            nav("/");
        } else {
            setErroForm(true);
            nav("/");
        }
    }
    return (
        <div id="container_login">
            <section id="secao_login">
                <img src="../images/iconeUsuario.avif" id="icone_usuario" alt="icone login" />
                <h3 className="my-1">Login</h3>
                <h6 style={{ color: "orange" }}>{errorForm && messageErrorForm}</h6>
                <form className="my-3" >
                    <label htmlFor="user">
                        <input type="text" {...register("user")} name="user" id="user" placeholder="nome do usuário" />
                    </label>
                    <div style={{ color: "orange" }}>{errors.user?.message}</div>
                    <label htmlFor="password">
                        <input type="password" {...register("password")} name="password" id="password" placeholder="senha" />
                    </label>
                    <div style={{ color: "orange" }}>{errors.password?.message}</div>
                    <label className="my-3" id="enviar_dados_login">
                        <button id="enviar_login" onClick={handleSubmit(onSubmit)}>Enviar</button>
                    </label>
                </form>
                <div className="my-3" id="alterar_login">
                    <h5><Link to="/redefinirSenha" className="text-light h5" >redefinir senha</Link></h5>
                    <h6><Link to="/CadastrarUsuario" className="text-light h6">cadastrar</Link> </h6>
                </div>
            </section>
        </div>

    )
}
export default Login;