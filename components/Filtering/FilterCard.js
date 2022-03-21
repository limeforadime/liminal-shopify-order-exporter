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
import moment from 'moment';
import { useAppBridge } from '@shopify/app-bridge-react';
import React, { useCallback, useEffect, useState } from 'react';
import userLoggedInFetch from 'utils/client/userLoggedInFetch';
import convertTagsToQueryString from 'utils/client/convertTagsToQueryString';
import { allStatusChoices } from './data/allStatusChoicesData';
import CommonDatesRibbon from './CommonDatesRibbon';
import DatePopover from './DatePopover';
import StatusPopover from './StatusPopover';
import PaymentStatusPopover from './PaymentStatusPopover';
import FulfillmentStatusPopover from './FulfillmentStatusPopover';

const FilterCard = ({ selectedTags, setSelectedTags }) => {
  const app = useAppBridge();
  const [orderCount, setOrderCount] = useState(0);

  // Off temporarily
  // Gets current count of orders that this query would retrieve, and updates label
  // useEffect(() => {
  //   const getOrderCount = async () => {
  //     try {
  //       // TODO: add search params to url
  //       const res = await userLoggedInFetch(app)('/api/orderCount');
  //       if (res.status == 200) {
  //         const responseData = await res.json();
  //         setOrderCount(Number(responseData));
  //       } else {
  //         throw new Error("Couldn't fetch order count");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   getOrderCount();
  // }, [selectedTags]);

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
  const tagMarkup = selectedTags.map((choice) => (
    <Tag key={choice} onRemove={removeTag(choice)}>
      {choice}
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
              <StatusPopover addTag={addTag} statusChoices={allStatusChoices.statusChoices} />
              <PaymentStatusPopover addTag={addTag} paymentStatusChoices={allStatusChoices.paymentStatusChoices} />
              <FulfillmentStatusPopover
                addTag={addTag}
                fulfillmentStatusChoices={allStatusChoices.fulfillmentStatusChoices}
              />
            </ButtonGroup>
            <Button plain destructive onClick={clearFilters}>
              Clear Filters
            </Button>
          </Stack>
          <Stack spacing="tight">{tagMarkup}</Stack>
          <Subheading>Orders that match criteria: {orderCount}</Subheading>
          <Button onClick={() => console.log(convertTagsToQueryString(selectedTags, moment, allStatusChoices))}>
            Test converting tags to query string
          </Button>
        </TextContainer>
      </Card.Section>
    </Card>
  );
};

export default FilterCard;
