import moment from 'moment';
import convertTagsToQueryString, { convertTagsStrategies, dateSubStrategies } from './convertTagsToQueryString';
const { paymentStrategy, statusStrategy, fulfillmentStrategy } = convertTagsStrategies;

const allStatusChoices = {
  paymentStatusChoices: [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Voided', value: 'voided' },
    { label: 'Pending', value: 'pending' },
    { label: 'Refunded', value: 'refunded' },
    { label: 'Authorized', value: 'authorized' },
    { label: 'Partially paid', value: 'partially_paid' },
    { label: 'Partially refunded', value: 'partially_refunded' },
  ],
  statusChoices: [
    { label: 'Open', value: 'open' },
    { label: 'Archived', value: 'closed' },
    { label: 'Cancelled', value: 'cancelled' },
  ],
  fulfillmentStatusChoices: [
    { label: 'Shipped', value: 'shipped' },
    { label: 'Partially fulfilled', value: 'partial' },
    { label: 'Unfulfilled', value: 'unfulfilled' },
  ],
};
const { paymentStatusChoices, statusChoices, fulfillmentStatusChoices } = allStatusChoices;

describe.only('skip all', () => {
  console.log('skip all tests');
});

describe('Main convertTagsToQueryString function', () => {
  it('Should return a string', () => {
    expect(typeof convertTagsToQueryString(['Date: On Nov 12, 2021'], moment, allStatusChoices)).toBe('string');
    expect(
      typeof convertTagsToQueryString(['Date: Before Nov 12, 2021', 'Status: Open'], moment, allStatusChoices)
    ).toBe('string');
    expect(typeof convertTagsToQueryString(['Date: After Nov 12, 2021'], moment, allStatusChoices)).toBe('string');
    expect(
      typeof convertTagsToQueryString(['Date: Between Nov 12, 2021 - Nov 20, 2021'], moment, allStatusChoices)
    ).toBe('string');
  });
  it('Basic input tests', () => {
    expect(convertTagsToQueryString(['Date: On Nov 12, 2021'], moment, allStatusChoices)).toEqual(
      '?created_at_min=2021-11-12T08%3A00%3A00.000Z&created_at_max=2021-11-13T07%3A59%3A59.999Z&'
    );
    expect(
      convertTagsToQueryString(
        ['Date: On Nov 12, 2021', 'Payment status: Paid, Refunded'],
        moment,
        allStatusChoices
      )
    ).toEqual(
      '?created_at_min=2021-11-12T08%3A00%3A00.000Z&created_at_max=2021-11-13T07%3A59%3A59.999Z&financial_status=paid%2Crefunded&'
    );
    expect(
      convertTagsToQueryString(
        ['Date: On Nov 12, 2021', 'Payment status: Paid, Refunded', 'Status: Archived'],
        moment,
        allStatusChoices
      )
    ).toEqual(
      '?created_at_min=2021-11-12T08%3A00%3A00.000Z&created_at_max=2021-11-13T07%3A59%3A59.999Z&financial_status=paid%2Crefunded&status=closed&'
    );
    expect(
      convertTagsToQueryString(
        [
          'Date: On Nov 12, 2021',
          'Payment status: Paid, Refunded',
          'Status: Archived',
          'Fulfillment status: Shipped',
        ],
        moment,
        allStatusChoices
      )
    ).toEqual(
      '?created_at_min=2021-11-12T08%3A00%3A00.000Z&created_at_max=2021-11-13T07%3A59%3A59.999Z&financial_status=paid%2Crefunded&status=closed&fulfillment_status=shipped&'
    );
  });
});

describe('Date', () => {
  describe('"Between" strategy', () => {
    it('Should contain created_at_min and created_at_max', () => {
      expect(dateSubStrategies.between('Nov 12, 2021', moment)).toMatch('created_at_min');
      expect(dateSubStrategies.between('Nov 12, 2021', moment)).toMatch('created_at_max');
    });
  });

  describe('"On" strategy', () => {
    it('Should contain created_at_min and created_at_max', () => {
      expect(dateSubStrategies.on('Nov 12, 2021', moment)).toMatch('created_at_min');
      expect(dateSubStrategies.on('Nov 12, 2021', moment)).toMatch('created_at_max');
    });

    it('Basic input test', () => {
      expect(dateSubStrategies.on('Nov 12, 2021', moment)).toBe(
        'created_at_min=2021-11-12T08%3A00%3A00.000Z&created_at_max=2021-11-13T07%3A59%3A59.999Z'
      );
    });
  });

  describe('"After" strategy', () => {
    it('Basic input test', () => {
      expect(dateSubStrategies.after('Nov 12, 2021', moment)).toBe('created_at_min=2021-11-13T07%3A59%3A59.999Z');
    });
  });

  describe('"Before" strategy', () => {
    it('Basic input test', () => {
      expect(dateSubStrategies.before('Nov 12, 2021', moment)).toBe('created_at_max=2021-11-12T08%3A00%3A00.000Z');
    });
  });
});

describe('Payment status', () => {
  it('Basic input test', () => {
    expect(paymentStrategy('Paid, Refunded, Partially refunded', paymentStatusChoices)).toEqual(
      'financial_status=paid%2Crefunded%2Cpartially_refunded'
    );
    expect(paymentStrategy('Paid', paymentStatusChoices)).toEqual('financial_status=paid');
  });
});

describe('Fulfillment status', () => {
  it('Basic input test', () => {
    expect(fulfillmentStrategy('Shipped, Partially fulfilled, Unfulfilled', fulfillmentStatusChoices)).toEqual(
      'fulfillment_status=shipped%2Cpartial%2Cunfulfilled'
    );
    expect(fulfillmentStrategy('Shipped', fulfillmentStatusChoices)).toEqual('fulfillment_status=shipped');
  });
});

describe('Status', () => {
  it('Basic input test', () => {
    expect(statusStrategy('Open', statusChoices)).toEqual('status=open');
    expect(statusStrategy('Archived', statusChoices)).toEqual('status=closed');
    expect(statusStrategy('Cancelled', statusChoices)).toEqual('status=cancelled');
  });
});
