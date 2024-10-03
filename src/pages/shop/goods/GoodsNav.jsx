import "../css/goodsnav.css";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// icons
import * as Icon from 'react-bootstrap-icons';


function GoodsNav(){
    return (
        <>
        <Navbar bg="#000000" data-bs-theme="dark">
            <Nav className="me-auto">
                <Nav.Link href="/shop/goods" className="hover-color">분류1</Nav.Link>
                <Nav.Link href="/shop/goods" className="hover-color">분류2</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="/shop/cart"><Icon.Cart2 className="hover-color icon-cart" /></Nav.Link>
            </Nav>
        </Navbar>



        </>
    )
}

export default GoodsNav;