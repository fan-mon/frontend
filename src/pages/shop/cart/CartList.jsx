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
                            <td id="cart-list-no" class="cart-list-center">1</td>
                            <td id="cart-list-file" class="cart-list-center"><a href="#"><img src={`${process.env.PUBLIC_URL}/shop/common/monster1.png`} alt="cart list image"/></a></td>
                            <td id="cart-list-name"><a href="#">귀여운 요술봉</a></td>
                            <th id="cart-list-price">59,000원</th>
                            <th id="cart-list-qty" class="cart-list-center">5</th>
                            <td id="cart-list-delete" class="cart-list-center"><a href="#"><Icon.XLg/></a></td>
                        </tr>
                        <tr>
                            <td id="cart-list-no" class="cart-list-center">2</td>
                            <td id="cart-list-file" class="cart-list-center"><a href="#"><img src={`${process.env.PUBLIC_URL}/shop/common/monster1.png`} alt="cart list image"/></a></td>
                            <td id="cart-list-name"><a href="#">안귀여운 요술봉</a></td>
                            <th id="cart-list-price">39,000원</th>
                            <th id="cart-list-qty" class="cart-list-center">5</th>
                            <td id="cart-list-delete" class="cart-list-center"><a href="#"><Icon.XLg/></a></td>
                        </tr>
                        
                    </table>
                    <div class="total-price">
                        <span>총액</span>
                        <span>59,000원</span>
                    </div>
                    <button class="buying-button">
                        Buying
                    </button>
                </div>
            </div>
        </>
    )
}

export default CartList;