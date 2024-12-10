import './Coupons.scss';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ErrorResponse {
  message: string;
}

type ListCoupon = {
  country_name: string;
  brand_name: string;
  coupon_amount: string;
  coupon_status: number;
  coupon_wetsuit: string;
  country_currency: string;
  nb_coupon: string;
};

type Coupon = {
  amount: number;
  wetsuit: string;
  nb_coupons: number;
};

type Country = {
  name: string;
  coupons: Coupon[];
};

type Brand = {
  name: string;
  countries: Country[];
};

type TransformedData = {
  brand: Brand;
}[];

function Coupons() {
  const [state, setState] = useState({
    value: '',
    copied: false,
  });

  const [listCoupons, setListCoupons] = useState<TransformedData>([]);

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

  // Get the facturation code from the local storage
  const facturationCodeList = localStorage.getItem('factuCode')?.split(',');

  const [couponList, setCouponList] = useState([coupons]);
  const [couponCopyToClipboard, setCouponCopyToClipboard] = useState([
    coupons.coupon_code,
  ]);

  // Function to provide the values of the form
  const getCouponsInformation = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/coupon`,
        { withCredentials: true }
      );

      setListCoupons(result.data);
      const data: ListCoupon[] = result.data;

      const list = (input: ListCoupon[]): TransformedData => {
        return input.reduce<TransformedData>((acc, item) => {
          // Recherche de la marque dans le tableau transformé
          let brandEntry = acc.find((b) => b.brand.name === item.brand_name);

          // Si la marque n'existe pas, on l'ajoute
          if (!brandEntry) {
            brandEntry = {
              brand: {
                name: item.brand_name,
                countries: [],
              },
            };
            acc.push(brandEntry);
          }

          // Recherche du pays dans les pays de cette marque
          let countryEntry = brandEntry.brand.countries.find(
            (c) => c.name === item.country_name
          );

          if (!countryEntry) {
            // Si le pays n'existe pas encore, on l'ajoute avec un tableau de coupons vide
            countryEntry = {
              name: item.country_name,
              coupons: [],
            };
            brandEntry.brand.countries.push(countryEntry);
          }

          // Ajout d'un nouveau coupon pour ce pays
          countryEntry.coupons.push({
            amount: parseFloat(item.coupon_amount),
            wetsuit: item.coupon_wetsuit,
            nb_coupons: parseInt(item.nb_coupon, 10),
          });

          return acc;
        }, []);
      };

      const transformedData = list(data);

      console.log(transformedData);

      setListCoupons(transformedData);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle the changes in the form
  const handleChangeGetCoupons = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (e.target.name === 'amount' && e.target.value.includes('wetsuit')) {
      setFormDataCoupons({
        ...formDataCoupons,
        [e.target.name]: e.target.value,
        wetsuit: 'true',
      });
    } else {
      setFormDataCoupons({
        ...formDataCoupons,
        [e.target.name]: e.target.value,
        wetsuit: 'false',
      });
    }
  };

  // Function to handle the submit of the form
  const handleSubmitGetCoupons = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // initialize the copy to clipboard
    setState({ value: '', copied: false });
    setCouponCopyToClipboard([]);

    const { brand, country, amount, facturationCode } = formDataCoupons;

    // Initialize the wetsuit status of the coupon to false
    let wetsuit = false;

    let amountToUse = formDataCoupons.amount;

    // Check if the amount contains the word wetsuit
    // If it does, split the amount and set the wetsuit status to true
    if (amount.includes('wetsuit')) {
      const amountWetsuit = amount.split('-')[0];
      wetsuit = true;
      amountToUse = amountWetsuit;
    }

    const nbcoupons = parseInt(formDataCoupons.nbcoupons);

    try {
      // Call to the get coupons endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coupon`,
        {
          brand,
          country,
          amount: amountToUse,
          wetsuit,
          nbcoupons,
          facturationCode,
        },
        {
          withCredentials: true,
        }
      );

      // Set the coupon list with the response data
      setCouponList(response.data);

      // Map the response data to get the coupon code and push it to the couponCopyToClipboard array
      response.data.map((coupon: { coupon_code: string }) => {
        couponCopyToClipboard.push(coupon.coupon_code);
      });

      // Remove the first empty element of the couponCopyToClipboard array
      if (couponCopyToClipboard[0] === '') {
        couponCopyToClipboard.slice(1);
      }

      // Set the state with the couponCopyToClipboard array
      setState({
        value: couponCopyToClipboard.toString().replace(/,/g, '\n'),
        copied: false,
      });

      // Reset the form
      setFormDataCoupons({
        brand: '',
        country: '',
        amount: '',
        wetsuit: '',
        nbcoupons: '',
        facturationCode: '',
      });

      // Show the coupons table
      document.getElementById('coupons')?.classList.remove('inactive');

      getCouponsInformation();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;
      alert(`${errorMessage} please contact the administrator`);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    getCouponsInformation();
  }, []);

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
          {listCoupons.map((brand, index) => (
            <option key={index} value={brand.brand.name}>
              {brand.brand.name}
            </option>
          ))}
        </select>
        <select
          id="coupon-country"
          name="country"
          required
          value={formDataCoupons.country}
          onChange={handleChangeGetCoupons}
        >
          <option default-value="">Select country</option>
          {listCoupons
            .find((brand) => brand.brand.name === formDataCoupons.brand)
            ?.brand.countries.map((country, index) => (
              <option key={index} value={country.name}>
                {country.name}
              </option>
            ))}
        </select>
        <select
          id="facturationCode"
          name="facturationCode"
          required
          value={formDataCoupons.facturationCode}
          onChange={handleChangeGetCoupons}
        >
          <option default-value="">Select a facturation code</option>
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
          {listCoupons
            ?.find((brand) => brand.brand.name === formDataCoupons.brand)
            ?.brand.countries.find(
              (country) => country.name === formDataCoupons.country
            )
            ?.coupons.map((coupon, index) => (
              <option
                key={index}
                value={
                  coupon.wetsuit === 'false'
                    ? coupon.amount
                    : `${coupon.amount}-wetsuit`
                }
              >
                {coupon.wetsuit === 'false'
                  ? coupon.amount
                  : `WETSUITS ${coupon.amount}`}
              </option>
            ))}
        </select>
        <select
          id="coupon-nbcoupons"
          name="nbcoupons"
          required
          value={formDataCoupons.nbcoupons}
          onChange={handleChangeGetCoupons}
        >
          <option default-value="">Select number of coupons</option>
          {Array.from(
            {
              length: Number(
                Math.min(
                  Number(
                    listCoupons
                      ?.find(
                        (brand) => brand.brand.name === formDataCoupons.brand
                      )
                      ?.brand.countries.find(
                        (country) => country.name === formDataCoupons.country
                      )
                      ?.coupons.find(
                        (coupon) =>
                          coupon.amount === parseInt(formDataCoupons.amount) &&
                          coupon.wetsuit === formDataCoupons.wetsuit
                      )?.nb_coupons || 0
                  ),
                  10
                )
              ),
            },
            (_, i) => i + 1
          ).map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
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
        <div className="copy-coupons">
          <textarea value={state.value} readOnly style={{ display: 'none' }} />
          <CopyToClipboard
            text={state.value}
            onCopy={() => setState({ ...state, copied: true })}
          >
            <button>Copy Coupons</button>
          </CopyToClipboard>
          {state.copied && (
            <>
              <br />
              <span>Copied!</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Coupons;
