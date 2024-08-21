import React, { FC, useState } from 'react';
import DatePicker from 'react-datepicker';
import CalendarIcon from '@/icons/calendar.svg';
import Input from '../Input';
import 'react-datepicker/dist/react-datepicker.css';

type CalendarProps = {
  label?: string;
  selectDateHandler: (startDate: Date, endDate: Date) => void;
};

const Calendar: FC<CalendarProps> = ({ selectDateHandler }) => {
  const [startDate, setStartDate] = useState<any | null>(new Date());
  const [endDate, setEndDate] = useState<any | null>(null);

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    selectDateHandler(start, end);
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      customInput={<Input icon={CalendarIcon} />}
    />
  );
};

export default Calendar;
