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

  const [timeRange, setTimeRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [csvData, setCsvData] = useState([]);
  const [openDate, setOpenDate] = useState(false);
  const [validateTimeRange, setValidateTimeRange] = useState(false);

  const handleSelectBtn = () => {
    setOpenDate(!openDate);
  };

  const handleChangeDate = async () => {
    const startDate = format(timeRange[0].startDate, 'yyyy-MM-dd');
    const endDate = format(timeRange[0].endDate, 'yyyy-MM-dd');

    const result = await axios.get(
      `http://localhost:3000/api/export/${startDate}/${endDate}`,
      { withCredentials: true }
    );

    setCsvData(result.data);
    setOpenDate(false);
    setValidateTimeRange(true);
  };

  return (
    <div className="export">
      <h1>Export</h1>
      <div className="btn-select-time-range" onClick={handleSelectBtn}>
        Select time range
      </div>
      {openDate ? (
        <>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setTimeRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={timeRange}
          />
          <button onClick={handleChangeDate}>Validate</button>
        </>
      ) : null}

      {validateTimeRange ? (
        <CSVLink
          data={csvData}
          filename={`foc-export-${format(
            timeRange[0].startDate,
            'yyyy-MM-dd'
          )}-${format(timeRange[0].endDate, 'yyyy-MM-dd')}.csv`}
        >
          Download CSV from <br />
          {format(timeRange[0].startDate, 'yyyy-MM-dd')} to{' '}
          {format(timeRange[0].endDate, 'yyyy-MM-dd')}
        </CSVLink>
      ) : null}
    </div>
  );
}

export default Export;
