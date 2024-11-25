import './Coupons.scss';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ErrorResponse {
  message: string;
}

function Coupons() {
  const [state, setState] = useState({
    value: '',
    copied: false,
  });

  const [formDataCoupons, setFormDataCoupons] = useState({
    brand: '',
    country: '',
    amount: '',
    wetsuit: '',
    nbcoupons: '',
    facturationCode: '',
  });

  const [coupons] = useState({
    brand_name: '',
    country_name: '',
    coupon_amount: '',
    coupon_code: '',
    country_currency: '',
  });

  const facturationCodeList = localStorage.getItem('factuCode')?.split(',');

  const [couponList, setCouponList] = useState([coupons]);
  const [couponCopyToClipboard] = useState([coupons.coupon_code]);

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

    setState({ value: '', copied: false });

    const { brand, country, amount, facturationCode } = formDataCoupons;
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
        `http://localhost:3000/api/coupon/${brand}/${country}/${amountToUse}/${nbcoupons}/${wetsuit}/${facturationCode}`,
        {
          withCredentials: true,
        }
      );

      setCouponList(response.data);

      response.data.map((coupon: { coupon_code: string }) =>
        couponCopyToClipboard.push(coupon.coupon_code)
      );

      setState({
        value: couponCopyToClipboard.toString().replace(/,/g, '\n'),
        copied: false,
      });

      setFormDataCoupons({
        brand: '',
        country: '',
        amount: '',
        wetsuit: '',
        nbcoupons: '',
        facturationCode: '',
      });

      document.getElementById('coupons')?.classList.remove('inactive');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;
      alert(`${errorMessage} please contact the administrator`);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="coupons-container">
      <h2>Get your FOC coupons</h2>
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
          id="facturationCode"
          name="facturationCode"
          required
          value={formDataCoupons.facturationCode}
          onChange={handleChangeGetCoupons}
        >
          <option default-value="">Seelct a facturation code</option>
          {facturationCodeList?.map((facturation, index) => (
            <option key={index} value={facturation}>
              {facturation}
            </option>
          ))}
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
        <CopyToClipboard
          text={state.value}
          onCopy={() => {
            setState({
              value: state.value,
              copied: true,
            });
          }}
        >
          <button>Copy coupons to clipboard</button>
        </CopyToClipboard>
      </div>
      <span>{state.copied ? 'Copied!' : ''}</span>
    </div>
  );
}

export default Coupons;
