import "../css/cartlist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from 'react-bootstrap-icons';


function CartList(){
    return(
        <>
            <div class="container cart-content">
                <div class="row">
                    <h2>장바구니</h2>
                    <table class="cart-content-list">
                        <tr>
                            <td class="cart-list-no cart-list-center">1</td>
                            <td class="cart-list-file cart-list-center"><a href="/shop/goods/detail"><img src={`${process.env.PUBLIC_URL}/shop/common/monster1.png`} alt="cart list image"/></a></td>
                            <td class="cart-list-name"><a href="/shop/goods/detail">귀여운 요술봉</a></td>
                            <th class="cart-list-qty cart-list-center">2</th>
                            <th class="cart-list-price">59,000원</th>
                            <td class="cart-list-delete cart-list-center"><div onClick="#"><Icon.XLg/></div></td>
                        </tr>
                        <tr>
                            <td class="cart-list-no cart-list-center">2</td>
                            <td class="cart-list-file cart-list-center"><a href="/shop/goods/detail"><img src={`${process.env.PUBLIC_URL}/shop/common/monster1.png`} alt="cart list image"/></a></td>
                            <td class="cart-list-name"><a href="/shop/goods/detail">안귀여운 요술봉</a></td>
                            <th class="cart-list-qty cart-list-center">1</th>
                            <th class="cart-list-price">39,000원</th>
                            <td class="cart-list-delete cart-list-center"><div onClick="#"><Icon.XLg/></div></td>
                        </tr>
                        <tr>
                            <td class="cart-list-center">총</td>
                            <td></td>
                            <td></td>
                            <th class="cart-list-center">3</th>
                            <th>157,000원</th>
                            <td></td>
                        </tr>
                    </table>
                    <div class="total-result">
                        <div>
                            <span>배송비&nbsp;&nbsp;&nbsp;</span><span>2,500</span><span>원</span>
                        </div>
                        <div>
                            <span>결제예정금액&nbsp;&nbsp;&nbsp;</span><span>159,500</span><span>원</span>
                        </div>
                    </div>
                    <a href="/shop/cart/buying">
                        <button class="buying-button">
                            Buying
                        </button>
                    </a>
                </div>
            </div>
        </>
    )
}

export default CartList;