import React, { useContext } from 'react';
import "../css/bought.css";

function Bought(){

    return(
        <>
            <div className="container bought-content">
                <h3>결제가 성공적으로 완료되었습니다.</h3>
                <div>
                    <a href="/shop/goods/main"><button>굿즈샵</button></a>
                    <a href="/shop/cart/list/0cf55a0d-a2a5-443b-af46-835d70874c40"><button>장바구니</button></a>
                </div>
            </div>
        </>
    )
}

export default Bought;