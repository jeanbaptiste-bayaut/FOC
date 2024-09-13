import './DateRange.css';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function DateRangeTool() {
  const [openDate, setOpenDate] = useState(false);
  const currentDate = new Date();
  const currentDateFormated = format(new Date(), 'yyyy-MM-dd');

  const threeMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 3,
    currentDate.getDate()
  );

  console.log('threeMonthsAgo:', threeMonthsAgo);

  const threeMonthsAgoFormated = format(threeMonthsAgo, 'yyyy-MM-dd');
  console.log('threeMonthsAgoFormated:', threeMonthsAgoFormated);

  const [date, setDate] = useState([
    {
      startDate: threeMonthsAgo,
      endDate: currentDate,
      key: 'selection',
    },
  ]);

  const [dataAmountByPeriod, setdataAmountByPeriod] = useState([
    {
      time: '',
      sum: 0,
      count: 0,
    },
  ]);

  const getTimePeriodOpening = async () => {
    try {
      const result = await axios.get(
        `http://localhost:3000/api/report/amount-by-period/${threeMonthsAgoFormated}/${currentDateFormated}`,
        { withCredentials: true }
      );

      result.data.forEach((element: { sum: number; count: number }) => {
        element.sum = Number(element.sum);
        element.count = Number(element.count);
      });

      setdataAmountByPeriod(result.data);
      console.log('dataAmountByPeriod:', dataAmountByPeriod);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // to do : changer la range des dates pour updater le report

  useEffect(() => {
    getTimePeriodOpening();
  }, []);

  return (
    <section className="report-top">
      <div className="calendar">
        <span onClick={() => setOpenDate(!openDate)}>{`${format(
          date[0].startDate,
          'MM/dd/yyyy'
        )} to ${format(date[0].endDate, 'MM/dd/yyy')}`}</span>
        {openDate && (
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              if (item.selection) {
                setDate([item.selection]);
              }
            }}
            moveRangeOnFirstSelection={false}
            ranges={date}
            className="date"
          />
        )}
      </div>
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
          <Area
            type="monotone"
            dataKey="sum"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="sum"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
        </AreaChart>
      </div>
    </section>
  );
}

export default DateRangeTool;
