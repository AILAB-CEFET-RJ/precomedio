import * as Yup from "yup";

const SchemaLogin = Yup.object().shape({
    user:Yup.string().required("campo obrigatório"),
    password:Yup.string().required("campo obrigatório").min(4,"minimo 4 caracteres"),  
})
export default SchemaLogin;