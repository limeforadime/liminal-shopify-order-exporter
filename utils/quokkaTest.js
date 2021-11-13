import moment from 'moment';
const paymentStatusChoices = [
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Voided', value: 'voided' },
  { label: 'Pending', value: 'pending' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Authorized', value: 'authorized' },
  { label: 'Partially paid', value: 'partially_paid' },
  { label: 'Partially refunded', value: 'partially_refunded' },
];
const statusChoices = [
  { label: 'Open', value: 'open' },
  { label: 'Archived', value: 'closed' },
  { label: 'Cancelled', value: 'cancelled' },
];
const fulfillmentStatusChoices = [
  { label: 'Shipped', value: 'shipped' },
  { label: 'Partially fulfilled', value: 'partial' },
  { label: 'Unfulfilled', value: 'unfulfilled' },
];
const convertTagsToQueryStringOld = (tags) => {
  let finalString = '?';
  tags.forEach((tag) => {
    let [filterWord, tagWords] = tag.split(': ');
    let tagWordsArray;
    // Example possible inputs: 'Date: On Nov 12, 2021',
    // 'Date: After Nov 12, 2021',
    // 'Date: Between Oct 12, 2021 - Nov 5, 2021'
    if (filterWord.toLowerCase().includes('date')) {
      // eg. tagWords = 'On Nov 12, 2021'
      let dateType = tagWords.split(' ')[0].toLowerCase();
      let actualDate = tagWords.split(' ').slice(1).join(' '); // 'Nov 12, 2021';
      let formattedDate = moment(actualDate).toISOString();
      switch (dateType) {
        case 'on':
          // created_at_min === created_at_max
          finalString +=
            new URLSearchParams({
              created_at_min: moment(actualDate).startOf('day').toISOString(),
              created_at_max: moment(actualDate).endOf('day').toISOString(),
            }).toString() + '&';
          break;
        case 'after':
          // created_at_min
          finalString += new URLSearchParams({ created_at_min: formattedDate }).toString() + '&';
          break;
        case 'before':
          // created_at_max
          finalString += new URLSearchParams({ created_at_max: formattedDate }).toString() + '&';
          break;
        case 'between':
          // created_at_max <-> created_at_min
          // "actualDate" will start as: 'Oct 11, 2021 - Nov 5, 2021'
          let [min, max] = actualDate.split(' - '); // min: 'Oct 11, 2021'; max: 'Nov 5, 2021'
          let formattedMin = moment(min).startOf('day').toISOString();
          let formattedMax = moment(max).endOf('day').toISOString();
          finalString +=
            new URLSearchParams({ created_at_min: formattedMin, created_at_max: formattedMax }).toString() +
            '&';
          break;
      }
      // TODO
    } else if (filterWord.toLowerCase().includes('payment')) {
      tagWordsArray = tagWords.split(', ');
      let result = tagWordsArray.map(
        (selected) => paymentStatusChoices.find((choice) => choice.label == selected).value
      );
      finalString += new URLSearchParams({ financial_status: result }).toString() + '&';
    } else if (filterWord.toLowerCase().includes('fulfillment')) {
      tagWordsArray = tagWords.split(', ');
      let result = tagWordsArray.map(
        (selected) => fulfillmentStatusChoices.find((choice) => choice.label == selected).value
      );
      finalString += new URLSearchParams({ fulfillment_status: result }).toString() + '&';
    } else {
      let result = statusChoices.find((choice) => choice.label == tagWords).value;
      finalString += new URLSearchParams({ status: result }).toString() + '&';
    }
  });
  return finalString;
};
console.log(
  convertTagsToQueryStringOld([
    'Date: Between Nov 12, 2021 - Nov 20, 2021',
    'Status: Open',
    'Payment status: Paid, Refunded',
    'Fulfillment status: Partially fulfilled, Unfulfilled, Shipped',
  ])
);
