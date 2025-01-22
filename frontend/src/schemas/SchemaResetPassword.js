import * as Yup from "yup";

const SchemaResetPassword = Yup.object().shape({
    email:Yup.string().email("email inválido").required("Campo obrigatório"),
    password:Yup.string().min(4,"Mínimo 4 caracteres").required("Campo obrigatório"),
    password_confirm:Yup.string().required("Campo obrigatório").oneOf([Yup.ref("senha"),null],"Senhas diferentes")
})
export default SchemaResetPassword;