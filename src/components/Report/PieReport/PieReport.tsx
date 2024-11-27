import './PieReport.scss';
import { PieChart, Pie, Cell } from 'recharts';
import { FC } from 'react';

interface BrandData {
  name: string;
  sum: number;
  count: number;
}

interface PieReportProps {
  dataAmountByBrand: BrandData[];
}

const PieReport: FC<PieReportProps> = ({ dataAmountByBrand }) => {
  const colors = [
    '#FFD862',
    '#00B8BF',
    '#1987F4',
    '#802A8B',
    '#F75789',
    '#FF925E',
  ];

  const dataWithColors = dataAmountByBrand.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }));

  return (
    <div className="pie-container">
      <div>
        <h2>Split by Brand amount</h2>
        <PieChart width={400} height={250}>
          <Pie
            data={dataWithColors}
            dataKey="sum"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            nameKey="name"
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>
      <div>
        <h2>Split by Number of coupons</h2>
        <PieChart width={400} height={250}>
          <Pie
            data={dataWithColors}
            dataKey="count"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            nameKey="name"
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default PieReport;
