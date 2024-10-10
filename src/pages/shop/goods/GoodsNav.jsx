import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../css/goodsnav.css";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';



function GoodsNav({ teamuuid, glist  }){

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

    const location = useLocation();
    const currentPath = location.pathname;


    return (
        <>
            <Navbar bg="#000000" data-bs-theme="dark">
                <Nav className="me-auto">
                    <Nav.Link href={`/shop/goods/list/${teamuuid}/all`} className={`hover-color ${currentPath === `/shop/goods/list/${teamuuid}/all` ? 'selected-category' : ''}`}>All</Nav.Link>
                    {gcategory.map((categoriList)=>(
                        <Nav.Link href={`/shop/goods/list/${teamuuid}/${categoriList}`} className={`hover-color ${currentPath === `/shop/goods/list/${teamuuid}/${categoriList}` ? 'selected-category' : ''}`}>{categoriList}</Nav.Link>
                    ))}
                </Nav>
                <Nav>
                    <Nav.Link href={`/shop/cart/list`}><Icon.Cart2 className="hover-color icon-cart" /></Nav.Link>
                </Nav>
            </Navbar>
        </>
    )
}

export default GoodsNav;