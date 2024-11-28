import './Report.scss';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import { useState } from 'react';
import GlobalLineChart from './GlobalLineChart/GlobalLineChart';
import PieReport from './PieReport/PieReport';
import BarsReport from './BarsReport/BarsReport';
import useAxiosInterceptors from '../../service/axiosInterceptor';

interface Range {
  startDate: Date;
  endDate: Date;
  key: 'selection';
}

interface BarsReportProps {
  name: string;
  count: number;
  amount: number;
  sum: number;
}

interface PieReportProps {
  name: string;
  sum: number;
  count: number;
}

interface BrandData {
  count: number;
  sum: number;
}

interface GlobalLineChartData {
  time: string;
  brands: { [brand: string]: BrandData };
}

function Report() {
  useAxiosInterceptors();

  const [dataCouponsByBrand, setDataCouponsByBrand] = useState<
    BarsReportProps[]
  >([
    {
      name: '',
      count: 0,
      amount: 0,
      sum: 0,
    },
  ]);

  const [dataAmountByBrand, setDataAmountByBrand] = useState<PieReportProps[]>([
    {
      name: '',
      count: 0,
      sum: 0,
    },
  ]);

  const [total, setTotal] = useState([{ sum: 0, count: 0 }]);

  const [dataAmountByPeriod, setDataAmountByPeriod] = useState<
    GlobalLineChartData[]
  >([
    {
      time: '',
      brands: {
        brand: {
          count: 0,
          sum: 0,
        },
      },
    },
  ]);

  const [openDate, setOpenDate] = useState(false);

  const [date, setDate] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const getDataForPeriod = async () => {
    const startDateFormated = format(date[0].startDate, 'yyyy-MM-dd');
    const endDateFormated = format(date[0].endDate, 'yyyy-MM-dd');

    try {
      const amountByPeriod = await axios.get(
        `http://localhost:3000/api/report/amount-by-period/${startDateFormated}/${endDateFormated}`,
        { withCredentials: true }
      );

      const amountByBrand = await axios.get(
        `http://localhost:3000/api/report/amount-by-brand/${startDateFormated}/${endDateFormated}`,
        { withCredentials: true }
      );

      const coupopnsByAmount = await axios.get(
        `http://localhost:3000/api/report/coupons-by-amount/${startDateFormated}/${endDateFormated}`,
        { withCredentials: true }
      );

      amountByPeriod.data.forEach((element: { sum: number; count: number }) => {
        element.sum = Number(element.sum);
        element.count = Number(element.count);
      });

      amountByBrand.data.forEach((element: { sum: number; count: number }) => {
        element.sum = Number(element.sum);
        element.count = Number(element.count);
      });

      setDataAmountByPeriod(amountByPeriod.data);
      setDataCouponsByBrand(coupopnsByAmount.data);
      setDataAmountByBrand(amountByBrand.data);

      const total = [{ sum: 0, count: 0 }];
      amountByBrand.data.map((brand: { sum: number; count: number }) => {
        total[0].sum += brand.sum;
        total[0].count += brand.count;
      });
      setTotal(total);
    } catch (error) {
      console.error('Erreur:', error);
      throw new Error(`Erreur: ${error}`);
    }
  };

  return (
    <>
      <h1>Report</h1>
      <section className="report-top">
        <div className="summary">
          <p>
            <span>Total amount: </span>
            <span>{total[0].sum} €</span>
          </p>
          <p>
            <span>Total number of coupons: </span>
            <span>{total[0].count}</span>
          </p>
        </div>
        <div className="calendar">
          <p
            onClick={() => {
              setOpenDate(!openDate);
              getDataForPeriod();
            }}
          >
            <span className="date-picker-left">{`${format(
              date[0].startDate,
              'MM/dd/yyyy'
            )}`}</span>
            <span className="date-picker-right">{`${format(
              date[0].endDate,
              'MM/dd/yyy'
            )}`}</span>
          </p>
          {openDate && (
            <DateRangePicker
              onChange={(range) => {
                const { startDate, endDate } = range.selection;
                if (startDate && endDate) {
                  setDate([{ startDate, endDate, key: 'selection' }]);
                }
              }}
              ranges={date}
              className="date"
            />
          )}
          <small>Click to select a time range click again to validate</small>
        </div>
      </section>
      <GlobalLineChart dataAmountByPeriod={dataAmountByPeriod} />
      <BarsReport dataCouponsByBrand={dataCouponsByBrand} />
      <PieReport dataAmountByBrand={dataAmountByBrand} />
    </>
  );
}

export default Report;
