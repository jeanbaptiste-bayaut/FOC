import './Report.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import GlobalLlineChart from './GlobalLineChart/GlobalLineChart';
import PieReport from './PieReport/PieReport';

function Report() {
  const [dataCouponsByBrand, setDataCouponsByBrand] = useState([
    {
      name: '',
      count: 0,
      amount: 0,
      sum: 0,
    },
  ]);

  const getNbCouponsByAmountByBrand = async () => {
    try {
      const result = await axios.get(
        `http://localhost:3000/api/report/coupons-by-amount`,
        { withCredentials: true }
      );

      setDataCouponsByBrand(result.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    getNbCouponsByAmountByBrand();
  }, []);

  const quikReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'quiksilver'
  );
  const roxyReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'roxy'
  );
  const dcReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'quiksilver'
  );
  const bbgReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'roxy'
  );
  const eltReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'quiksilver'
  );
  const rvcaReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'roxy'
  );

  const brands = [
    { name: 'Quiksilver', report: quikReport },
    { name: 'Roxy', report: roxyReport },
    { name: 'Dcshoes', report: dcReport },
    { name: 'Billabong', report: bbgReport },
    { name: 'Element', report: eltReport },
    { name: 'Rvca', report: rvcaReport },
  ];

  return (
    <>
      <h1>Report</h1>
      <GlobalLlineChart />
      <div className="report-container">
        {brands.map((brand) => (
          <div className={brand.name}>
            <h2>{brand.name}</h2>
            <BarChart
              key={brand.name}
              width={400}
              height={250}
              data={brand.report} // Wrap the brand object in an array
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="amount" />
              <YAxis dataKey="count" />
              <Tooltip />
              <Legend
                payload={[{ value: 'Coupoun amount in €', type: 'line' }]}
              />
              <Bar dataKey="count" fill="#82ca9d" barSize={20} />
            </BarChart>
          </div>
        ))}
      </div>
      <>
        <PieReport />
      </>
    </>
  );
}

export default Report;
