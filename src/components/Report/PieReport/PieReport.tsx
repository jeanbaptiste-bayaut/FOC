import './PieReport.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie } from 'recharts';

function PieReport() {
  const [dataAmountByBrand, setDataAmountByBrand] = useState([
    {
      brand_name: '',
      sum: 0,
      count: 0,
    },
  ]);
  const getAmountByBrand = async () => {
    try {
      const result = await axios.get(
        `http://localhost:3000/api/report/amount-by-brand`,
        { withCredentials: true }
      );

      result.data.forEach((element: { sum: number; count: number }) => {
        element.sum = Number(element.sum);
        element.count = Number(element.count);
      });

      setDataAmountByBrand(result.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    getAmountByBrand();
  }, []);

  console.log('dataAmountByBrand:', dataAmountByBrand);

  return (
    <div className="pie-container">
      <div>
        <h2>Split by Brand amount</h2>
        <PieChart width={400} height={250}>
          <Pie
            data={dataAmountByBrand}
            dataKey="sum"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            nameKey="name"
          />
        </PieChart>
      </div>
      <div>
        <h2>Split by Number of coupons</h2>
        <PieChart width={400} height={250}>
          <Pie
            data={dataAmountByBrand}
            dataKey="count"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            nameKey="name"
          />
        </PieChart>
      </div>
    </div>
  );
}

export default PieReport;
