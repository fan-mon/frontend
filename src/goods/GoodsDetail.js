import "./detail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo_white.png";

function GoodsDetail(){
    return (
        <>
            <div class="container">
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
                                <div class="detail-price">
                                    <p>
                                        59,000원
                                    </p>
                                </div>
                                <button class="welcome-add-cart">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="single-welcome-hero">
                            <div class="welcome-hero-img">
                                <img class="sliderimage" src={logo} alt="slider image"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GoodsDetail;