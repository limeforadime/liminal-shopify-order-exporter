import { Button, Popover, ChoiceList, DatePicker } from '@shopify/polaris';
import moment from 'moment';
import { useCallback, useState } from 'react';

const DatePopover = ({ addTag }) => {
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [{ month, year }, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [datePopoverActive, setDatePopoverActive] = useState(false);
  const [dateChoiceSelected, setDateChoiceSelected] = useState(['after']);
  const dateChoices = [
    { label: 'On', value: 'on' },
    { label: 'After', value: 'after' },
    { label: 'Between', value: 'between' },
    { label: 'Before', value: 'before' },
  ];
  const handleAddDateFilterButton = () => {
    let tagString;
    let formattedStartDate = moment(selectedDates.start).format('MMM D, YYYY');
    let formattedEndDate = moment(selectedDates.end).format('MMM D, YYYY');
    if (dateChoiceSelected[0] === 'between') {
      tagString = `Date: Between ${formattedStartDate} - ${formattedEndDate}`;
    } else {
      tagString = `Date: ${dateChoiceSelected[0][0].toUpperCase()}${dateChoiceSelected[0].slice(
        1
      )} ${formattedEndDate}`;
    }
    addTag(tagString, true);
    setDatePopoverActive(false);
  };

  const handleMonthChange = useCallback((month, year) => setDate({ month, year }), []);
  const handleDateChoiceChange = useCallback((value) => setDateChoiceSelected(value), []);
  const toggleDatePopoverActive = useCallback(
    () => setDatePopoverActive((popoverActive) => !popoverActive),
    []
  );

  return (
    <Popover
      fullHeight
      preferredAlignment="left"
      active={datePopoverActive}
      activator={
        <Button disclosure="down" onClick={toggleDatePopoverActive}>
          Date
        </Button>
      }
      onClose={toggleDatePopoverActive}
    >
      <Popover.Pane>
        <Popover.Section>
          <ChoiceList choices={dateChoices} selected={dateChoiceSelected} onChange={handleDateChoiceChange} />
        </Popover.Section>
        <Popover.Section>
          <DatePicker
            month={month}
            year={year}
            onChange={setSelectedDates}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
            allowRange={dateChoiceSelected[0] === 'between'}
            disableDatesAfter={new Date()}
            multiMonth={dateChoiceSelected[0] === 'between'}
          />
          <Button primary fullWidth onClick={handleAddDateFilterButton}>
            Add Filter
          </Button>
        </Popover.Section>
      </Popover.Pane>
    </Popover>
  );
};

export default DatePopover;
