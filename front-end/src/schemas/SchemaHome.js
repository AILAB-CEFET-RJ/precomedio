import * as Yup from "yup";

const SchemaHome = Yup.object().shape({
    search_product_home:Yup.string().required("campo obrigatório"),  
})
export default SchemaHome;