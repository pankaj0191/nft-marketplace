import React, { Component,useEffect } from "react";


class BodyClass extends Component {

    pages = ["/", "/nft/create" , "/collections/create"];

    className = "dv-sticky";

    componentDidMount() {
        document.body.classList.remove(this.className);
        if(this.pages.includes(window.location.pathname)){
            document.body.classList.add(this.className);
        }
    }

    render() { 
        return null;
    }

}
 
export default BodyClass;