const Background_Style = {
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    backgroundColor: "rgb(0,0,0,0.8)",
    zIndex: "1000"
}
const Modal_Style = {
    position: "fixed",
    width: "440px",
    height: "440px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    border: "5px solid black",
    fontSize: "13px",
    color: "black",
    fontWeight: "bold",
    textAlign: "justify"

}
const Modal = (prop) => {
    if (prop.isopen) {
        return (
            <div style={Background_Style}>

                <div style={Modal_Style}>
                    <h4 className="text-success" style={{ textAlign: "center", fontWeight: "bold" }}>Web Scraping</h4>
                    <p>Este trabalho foi desenvolvido pelos alunos  Allan, Lucas e Rodrigo que estudam na CEFET-RJ e
                        fazem ciência da computação. Esse site tem como objetivo calcular os preço médios dos produtos através da utilização
                        de web scraping. O Web Scraping permite a coleta de dados em sites específicos e pode gerar insights valiosos
                        para o seu negócio. Essa espécie de “garimpo” da internet envolve extrair informações relevantes
                        de determinado site para depois serem analisadas. Esses dados serão usados para aprimorar a tomada de decisões
                        com maior chance de acerto e sucesso. É possível fazer o mesmo processo manualmente, mas quando se fala de Web
                        Scraping a ideia é automatizar o trabalho. Assim, é possível coletar um número muito maior de dados
                        em uma curta fração do tempo.
                    </p>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger btn-sm" onClick={prop.setClose}>Fechar</button>
                    </div>
                </div>
            </div>

        )
    }
    else {
        return null;
    }
}
export default Modal;