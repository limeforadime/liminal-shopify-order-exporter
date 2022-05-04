const filterOrderSubgroup = (subgroup) => {};

export { filterOrderSubgroup };

// Will probably want to filter and format at the same time to reduce passes

/*
Example:
Turning  this,
"customer": {
  "email": "bob.norman@hostmail.com",
  "first_name": "Bob",
  "last_name": "Norman",
  "note": null,
  "phone": "+16136120707",
},
  |
  v
into this:
"customer": {
  "Email": "bob.norman@hostmail.com",
  "Customer First Name": "Bob",
  "Customer First Name": "Norman",
  "Customer Note": null,
  "Phone": "+1613612070"
}
  |
  v
and then stripping out the top level, turning it into this:
{
  "Customer Email": "bob.norman@hostmail.com",
  "Customer First Name": "Bob",
  "Customer First Name": "Norman",
  "Customer Note": null,
  "Customer Phone": "+1613612070"
}

Then, for example, for Line Items:
{
  line_items: [
    "id": "23432432"
    properties: [
      {
        "name": "asdf",
        "value": "wuddup"
      }
    ]
  ]
}
  |
  v
{
  "Line Items/0/id": "23423424",
  "Line Items/0/properties/0/name": "asdf"
  "Line Items/0/properties/0/value": "wuddup"
}
==========================================
STEPS: 
Receiving object representing checked fields from the user:

checkedCustomerState: {
  customer__email: true,
  customer__first_name: false,
  customer__last_name: false,
  customer__phone: false,
  customer__note: false
}

Then, checking that against the actual data returned for that subgroup:
"customer": {
  "email": "bob.norman@hostmail.com",
  "first_name": "Bob",
  "last_name": "Norman",
  "note": null,
  "phone": "+16136120707",
},

I want to return an object of:
"customer": {
  "email": "bob.norman@hostmail.com",
},

*/

// function to strip string after "__"
const stripAfterDelimiter = (field) => field.split('__')[1];
