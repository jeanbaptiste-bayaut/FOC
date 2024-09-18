import './Export.css';
import { CSVLink } from 'react-csv';
import { DateRange } from 'react-date-range';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

function Export() {
  interface Range {
    startDate: Date;
    endDate: Date;
    key: 'selection';
  }
  const csvData = [
    { name: 'John Doe', age: 33, email: 'dzedzed' },
    { name: 'Jane Doe', age: 31, email: 'zedzdzed' },
  ];

  const [timeRange, setTimeRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const exportCsv = async () => {
    const startDate = format(timeRange[0].startDate, 'yyyy-MM-dd');
    const endDate = format(timeRange[0].endDate, 'yyyy-MM-dd');

    console.log(startDate, endDate);

    const result = await axios.get(
      `http://localhost:3000/export/${startDate}/${endDate}`,
      { withCredentials: true }
    );

    return result;
  };

  useEffect(() => {
    exportCsv();
  }, []);

  return (
    <div className="Export">
      <h1>Export</h1>
      <div>Select time range</div>
      <DateRange
        editableDateInputs={true}
        onChange={(item) => setTimeRange([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={timeRange}
      />
      <CSVLink data={csvData}>Download me</CSVLink>
    </div>
  );
}

export default Export;
