import { Button, Stack } from '@shopify/polaris';
import moment from 'moment';

const CommonDatesRibbon = ({ addTag }) => {
  const handleCommonDatesFilterButton = (period) => () => {
    let tagString;
    let formattedStartDate = moment().subtract(period, 'days').format('MMM D, YYYY');
    let formattedEndDate = moment().format('MMM D, YYYY'); //today
    if (period == 0) {
      tagString = 'Date: Today';
    } else {
      tagString = `Date: Between ${formattedStartDate} - ${formattedEndDate}`;
    }
    addTag(tagString, true);
  };

  return (
    <Stack>
      <Button plain onClick={handleCommonDatesFilterButton(0)}>
        Today
      </Button>
      <Button plain onClick={handleCommonDatesFilterButton(7)}>
        Last 7 days
      </Button>
      <Button plain onClick={handleCommonDatesFilterButton(30)}>
        Last 30 days
      </Button>
      <Button plain onClick={handleCommonDatesFilterButton(90)}>
        Last 90 days
      </Button>
      <Button plain onClick={handleCommonDatesFilterButton(365)}>
        Last 12 months
      </Button>
    </Stack>
  );
};

export default CommonDatesRibbon;
