import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { FC } from 'react';

interface BrandData {
  count: number;
  sum: number;
}

interface GlobalLineChartData {
  time: string;
  brands: { [brand: string]: BrandData };
}

interface Brand {
  name: string;
  color: string;
}

interface BrandList {
  [brand: string]: Brand;
}

const brandsList: BrandList[] = [
  { roxy: { name: 'roxy', color: '#FF5733' } },
  { quiksilver: { name: 'quiksilver', color: '#1F77B4' } },
  { dcshoes: { name: 'dcshoes', color: '#2CA02C' } },
  { billabong: { name: 'billabong', color: '#9467BD' } },
  { element: { name: 'element', color: '#D62728' } },
  { rvca: { name: 'rvca', color: '#FF7F0E' } },
];

interface GlobalLineChartProps {
  dataAmountByPeriod: GlobalLineChartData[];
}

const GlobalLineChart: FC<GlobalLineChartProps> = ({ dataAmountByPeriod }) => {
  return (
    <section className="area-part">
      <div className="stacked-area-chart">
        <AreaChart
          width={1000}
          height={400}
          data={dataAmountByPeriod}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          {brandsList.map((brand, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={`${Object.keys(brand)[0]}.sum`}
              stackId="1"
              stroke={Object.values(brand)[0].color}
              fill={Object.values(brand)[0].color}
            />
          ))}
        </AreaChart>
      </div>
    </section>
  );
};

export default GlobalLineChart;
