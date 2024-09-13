import './Coupons.css';
import React, { useState } from 'react';
import axios from 'axios';

function Coupons() {
  const [formDataCoupons, setFormDataCoupons] = useState({
    brand: '',
    country: '',
    amount: '',
    wetsuit: '',
    nbcoupons: '',
  });

  const [coupons] = useState({
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
    let wetsuit = false;
    let amountToUse = formDataCoupons.amount;

    if (amount.includes('wetsuit')) {
      const amountWetsuit = amount.split('-')[0];
      wetsuit = true;
      amountToUse = amountWetsuit;
    }

    const nbcoupons = parseInt(formDataCoupons.nbcoupons);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/coupon/${brand}/${country}/${amountToUse}/${nbcoupons}/${wetsuit}`,
        {
          withCredentials: true,
        }
      );

      setCouponList(response.data);
      setFormDataCoupons({
        brand: '',
        country: '',
        amount: '',
        wetsuit: '',
        nbcoupons: '',
      });

      document.getElementById('coupons')?.classList.remove('inactive');
      console.log(document.getElementById('coupons'));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="coupons-container">
      <h2>Get your coupons</h2>
      <p>Fill the form to get your coupons</p>
      <form className="form-coupons" onSubmit={handleSubmitGetCoupons}>
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
          <option value="england">England</option>
          <option value="italy">Italy</option>
          <option value="austria">Austria</option>
          <option value="switzerland">Switzerland</option>
          <option value="ireland">Ireland</option>
          <option value="netherlands">Netherlands</option>
          <option value="belgium">Belgium</option>
          <option value="portugal">Portugal</option>
          <option value="finland">Finland</option>
          <option value="sweden">Sweden</option>
          <option value="danemark">Danemark</option>
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
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="800">800</option>
          <option value="1000">1000</option>
          <option value="1500">1500</option>
          <option value="2000">2000</option>
          <option value="300-wetsuit">WETSUITS 300</option>
          <option value="500-wetsuit">WETSUITS 500</option>
          <option value="800-wetsuit">WETSUITS 800</option>
          <option value="1000-wetsuit">WETSUITS 1000</option>
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
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <button type="submit">Get coupons</button>
      </form>
      <div id="coupons" className="inactive">
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
    </div>
  );
}

export default Coupons;
