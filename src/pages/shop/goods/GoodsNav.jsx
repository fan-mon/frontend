import React, { useEffect, useState } from 'react';
import "../css/goodsnav.css";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';


function GoodsNav(){

    let [gcategory, setGCategory] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8080/shop/goods/category')
            .then(response => {
                console.log(response.data);
                setGCategory(response.data);
            })
            .catch(error => {
                console.error('Error fetching goods:', error);
            });
    }, []);

    return (
        <>
            <Navbar bg="#000000" data-bs-theme="dark">
                <Nav className="me-auto">
                    {gcategory.map((gprod)=>(
                        <Nav.Link href="/shop/goods/list" className="hover-color">{gprod}</Nav.Link>
                    ))}
                </Nav>
                <Nav>
                    <Nav.Link href="/shop/cart"><Icon.Cart2 className="hover-color icon-cart" /></Nav.Link>
                </Nav>
            </Navbar>
        </>
    )
}

export default GoodsNav;