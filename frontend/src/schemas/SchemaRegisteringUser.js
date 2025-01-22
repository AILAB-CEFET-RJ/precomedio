import * as Yup from "yup";

const SchemaRegisteringUser = Yup.object().shape({
    user:Yup.string().required("Campo obrigatório"),
    password:Yup.string().required("Campo obrigatório").min(4,"Mínimo 4 caracteres"),
    email:Yup.string().email("email inválido").required("Campo obrigatório")
   
})
export default SchemaRegisteringUser;