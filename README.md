# SD Assign 1404

This repository contains two standalone front-end projects built with HTML, CSS, and vanilla JavaScript.

## Repository Structure

```text
SD/
├─ certificate_generator/
│  └─ certificate_project/
│     ├─ certificate.js
│     ├─ index.html
│     └─ style.css
├─ UrbanBruBillSystem/
│  ├─ index.html
│  ├─ product.json
│  ├─ script.js
│  └─ style.css
├─ docs/
│  └─ screenshots/
└─ README.md
```

## Projects

### Certificate Generator

Location: `certificate_generator/certificate_project`

The certificate generator collects a participant name and donation amount, adds the current submission date and time, and displays a printable certificate with signature placeholders. The certificate can also be downloaded as an image.

### Urban Bru Billing System

Location: `UrbanBruBillSystem`

The cafe billing system loads products from `product.json`, adds products to a bill, tracks quantities, applies product discounts and GST, calculates totals, previews the invoice, and supports printing.

## How to Run

Both projects can be opened directly in a browser. For the billing system, using a local server is recommended so that `product.json` loads correctly.

1. Open the repository in VS Code.
2. Open the project folder you want to run.
3. Open its `index.html` with Live Server, Five Server, or another local HTTP server.

Project entry points:

- `certificate_generator/certificate_project/index.html`
- `UrbanBruBillSystem/index.html`

## Certificate Generator Usage

1. Enter the participant name.
2. Enter the donation amount.
3. Select **Generate Certificate**.
4. Review the generated certificate and select **Download Certificate** to save it.

## Urban Bru Usage

1. Select a product from the product list.
2. Select **Add to Bill**.
3. Adjust quantities or remove items as needed.
4. Select **Preview Bill** to review the invoice.
5. Select **Print Bill** to print the final bill.

## Screenshots

Project screenshots are stored in `docs/screenshots/`.
