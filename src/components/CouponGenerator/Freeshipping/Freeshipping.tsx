import './Freeshipping.scss';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ErrorResponse {
  message: string;
}

function Freeshipping() {
  const [state, setState] = useState({
    value: '',
    copied: false,
  });

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

  const [couponCopyToClipboard] = useState([freeshipping.freeshipping_code]);

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

    setState({ value: '', copied: false });

    const { brand, country } = formDataFreeshipping;

    const nbcoupons = parseInt(formDataFreeshipping.nbcoupons);

    try {
      // Call to the get freeshipping endpoint
      const response = await axios.get(
        `http://localhost:3000/api/freeshipping/${brand}/${country}/${nbcoupons}`,
        {
          withCredentials: true,
        }
      );

      // Set the coupon list with the response data
      setCouponList(response.data);

      // Map the response data to get the coupon code and push it to the couponCopyToClipboard array
      response.data.map((coupon: { freeshipping_code: string }) =>
        couponCopyToClipboard.push(coupon.freeshipping_code)
      );

      // Set the state with the coupon codes and set the copied status to false
      setState({
        value: couponCopyToClipboard.toString().replace(/,/g, '\n'),
        copied: false,
      });

      // Reset the form
      setFormDataCoupons({
        brand: '',
        country: '',
        nbcoupons: '',
      });

      // Show the coupons table
      document
        .getElementById('freeshipping-coupons')
        ?.classList.remove('inactive');
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;
      alert(`${errorMessage} please contact the administrator`);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="freeshipping-container">
      <h2>Get free shipping coupons</h2>
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

export default Freeshipping;
