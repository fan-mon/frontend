import "../css/cartlist.css";
import "bootstrap/dist/css/bootstrap.min.css";


function CartList(){
    return(
        <>
            <div class="container cart-content">
                <div class="row">
                    <h2>장바구니</h2>
                    <table class="cart-content-list">
                        <tr>
                            <th>번호</th>
                            <th></th>
                            <th>상품명</th>
                            <th>가격</th>
                            <th>수량</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>img</td>
                            <td>귀여운 요술봉</td>
                            <th>59,000원</th>
                            <th>5</th>
                            <td>x</td>
                        </tr>
                    </table>
                    <div>
                        <span>총액</span>
                        <span>59,000원</span>
                    </div>
                    <button class="welcome-add-cart">
                        Buying
                    </button>
                </div>
            </div>
        </>
    )
}

export default CartList;