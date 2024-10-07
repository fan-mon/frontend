import React, { useContext } from 'react';
import "../css/bought.css";

function Bought(){

    return(
        <>
            <div className="container bought-content">
                <h3>결제가 성공적으로 완료되었습니다.</h3>
                <div>
                    <a href="/shop/goods"><button>굿즈샵</button></a>
                    <a href="/shop/cart"><button>장바구니</button></a>
                </div>
            </div>
        </>
    )
}

export default Bought;