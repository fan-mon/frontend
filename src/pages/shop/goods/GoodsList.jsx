import React, { useEffect, useState } from 'react';
import "../css/goodslist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoodsNav from "./GoodsNav";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GoodsList() {
  // goods 테이블에서 데이터 가져오기
  const [glist, setGList] = useState([]);
  const { teamuuid } = useParams();
  const { category } = useParams();

  useEffect(() => {
    const uuid = teamuuid || sessionStorage.getItem('teamuuid');
    const categoryValue = category || sessionStorage.getItem('category'); 

    console.log('UUID:', uuid);
    console.log('Category Value before check:', categoryValue);

    sessionStorage.removeItem('category');
    console.log('Category after removal:', sessionStorage.getItem('category'));

    if (!categoryValue) {
      axios.get(`http://localhost:8080/shop/goods/list/${uuid}/all`)
        .then(response => {
          console.log(response.data);
          setGList(response.data);
          sessionStorage.setItem('teamuuid', uuid);
          
        })
        .catch(error => {
          console.error('Error fetching goods:', error);
        });
    } else {
      axios.get(`http://localhost:8080/shop/goods/list/${uuid}/${categoryValue}`)
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
                      <img src={`${process.env.PUBLIC_URL}/shop/goods/${gprod.fname}`} alt="single-goods images" />
                      <div className="single-goods-bg-overlay"></div>
                    </div>
                    <h4>{gprod.name}</h4>
                    <p className="goods-price">{gprod.price.toLocaleString()}원</p>
                    <button className="add-to-cart">Add to Cart</button>
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
