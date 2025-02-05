import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PostUsersLogin } from "../requests/requestsUsers";
import { AuthContext } from "../context/Auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SchemaLogin from "../schemas/SchemaLogin";

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const [load, setLoad] = useState(false);
    const nav = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(SchemaLogin)
    });
    const [errorForm, setErroForm] = useState(false);
    const [messageErrorForm] = useState("Erro no usuário ou senha");
    const onSubmit = async (data1) => {
        setLoad(true);
        try {
            let response = await PostUsersLogin(data1.user, data1.password);
            if (response && response.token) {
                localStorage.setItem("authToken", response.token);
                localStorage.setItem("userId", response.userId);
                setAuth(true);
                nav("/");
            } else {
                setErroForm(true);
            }
        } catch (e) {
            alert("Erro no servidor");
        }
        setLoad(false);
    }
    return (
        <div id="container_login">
            {load ? <div><img src={"images/loading.gif"} className="imageIconeLoad" /></div> :
                <section id="secao_login">

                    <img src="../images/user.png" id="icone_usuario" alt="icone login" />
                    <h3 className="mt-3">Login</h3>
                    <h6 style={{ color: "orange" }}>{errorForm && messageErrorForm}</h6>
                    <form className="my-1" >
                        <label htmlFor="user">
                            <input type="text" {...register("user")} name="user" id="user" placeholder="Nome do usuário" />
                        </label>
                        <div style={{ color: "orange" }}>{errors.user?.message}</div>
                        <label htmlFor="password">
                            <input type="password" {...register("password")} name="password" id="password" placeholder="Senha" />
                        </label>
                        <div style={{ color: "orange" }}>{errors.password?.message}</div>
                        <label className="my-3" id="enviar_dados_login">
                            <button id="enviar_login" style={{backgroundColor: "#86a782"}} onClick={handleSubmit(onSubmit)}>Enviar</button>
                        </label>
                    </form>
                    <div className="my-3" id="alterar_login">
                        <h5><Link to="/redefinirSenha" className="text-light h5" >Redefinir senha</Link></h5>
                        <h5><Link to="/CadastrarUsuario" className="text-light h5">Cadastrar</Link> </h5>
                    </div>
                </section>}
        </div>

    )
}
export default Login;