import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PostUsers } from "../requests/requestsUsers";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SchemaRegisteringUser from "../schemas/SchemaRegisteringUser";

const RegisteringUser = () => {
    const nav = useNavigate();
    const [load, setLoad] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(SchemaRegisteringUser)
    });
    const [errorForm, setErroForm] = useState("");
    const [messageErrorForm] = useState("Usuário já existe");
    const onSubmit = async (data) => {
        setLoad(true);
        try {

            let { token } = await PostUsers(data.user, data.password, data.email);
            if (token !== undefined) {
                alert("Cadastrado com sucesso!!!");
                nav("/");
            } else {
                setErroForm(true);
            }
        } catch (e) {
            alert("Erro no servidor");
            console.log("Erro no servidor");
        }
        setLoad(false);
    }
    return (
        <div id="container_login">
            <section id="secao_login1">
                <img src="../images/iconeUsuario.avif" id="icone_usuario" alt="icone login" />
                <h3 style={{ color: "white" }} className="my-1">Cadastrar Usuário</h3>
                <h6 style={{ color: "orange" }}>{errorForm && messageErrorForm}</h6>
                <form className="my-1" >
                    <label htmlFor="user">
                        <input type="text" {...register("user")} name="user" id="user" placeholder="nome do usuário" />
                    </label>
                    <div style={{ color: "orange" }} >{errors.user?.message}</div>
                    <label htmlFor="passaword">
                        <input type="password" {...register("password")} name="password" id="password" placeholder="senha" />
                    </label>
                    <div style={{ color: "orange" }}>{errors.password?.message}</div>
                    <label htmlFor="email">
                        <input type="text" {...register("email")} name="email" id="email" placeholder="email" />
                    </label>
                    <div style={{ color: "orange" }}>{errors.email?.message}</div>


                    <label className="my-3" id="enviar_dados_login" >
                        {!load &&
                            <button className="text-light" id="enviar_login2" onClick={handleSubmit(onSubmit)} >Enviar</button>}
                        {!load &&
                            <Link to="/" id="voltar_login">Voltar</Link>}
                    </label>

                </form>
            </section>
        </div>
    )
}
export default RegisteringUser;