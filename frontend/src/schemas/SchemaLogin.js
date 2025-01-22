import * as Yup from "yup";

const SchemaLogin = Yup.object().shape({
    user:Yup.string().required("Campo obrigatório"),
    password:Yup.string().required("Campo obrigatório").min(4,"Mínimo 4 caracteres"),  
})
export default SchemaLogin;