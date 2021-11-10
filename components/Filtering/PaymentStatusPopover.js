import { Button, Popover, ChoiceList } from '@shopify/polaris';
import { useCallback, useState } from 'react';

const PaymentStatusPopover = ({ addTag }) => {
  const [paymentStatusPopoverActive, setPaymentStatusPopoverActive] = useState(false);
  const [paymentStatusChoiceSelected, setPaymentStatusChoiceSelected] = useState([]);
  const paymentStatusChoices = [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Voided', value: 'voided' },
    { label: 'Pending', value: 'pending' },
    { label: 'Refunded', value: 'refunded' },
    { label: 'Authorized', value: 'authorized' },
    { label: 'Partially paid', value: 'partiallyPaid' },
    { label: 'Partially refunded', value: 'partiallyRefunded' },
  ];
  const handlePaymentStatusChoiceChange = useCallback((value) => setPaymentStatusChoiceSelected(value), []);
  const togglePaymentStatusPopoverActive = useCallback(
    () => setPaymentStatusPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const handleAddPaymentStatusFilterButton = useCallback(() => {
    try {
      let tagString = 'Payment status: ';
      let formattedChoiceArray = paymentStatusChoiceSelected
        .map((selected) => paymentStatusChoices.find((choice) => choice.value == selected).label)
        .join(', ');
      tagString += formattedChoiceArray;
      addTag(tagString, true);
      togglePaymentStatusPopoverActive();
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <Popover
      fullHeight
      preferredAlignment="left"
      active={paymentStatusPopoverActive}
      activator={
        <Button disclosure="down" onClick={togglePaymentStatusPopoverActive}>
          Payment status
        </Button>
      }
      onClose={togglePaymentStatusPopoverActive}
    >
      <Popover.Pane>
        <Popover.Section>
          <ChoiceList
            allowMultiple
            choices={paymentStatusChoices}
            selected={paymentStatusChoiceSelected}
            onChange={handlePaymentStatusChoiceChange}
          />
        </Popover.Section>
        <Popover.Section>
          <Button
            primary
            fullWidth
            onClick={handleAddPaymentStatusFilterButton}
            disabled={paymentStatusChoiceSelected.length == 0}
          >
            Add Filter
          </Button>
        </Popover.Section>
      </Popover.Pane>
    </Popover>
  );
};
export default PaymentStatusPopover;
