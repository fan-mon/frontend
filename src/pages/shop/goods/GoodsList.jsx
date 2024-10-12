import React, { useEffect, useState } from 'react';
import "../css/goodslist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoodsNav from "./GoodsNav";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../../../apiClient';

function GoodsList() {
    
  // goods 테이블에서 데이터 가져오기
  const [glist, setGList] = useState([]);
  const { teamuuid } = useParams();
  const { category } = useParams();

  // user 데이터 불러오기
  let [useruuid, setUseruuid] = useState(null);
  useEffect(() => {
      const fetchUserInfo = async () => {
          try {
              const response = await api.get('/users/myprofile');
              setUseruuid(response.data.useruuid);
              console.log("Fetched useruuid: " + response.data.useruuid);
  
          } catch (error) {
              console.error('Error fetching user profile:', error);
          }
      };
      fetchUserInfo();
  }, []);

  //상품 목록 불러오기 위한 axios 처리
  useEffect(() => {
    const uuid = teamuuid || sessionStorage.getItem('teamuuid');
    const categoryValue = category || sessionStorage.getItem('category'); 

    console.log('UUID:', uuid);
    console.log('Category Value before check:', categoryValue);

    sessionStorage.removeItem('category');
    console.log('Category after removal:', sessionStorage.getItem('category'));

    if (!categoryValue) {
      axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/shop/goods/list/${uuid}/all`)
        .then(response => {
          console.log(response.data);
          setGList(response.data);
          sessionStorage.setItem('teamuuid', uuid);
          
        })
        .catch(error => {
          console.error('Error fetching goods:', error);
        });
    } else {
      axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/shop/goods/list/${uuid}/${categoryValue}`)
        .then(response => {
          console.log(response.data);
          setGList(response.data);
          sessionStorage.setItem('teamuuid', uuid);
          sessionStorage.setItem('category', categoryValue);
        })
        .catch(error => {
          console.error('Error fetching goods:', error);
        });
    }
  }, [teamuuid, category]);

  
  //장바구니 담기
  const handleAddToCart = async (gprod) => {
    try {
      console.log(`User UUID: ${useruuid}, Goods UUID: ${gprod.goodsuuid}`);
      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/shop/cart/add/${useruuid}/${gprod.goodsuuid}/1`);
      alert('상품이 장바구니에 추가되었습니다.');

    } catch (error) {
      console.error('장바구니 처리 중 오류 발생:', error);
      alert('장바구니에 상품을 추가할 수 없습니다.');
      
    }
  };

  
  return (
    <>
      <section className="goods-frame">
          <div className="goodslist-container">
              <div className="goodslist-content">
              <GoodsNav teamuuid={teamuuid} />
              <div className="row">
                  {glist.map((gprod) => (
                    <div className="col-md-3 col-sm-4" key={gprod.goodsuuid}>
                        <div className="single-goods">
                        <div className="single-goods-bg">
                            <img src={`${process.env.PUBLIC_URL}/shop/goods/${gprod.fname}`} alt={gprod.fname} />
                            <div className="single-goods-bg-overlay"></div>
                        </div>
                        <h4>{gprod.name}</h4>
                        <p className="goods-price">{gprod.price.toLocaleString()}원</p>
                        <button className="add-to-cart" onClick={() => handleAddToCart(gprod)}>Add to Cart</button>
                        <a href={`/shop/goods/detail/${gprod.goodsuuid}`}>
                            <button className="more-info">More Info</button>
                        </a>
                        </div>
                    </div>
                  ))}
              </div>
              </div>
          </div>
      </section>
    </>
  );
}

export default GoodsList;
