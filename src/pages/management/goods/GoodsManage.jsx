import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import "./css/goodsmanage.css";
import axios from "axios";

const GoodsManage = () => {
    const [goods, setGoods] = useState([]); //상품 리스트를 저장할 상태값
    const [loading, setLoading] = useState(true);// 로딩 상태
    const [error, setError] = useState(null);// 에러 상태

    //api 호출 함수
    const fetchGoods = async () => {
      try{
        const response = await axios.get("http://localhost:8080/management/goods"); //api호출
        setGoods(response.data); //상품리스트를 상태에 저장
        console.log(goods);
        setLoading(false); //로딩 종료
      }catch(err){
        setError(err.message);
        setLoading(false);
      }

    };

  const navigate = useNavigate();

    // 아티스트를 클릭하면 해당 아티스트의 ID에 따라 굿즈 등록 페이지로 이동
  const handleArtistClick = (artistuuid) => {
    navigate(`/management/goodsform/${artistuuid}`);
  };

    //컴포넌트가 마운트되면 fetchGoods 실행
    useEffect(()=>{
      fetchGoods();
    },[]);

    if(loading){
      return <div>로딩 중...</div>
    }
    if(error){
      return <div>에러 발생..!</div>
    }



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
          {/* goods배열을 map으로 돌려서 상품을 표시 */}
          {goods.map(
            (item)=>(
              <div className="product-item" key={item.goodsuuid}>
                <img src={item.fname} alt={item.name} className="product-image"/>
                <p>{item.name}</p>
              </div>
            )
          )}
        </div>

        <div className="view-more">
          <a href="#">더보기</a>
        </div>
      </div>
    </div>
  );

};

export default GoodsManage;