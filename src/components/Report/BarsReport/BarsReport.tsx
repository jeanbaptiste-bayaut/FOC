import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { FC } from 'react';

interface Coupon {
  name: string;
  amount: number;
  count: number;
}

interface BarsReportProps {
  dataCouponsByBrand: Coupon[];
}

const BarsReport: FC<BarsReportProps> = ({ dataCouponsByBrand }) => {
  const quikReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'quiksilver'
  );
  const roxyReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'roxy'
  );
  const dcReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'dcshoes'
  );
  const bbgReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'billabong'
  );
  const eltReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'element'
  );
  const rvcaReport = dataCouponsByBrand.filter(
    (coupon) => coupon.name === 'rvca'
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
    <div className="report-bars">
      {brands.map((brand) => (
        <div className={brand.name}>
          <h2>{brand.name}</h2>
          <BarChart
            key={brand.name}
            width={400}
            height={300}
            data={brand.report} // Wrap the brand object in an array
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="6 6" />
            <XAxis dataKey="amount" />
            <YAxis dataKey="count" domain={[0, 30]} />
            <Tooltip />
            <Legend
              payload={[{ value: 'Coupoun amount in €', type: 'line' }]}
            />
            <Bar dataKey="count" fill="#82ca9d" barSize={15} />
          </BarChart>
        </div>
      ))}
    </div>
  );
};

export default BarsReport;
