import {
  Tag,
  Card,
  Button,
  ButtonGroup,
  Stack,
  TextContainer,
  Popover,
  ChoiceList,
  Subheading,
} from '@shopify/polaris';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import CommonDatesRibbon from './CommonDatesRibbon';
import DatePopover from './DatePopover';
import StatusPopover from './StatusPopover';
import PaymentStatusPopover from './PaymentStatusPopover';
import FulfillmentStatusPopover from './FulfillmentStatusPopover';

const FilterCard = () => {
  const [selectedTags, setSelectedTags] = useState([]);

  const removeTag = useCallback(
    (tag) => () => {
      setSelectedTags((previousTags) => previousTags.filter((previousTag) => previousTag !== tag));
    },
    []
  );
  /**
   * @param tag The new tag to be added
   * @param shouldReplace Whether or not the new tag will replace the old tag in the current array of tags
   */
  const addTag = useCallback((tag, shouldReplace) => {
    let filterWord = tag.split(':')[0];
    setSelectedTags((previousTags) => {
      if (shouldReplace) {
        return [...previousTags.filter((previousTag) => !previousTag.includes(filterWord)), tag];
      }
      return [...previousTags, tag];
    });
    // TODO: Make get request to /admin/api/2021-10/orders/count.json?status=any
    // Or rather, make the request to my own backend endpoint and have it do the logic
  }, []);
  const clearFilters = useCallback(() => setSelectedTags([]), []);
  const tagMarkup = selectedTags.map((option) => (
    <Tag key={option} onRemove={removeTag(option)}>
      {option}
    </Tag>
  ));

  return (
    <Card title="Filtering">
      <Card.Section>
        <TextContainer>
          <CommonDatesRibbon addTag={addTag} />
          <Stack>
            <ButtonGroup segmented>
              <DatePopover addTag={addTag} />
              <StatusPopover addTag={addTag} />
              <PaymentStatusPopover addTag={addTag} />
              <FulfillmentStatusPopover addTag={addTag} />
            </ButtonGroup>
            <Button plain destructive onClick={clearFilters}>
              Clear Filters
            </Button>
          </Stack>
          <Stack spacing="tight">{tagMarkup}</Stack>
          {selectedTags.length > 0 && <Subheading>Orders that match criteria: x</Subheading>}
        </TextContainer>
      </Card.Section>
    </Card>
  );
};

export default FilterCard;
