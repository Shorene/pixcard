import React, {Component} from "react";
import "../styles/Header.css";
import image1 from "../images/pantano.jpeg";
import image2 from "../images/mina.jpeg";
import image3 from "../images/Maldicion_sombria.jpeg";
import image4 from "../images/tundras.jpeg";
import image5 from "../images/terreno_ciudadela.jpeg";
const images=[image1, image2, image3, image4, image5];



 class Header extends Component{

    constructor(props){
        super(props);
        this.state={
            rotacion:null,
            c:0
        }
    }

    componentDidMount(){
        this.setState({rotacion:setInterval(this.carrusel,5000)});
    }

    carrusel=()=> {
        let i=this.state.c;
        i++;
        if(i>=images.length) i=0;
        this.setState({
            c: i
        })
    }

    Numeral = (e,event) => {
        clearInterval(this.state.rotacion);
        this.setState({
            c: e.target.dataset.id
        })
        this.setState({rotacion:setInterval(this.carrusel,5000)});
    }

    render(){
        let items=images.map((x, index) =>
            <a href="#" style={{ color: 'yellow' }} className="item" data-id={index} onClick={this.Numeral}>{index+1}</a>)
        
        return(
            <div className="divheader">
                <h1 className="h1cab">Libreria "Lo Nuestro"</h1>
                <img className="imagecab" src={images[this.state.c]} />
                <div  className="divitem">
                    {items}
                </div>
            </div>
        )};

 };

    

 export default Header;