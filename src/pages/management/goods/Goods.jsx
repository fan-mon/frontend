import React from "react";
import {useNavigate} from "react-router-dom";

const Goods = () => {
    const navigate = useNavigate();

    // 아티스트를 클릭하면 해당 아티스트의 ID에 따라 굿즈 등록 페이지로 이동
  const handleArtistClick = (artistuuid) => {
    navigate(`/management/goodsform/${artistuuid}`);
  };
  return (
    <div className="goods-management-container">
      <h1>굿즈 관리 페이지</h1>

      {/* 아티스트 목록 */}
      <div className="artist-section">
        <h2>상품 등록</h2>
        <div className="artist-list">
          <div className="artist-item" onClick={() => handleArtistClick("2pm")}>
            <img src="/images/2pm.png" alt="2PM" className="artist-image" />
            <p>2PM</p>
          </div>
          <div className="artist-item" onClick={() => handleArtistClick("day6")}>
            <img src="/images/day6.png" alt="DAY6" className="artist-image" />
            <p>DAY6</p>
          </div>
        </div>
      </div>

      {/* 등록한 상품 목록 */}
      <div className="registered-products-section">
        <h2>등록한 상품</h2>
        <div className="product-list">
          <div className="product-item">
            <img src="/images/photocard.png" alt="포토카드" className="product-image" />
            <p>포토카드</p>
          </div>
          <div className="product-item">
            <img src="/images/hoodie.png" alt="후드티" className="product-image" />
            <p>후드티</p>
          </div>
          <div className="product-item">
            <img src="/images/lightstick.png" alt="응원봉" className="product-image" />
            <p>응원봉</p>
          </div>
          <div className="product-item">
            <img src="/images/album.png" alt="앨범" className="product-image" />
            <p>앨범</p>
          </div>
        </div>
        <div className="view-more">
          <a href="#">더보기</a>
        </div>
      </div>
    </div>
  );

};

export default Goods;