import * as Yup from "yup";

const SchemaHome = Yup.object().shape({
    search_product_home:Yup.string().required("campo obrigatório").matches(/^(\s){0,5}(iphone)(\d)+(\s){1,1}(\d)+(GB)(\s){0,5}$/gmi,"Não está no formato correto. Formatos válidos: iphone12 256gb, Iphone12 256Gb, IPHONE15 128GB, etc..."),
})  
export default SchemaHome;