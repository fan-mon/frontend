import "../css/goodslist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoodsNav from "./GoodsNav";

function GoodsList(){
    return(
        <>
            <section class="goods-frame">
                <div class="container">
                    <div class="goodslist-content">
                        <GoodsNav/>
                        <div class="row">
                            <div class="col-md-3 col-sm-4">
                                <div class="single-goods">
                                    <div class="single-goods-bg">
                                        <img src={`${process.env.PUBLIC_URL}/shop/goods/logo_white.png`} alt="single-goods images"/>
                                        <div class="single-goods-bg-overlay"></div>
                                    </div>
                                    <h4>귀여운 응원봉</h4>
                                    <p class="goods-price">59,000원</p>
                                    <button class="add-to-cart" onClick="#">Add to Cart</button>
                                    <a href="/shop/goods/detail"><button class="more-info">More Info</button></a>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
};

export default GoodsList;