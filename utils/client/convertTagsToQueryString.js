const convertTagsToQueryString = (
  tags,
  moment,
  { paymentStatusChoices, fulfillmentStatusChoices, statusChoices }
) => {
  let finalString = '?';
  tags.forEach((tag) => {
    let [filterWord, tagWords] = tag.split(': ');
    switch (filterWord) {
      case 'Date':
        finalString += convertTagsStrategies.dateStrategy(tagWords, moment) + '&';
        break;
      case 'Payment status':
        finalString += convertTagsStrategies.paymentStrategy(tagWords, paymentStatusChoices) + '&';
        break;
      case 'Fulfillment status':
        finalString += convertTagsStrategies.fulfillmentStrategy(tagWords, fulfillmentStatusChoices) + '&';
        break;
      case 'Status':
        finalString += convertTagsStrategies.statusStrategy(tagWords, statusChoices) + '&';
        break;
    }
  });
  return finalString;
};

const convertTagsStrategies = {
  dateStrategy: function (tagWords, moment) {
    let dateType = tagWords.split(' ')[0].toLowerCase(); // 'on', 'after', 'between', 'before'
    let actualDate = tagWords.split(' ').slice(1).join(' '); // eg. 'Nov 12, 2021';
    let formattedDate = moment(actualDate, 'MMM D, YYYY').toISOString(); // '2021-11-12T08:00:00.000Z'
    switch (dateType) {
      case 'on':
        return dateSubStrategies.on(actualDate, moment);
      case 'after':
        return dateSubStrategies.after(formattedDate);
      case 'before':
        return dateSubStrategies.before(formattedDate);
      case 'between':
        return dateSubStrategies.between(actualDate, moment);
    }
  },
  paymentStrategy: function (tagWords, paymentStatusChoices) {
    let result = tagWords
      .split(', ')
      .map((selected) => paymentStatusChoices.find((choice) => choice.label == selected).value);
    return new URLSearchParams({ financial_status: result }).toString();
  },
  fulfillmentStrategy: function (tagWords, fulfillmentStatusChoices) {
    let result = tagWords
      .split(', ')
      .map((selected) => fulfillmentStatusChoices.find((choice) => choice.label == selected).value);
    return new URLSearchParams({ fulfillment_status: result }).toString();
  },
  statusStrategy: function (tagWords, statusChoices) {
    let result = statusChoices.find((choice) => choice.label == tagWords).value;
    return new URLSearchParams({ status: result }).toString();
  },
};

const dateSubStrategies = {
  on: (actualDate, moment) => {
    return new URLSearchParams({
      created_at_min: moment(actualDate, 'MMM D, YYYY').startOf('day').toISOString(),
      created_at_max: moment(actualDate, 'MMM D, YYYY').endOf('day').toISOString(),
    }).toString();
  },
  before: (formattedDate) => {
    return new URLSearchParams({ created_at_max: formattedDate }).toString();
  },
  after: (formattedDate) => {
    return new URLSearchParams({ created_at_min: formattedDate }).toString();
  },
  between: (actualDate, moment) => {
    // "actualDate" will start as: 'Oct 11, 2021 - Nov 5, 2021'
    let [min, max] = actualDate.split(' - '); // min: 'Oct 11, 2021'; max: 'Nov 5, 2021'
    let formattedMin = moment(min, 'MMM D, YYYY').startOf('day').toISOString();
    let formattedMax = moment(max, 'MMM D, YYYY').endOf('day').toISOString();
    return new URLSearchParams({ created_at_min: formattedMin, created_at_max: formattedMax }).toString();
  },
};
export { convertTagsStrategies, dateSubStrategies };
export default convertTagsToQueryString;
