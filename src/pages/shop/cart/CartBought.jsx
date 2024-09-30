import "../css/cartbought.css";

function CartBought(){
    return(
        <>
            <div class="container bought-content">
                <h3>결제 되었습니다</h3>
                <div>
                    <a href="/shop/goods"><button>굿즈샵</button></a>
                    <a href="/shop/cart"><button>장바구니</button></a>
                </div>
            </div>
        </>
    )
}

export default CartBought;