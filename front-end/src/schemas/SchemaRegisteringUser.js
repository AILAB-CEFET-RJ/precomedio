import * as Yup from "yup";

const SchemaRegisteringUser = Yup.object().shape({
    user:Yup.string().required("campo obrigatório"),
    password:Yup.string().required("campo obrigatório").min(4,"minimo 4 caracteres"),
    email:Yup.string().email("email inválido").required("campo obrigatório")
   
})
export default SchemaRegisteringUser;