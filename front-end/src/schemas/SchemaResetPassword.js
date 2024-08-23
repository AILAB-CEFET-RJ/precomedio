import * as Yup from "yup";

const SchemaResetPassword = Yup.object().shape({
    email:Yup.string().email("email inválido").required("campo obrigatório"),
    password:Yup.string().min(4,"minimo 4 caracteres").required("campo obrigatório"),
    password_confirm:Yup.string().required("campo obrigatório").oneOf([Yup.ref("senha"),null],"Senhas diferentes")
})
export default SchemaResetPassword;