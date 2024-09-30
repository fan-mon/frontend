import React, { useState } from 'react';
import "../css/goodsdetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoodsNav from "./GoodsNav";

function GoodsDetail(){

    // 상태 변수 초기화
    const [quantity, setQuantity] = useState(1);
    const pricePerItem = 59000; // 개당 가격

    // 입력 값이 변경될 때 호출되는 함수
    const handleChange = (event) => {
        setQuantity(event.target.value); // 입력된 값을 상태에 저장
    };

    // 총 가격 계산
    const totalPrice = (pricePerItem * quantity).toLocaleString();

    return (
        <>
            <div class="container detail-content">
            <GoodsNav/>
                <div class="row">
                    <div class="col-sm-7">
                        <div class="single-detail">
                        <div class="welcome-detail-txt">
                                <h2>귀여운 응원봉</h2>
                                <p>
                                    엔하이픈의 응원봉은 로그의 심볼인 하이픈 기호의 비율을 모티브로 디자인 되었습니다.<br/><br/>

                                    버튼을 1.5초간 눌러 전원을 켜고 끌 수 있습니다.<br/>
                                    전원이 켜진 상태에서 짧게 누르면 새이 변환됩니다.<br/><br/>

                                    전원이 켜진 상태에서 짧게 누르면 점멸 효과가 변경됩니다.<br/>
                                    Slow → Quik → Flash<br/>
                                    전원을 켜고 버튼을 1.5초간 누르면 오로라 모드로 변환합니다.<br/><br/>

                                    버튼을 1.5초간 동시에 누르면 블루투스 모드가 켜집니다.
                                </p>
                                <div class="detail-item">
                                    <span>
                                        {totalPrice}원
                                    </span>
                                    <span>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <input type="number" name="goods-qty" min="1" max="10" value={quantity} onChange={handleChange}/>
                                        개
                                    </span>
                                </div>
                                <button class="welcome-add-cart"  onClick="#">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="single-welcome-hero">
                            <div class="welcome-hero-img">
                                <img class="sliderimage" src={`${process.env.PUBLIC_URL}/shop/common/monster1.png`} alt="slider image"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GoodsDetail;