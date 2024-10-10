import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SchemaResetPassword from "../schemas/SchemaResetPassword";

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(SchemaResetPassword)
    });

    const onSubmit = data => {
        console.log(data);
    }
    return (
        <div id="container_login">
            <section id="secao_login1">
                <img src="../images/iconeUsuario.avif" id="icone_usuario" alt="icone login" />
                <h3 style={{ color: "white" }} className="my-1">Redefinir Senha</h3>
                <form className="my-1" >
                    <label htmlFor="email">
                        <input type="text" {...register("email")} name="email" id="email" placeholder="email" />
                    </label>
                    <div style={{ color: "orange" }}>{errors.email?.message}</div>
                    <label htmlFor="password">
                        <input type="password" {...register("password")} name="password" id="password" placeholder="senha" />
                    </label>
                    <div style={{ color: "orange" }}>{errors.password?.message}</div>
                    <label htmlFor="password_confirm">
                        <input type="password" {...register("password_confirm")} name="password_confirm" id="password_confirm" placeholder="confirmar senha" />
                    </label>
                    <div style={{ color: "orange" }}>{errors.password_confirm?.message}</div>
                    <label className="my-3" id="enviar_dados_login" >
                        <button className="text-light" id="enviar_login2" onClick={handleSubmit(onSubmit)}>Enviar</button>
                        <Link to="/" id="voltar_login">Voltar</Link>
                    </label>

                </form>

            </section>
        </div>


    )
}
export default ResetPassword;