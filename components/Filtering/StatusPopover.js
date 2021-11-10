import { Button, Popover, ChoiceList } from '@shopify/polaris';
import { useCallback, useState } from 'react';

const StatusPopover = ({ addTag }) => {
  const [statusPopoverActive, setStatusPopoverActive] = useState(false);
  const [statusChoiceSelected, setStatusChoiceSelected] = useState(['open']);
  const statusChoices = [
    { label: 'Open', value: 'open' },
    { label: 'Archived', value: 'archived' },
    { label: 'Cancelled', value: 'cancelled' },
  ];
  const handleStatusChoiceChange = useCallback((value) => setStatusChoiceSelected(value), []);
  const toggleStatusPopoverActive = useCallback(
    () => setStatusPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const handleAddStatusFilterButton = useCallback(() => {
    let tagString;
    tagString = `Status: ${statusChoiceSelected[0][0].toUpperCase()}${statusChoiceSelected[0].slice(1)}`;
    addTag(tagString, true);
    toggleStatusPopoverActive();
  });

  return (
    <Popover
      fullHeight
      preferredAlignment="left"
      active={statusPopoverActive}
      activator={
        <Button disclosure="down" onClick={toggleStatusPopoverActive}>
          Status
        </Button>
      }
      onClose={toggleStatusPopoverActive}
    >
      <Popover.Pane>
        <Popover.Section>
          <ChoiceList
            choices={statusChoices}
            selected={statusChoiceSelected}
            onChange={handleStatusChoiceChange}
          />
        </Popover.Section>
        <Popover.Section>
          <Button primary fullWidth onClick={handleAddStatusFilterButton}>
            Add Filter
          </Button>
        </Popover.Section>
      </Popover.Pane>
    </Popover>
  );
};
export default StatusPopover;
