import React, { FC, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Import the utc plugin
import DatePicker from 'react-datepicker';
import CalendarIcon from '@/icons/calendar.svg';
import Input from '../Input';
import 'react-datepicker/dist/react-datepicker.css';

// Extend dayjs with the utc plugin
dayjs.extend(utc);

type CalendarProps = {
  label?: string;
  selectDateHandler: (startDate: Date, endDate: Date) => void;
};

const Calendar: FC<CalendarProps> = ({ selectDateHandler }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();

  const onChange = useCallback(
    (dates: any) => {
      let [start, end] = dates;
      if (start) {
        start = dayjs(start).utc().toDate();
      }
      if (end) {
        end = dayjs(end).utc().toDate();
      }
      setStartDate(start);
      setEndDate(end);
      selectDateHandler(start, end);
    },
    [selectDateHandler],
  );

  return (
    <DatePicker
      dateFormat="dd/MM/yyyy"
      maxDate={new Date()}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      customInput={<Input icon={CalendarIcon} />}
    />
  );
};

export default Calendar;
