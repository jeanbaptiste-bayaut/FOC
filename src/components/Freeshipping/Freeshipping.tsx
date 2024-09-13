import './Freeshipping.css';
import React, { useState } from 'react';
import axios from 'axios';

function Freeshipping() {
  const [formDataFreeshipping, setFormDataCoupons] = useState({
    brand: '',
    country: '',
    nbcoupons: '',
  });

  const [freeshipping] = useState({
    brand_name: '',
    country_name: '',
    freeshipping_code: '',
  });

  const [couponList, setCouponList] = useState([freeshipping]);

  const handleChangeGetFreeshipping = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormDataCoupons({
      ...formDataFreeshipping,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitGetFreeshipping = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const { brand, country } = formDataFreeshipping;

    const nbcoupons = parseInt(formDataFreeshipping.nbcoupons);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/freeshipping/${brand}/${country}/${nbcoupons}`,
        {
          withCredentials: true,
        }
      );

      setCouponList(response.data);
      setFormDataCoupons({
        brand: '',
        country: '',
        nbcoupons: '',
      });
      document
        .getElementById('freeshipping-coupons')
        ?.classList.remove('inactive');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="freeshipping-container">
      <h2>Get free shipping coupons</h2>
      <p>Fill the form to get freeshipping coupons</p>
      <form
        className="form-freeshipping"
        onSubmit={handleSubmitGetFreeshipping}
      >
        <select
          id="coupon-brand"
          name="brand"
          required
          value={formDataFreeshipping.brand}
          onChange={handleChangeGetFreeshipping}
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
          value={formDataFreeshipping.country}
          onChange={handleChangeGetFreeshipping}
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
          id="coupon-nbcoupons"
          name="nbcoupons"
          required
          value={formDataFreeshipping.nbcoupons}
          onChange={handleChangeGetFreeshipping}
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
      <div id="freeshipping-coupons" className="inactive">
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Country</th>
              <th>Coupon</th>
            </tr>
          </thead>
          <tbody>
            {couponList.map((coupon, index) => (
              <tr key={index}>
                <td>{coupon.brand_name}</td>
                <td>{coupon.country_name}</td>
                <td>{coupon.freeshipping_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Freeshipping;
