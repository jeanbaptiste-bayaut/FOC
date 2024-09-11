import React, { useState } from 'react';
import axios from 'axios';

function Coupons() {
  const [formDataCoupons, setFormDataCoupons] = useState({
    brand: '',
    country: '',
    amount: '',
    nbcoupons: '',
  });

  const [coupons, _] = useState({
    brand_name: '',
    country_name: '',
    coupon_amount: '',
    coupon_code: '',
    country_currency: '',
  });
  const [couponList, setCouponList] = useState([coupons]);

  const handleChangeGetCoupons = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormDataCoupons({
      ...formDataCoupons,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitGetCoupons = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const { brand, country, amount } = formDataCoupons;

    const nbcoupons = parseInt(formDataCoupons.nbcoupons);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/coupon/${brand}/${country}/${amount}/${nbcoupons}`,
        {
          withCredentials: true,
        }
      );

      setCouponList(response.data);
      console.log(couponList);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitGetCoupons}>
        <select
          id="coupon-brand"
          name="brand"
          required
          value={formDataCoupons.brand}
          onChange={handleChangeGetCoupons}
        >
          <option default-value="">Choose a brand</option>
          <option value="quiksilver">Quiksilver</option>
          <option value="roxy">Roxy</option>
          <option value="dc">DC</option>
          <option value="billabong">Billabong</option>
          <option value="element">Element</option>
          <option value="rvca">Rvca</option>
        </select>
        <select
          id="coupon-country"
          name="country"
          required
          value={formDataCoupons.country}
          onChange={handleChangeGetCoupons}
        >
          <option default-value="">Select country</option>
          <option value="france">France</option>
          <option value="spain">Spain</option>
          <option value="germany">Germany</option>
        </select>
        <select
          id="coupon-amount"
          name="amount"
          required
          value={formDataCoupons.amount}
          onChange={handleChangeGetCoupons}
        >
          <option default-value="">Select amount</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="1000">1000</option>
        </select>
        <select
          id="coupon-nbcoupons"
          name="nbcoupons"
          required
          value={formDataCoupons.nbcoupons}
          onChange={handleChangeGetCoupons}
        >
          <option default-value="">Select number of coupons</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button type="submit">Get coupons</button>
      </form>
      <div id="coupons">
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Country</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Coupon</th>
            </tr>
          </thead>
          <tbody>
            {couponList.map((coupon, index) => (
              <tr key={index}>
                <td>{coupon.brand_name}</td>
                <td>{coupon.country_name}</td>
                <td>{coupon.coupon_amount}</td>
                <td>{coupon.country_currency}</td>
                <td>{coupon.coupon_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Coupons;
