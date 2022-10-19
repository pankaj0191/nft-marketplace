import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment, { MomentInput } from 'moment';
import { Grid } from '@mui/material';

interface DateRangePickerProps {
  name: any;
  value: any;
  onChange: Function;
  format: string;
  duration: number;
}

export default function DateRangePicker({ name, value, onChange, format = "MM/dd/yyyy", duration = 1 }: DateRangePickerProps) {
  value = typeof value === "object" && value ? value.filter((v: any) => v) : [new Date(), new Date()];
  format = typeof format === "string" && format.trim() ? format.trim() : "yyyy/MM/dd";
  duration = typeof duration === "number" && duration > 0 ? duration - 1 : 0;
  const startDateName = name?.startDate || "startDate";
  const endDateName = name?.endDate || "endDate";
  const startDate = value.shift();
  const endDate = value.pop();

  const handleChange = (newValue: MomentInput, name: any, type: string) => {
    const endDate: any = moment(newValue).add(duration, 'd');
    onChange(newValue, name, {
      startDate: type === "startDate" ? newValue : startDate,
      endDate: type === "endDate" ? newValue : new Date(endDate),
    })
  };

  return (
    // <Grid container spacing={2} className="mb-4">
    <Grid container  spacing={2}  className="mb-4">

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid item xs={6}  className="create_datepicker_startdate">
          <MobileDatePicker
            label="Start Date"
            inputFormat={format}
            value={startDate}
            onChange={(newValue) => {
              handleChange(newValue, startDateName, "startDate")
            }}
            renderInput={(params) => <TextField {...params} />}
            closeOnSelect
          />
        </Grid>
        <Grid item xs={6}  className="create_datepicker_endate">
          <MobileDatePicker
            label="End Date"
            inputFormat={format}
            value={endDate}
            minDate={startDate}
            onChange={(newValue) => {
              handleChange(newValue, endDateName, "endDate")
            }}
            renderInput={(params) => <TextField {...params} />}
            closeOnSelect
          />
        </Grid>
      </LocalizationProvider>
    </Grid>
  );
}
