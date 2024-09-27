import "./communal.css";
import "./list.css";
import "bootstrap/dist/css/bootstrap.min.css";


function GoodsList(){
    return(
        <>
            <section class="goods-frame">
                <div class="container">
                    <div class="section-header">
                        <h2>전체보기</h2>
                    </div>
                    <div class="goodslist-content">
                        <div class="row">
                            <div class="col-md-3 col-sm-4">
                                <div class="single-goods">
                                    <div class="single-goods-bg">
                                        <img src="#" alt="single-goods images"/>
                                        <div class="single-goods-bg-overlay"></div>
                                    </div>
                                    <h4>귀여운 응원봉</h4>
                                    <p class="goods-price">59,000원</p>
                                    <button class="add-to-cart">Add to Cart</button>
                                    <a href="/goods/detail"><button class="more-info">More Info</button></a>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-4">
                                <div class="single-goods">
                                    <div class="single-goods-bg">
                                        <img src="#" alt="single-goods images"/>
                                        <div class="single-goods-bg-overlay"></div>
                                    </div>
                                    <h4>귀여운 응원봉</h4>
                                    <p class="goods-price">59,000원</p>
                                    <button class="add-to-cart">Add to Cart</button>
                                    <a href="/goods/detail"><button class="more-info">More Info</button></a>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-4">
                                <div class="single-goods">
                                    <div class="single-goods-bg">
                                        <img src="#" alt="single-goods images"/>
                                        <div class="single-goods-bg-overlay"></div>
                                    </div>
                                    <h4>귀여운 응원봉</h4>
                                    <p class="goods-price">59,000원</p>
                                    <button class="add-to-cart">Add to Cart</button>
                                    <a href="/goods/detail"><button class="more-info">More Info</button></a>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-4">
                                <div class="single-goods">
                                    <div class="single-goods-bg">
                                        <img src="#" alt="single-goods images"/>
                                        <div class="single-goods-bg-overlay"></div>
                                    </div>
                                    <h4>귀여운 응원봉</h4>
                                    <p class="goods-price">59,000원</p>
                                    <button class="add-to-cart">Add to Cart</button>
                                    <a href="/goods/detail"><button class="more-info">More Info</button></a>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-4">
                                <div class="single-goods">
                                    <div class="single-goods-bg">
                                        <img src="#" alt="single-goods images"/>
                                        <div class="single-goods-bg-overlay"></div>
                                    </div>
                                    <h4>귀여운 응원봉</h4>
                                    <p class="goods-price">59,000원</p>
                                    <button class="add-to-cart">Add to Cart</button>
                                    <a href="/goods/detail"><button class="more-info">More Info</button></a>
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