// Store all products from JSON
let products;

// Store products added to the current bill
let bill = [];


// Get HTML elements
const subtotal = document.getElementById("subtotal");
const discount = document.getElementById("discount");
const gst = document.getElementById("gst");
const productSelect = document.getElementById("productSelect");
const addToBill = document.getElementById("addToBill");
const grandTotalDisplay = document.getElementById("grandTotal");

// Get preview elements
const previewBillButton = document.getElementById("previewBill");
const billPreview = document.getElementById("billPreview");
const previewItems = document.getElementById("previewItems");

const downloadBillButton = document.getElementById("downloadBill");

downloadBillButton.addEventListener("click", function () {
    if (bill.length === 0) {
        alert("Please add at least one product before downloading the bill.");
        return;
    }

    const totals = calculateTotals();
    const itemRows = bill.map(item => {
        const productSubtotal = item.product.mrp * item.quantity;
        const discountAmount = (item.product.discount / 100) * productSubtotal;
        const taxableAmount = productSubtotal - discountAmount;
        const gstAmount = taxableAmount * (item.product.gst / 100);
        const totalAmount = taxableAmount + gstAmount;

        return `
            <tr>
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>₹${totalAmount.toFixed(2)}</td>
            </tr>`;
    }).join("");

    const billHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Urban Bru Bill</title>
    <style>
        body { max-width: 720px; margin: 40px auto; padding: 0 24px; color: #24313b; font-family: Arial, sans-serif; }
        h1 { color: #17324d; margin-bottom: 4px; }
        p { color: #697783; }
        table { width: 100%; border-collapse: collapse; margin: 28px 0; }
        th, td { padding: 12px 8px; text-align: left; border-bottom: 1px solid #d9e0e5; }
        th { color: #17324d; }
        .amount { display: flex; justify-content: space-between; max-width: 320px; margin: 10px 0 10px auto; }
        .total { padding-top: 14px; border-top: 2px solid #17324d; color: #17324d; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Urban Bru</h1>
    <p>Cafe Bill / Invoice</p>
    <table>
        <thead><tr><th>Product</th><th>Quantity</th><th>Amount</th></tr></thead>
        <tbody>${itemRows}</tbody>
    </table>
    <div class="amount"><span>Subtotal:</span><span>₹${totals.totalSubtotal.toFixed(2)}</span></div>
    <div class="amount"><span>Discount:</span><span>₹${totals.totalDiscount.toFixed(2)}</span></div>
    <div class="amount"><span>GST:</span><span>₹${totals.totalGST.toFixed(2)}</span></div>
    <div class="amount total"><span>Grand Total:</span><span>₹${totals.grandTotal.toFixed(2)}</span></div>
</body>
</html>`;

    const billBlob = new Blob([billHtml], { type: "text/html" });
    const downloadUrl = URL.createObjectURL(billBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = "urban-bru-bill.html";
    downloadLink.click();
    URL.revokeObjectURL(downloadUrl);
});

function calculateTotals() {

    let totalSubtotal = 0;
    let totalDiscount = 0;
    let totalGST = 0;
    let grandTotal = 0;

    bill.forEach(item => {

        // Calculate product subtotal
        const productSubtotal =
            item.product.mrp * item.quantity;

        // Calculate discount amount
        const discountAmount =
            (item.product.discount / 100) * productSubtotal;

        // Calculate taxable amount
        const taxableAmount =
            productSubtotal - discountAmount;

        // Calculate GST amount
        const gstAmount =
            taxableAmount * (item.product.gst / 100);

        // Calculate final product amount
        const totalAmount =
            taxableAmount + gstAmount;
            totalSubtotal += productSubtotal;
            totalDiscount += discountAmount;
            totalGST += gstAmount;
            grandTotal += totalAmount;
    });

    return {
        totalSubtotal,
        totalDiscount,
        totalGST,
        grandTotal
    };
}

// Show bill preview
previewBillButton.addEventListener("click", function () {

    billPreview.style.display = "block";

    // Clear old preview items
previewItems.innerHTML = "";

// Add every bill item to preview
bill.forEach(item => {

    const previewItem = document.createElement("p");

    previewItem.textContent =
        `${item.product.name} × ${item.quantity}`;

    previewItems.appendChild(previewItem);

});
// Get overall bill totals
const totals = calculateTotals();

// Show totals in preview
document.getElementById("previewSubtotal").textContent =
    `₹${totals.totalSubtotal.toFixed(2)}`;

document.getElementById("previewDiscount").textContent =
    `₹${totals.totalDiscount.toFixed(2)}`;

document.getElementById("previewGST").textContent =
    `₹${totals.totalGST.toFixed(2)}`;

document.getElementById("previewGrandTotal").textContent =
    `₹${totals.grandTotal.toFixed(2)}`;
});

// Add selected product to bill
addToBill.addEventListener("click", function () {

    // Find the selected product
    const selectedProduct = products.find(product => {
        return product.name === productSelect.value;
    });

    // Stop if no product is selected
    if (!selectedProduct) {
        alert("Please select a product.");
        return;
    }


    // Check if product already exists in bill
    const existingItem = bill.find(item => {
        return item.product.name === selectedProduct.name;
    });


    // Increase quantity if product already exists
    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        // Add new product with quantity 1
        bill.push({
            product: selectedProduct,
            quantity: 1
        });

    }


    console.log(bill);
    // Calculate overall bill totals

// Calculate overall totals
const totals = calculateTotals();

// Update overall bill summary
subtotal.textContent =
    `₹${totals.totalSubtotal.toFixed(2)}`;

discount.textContent =
    `₹${totals.totalDiscount.toFixed(2)}`;

gst.textContent =
    `₹${totals.totalGST.toFixed(2)}`;

grandTotalDisplay.textContent =
    `₹${totals.grandTotal.toFixed(2)}`;

    // Display the updated bill
    displayBill();

});


// Display current bill
function displayBill() {

    // Get current bill container
    const billItems = document.getElementById("billItems");

    // Clear previous bill display
    billItems.innerHTML = "";


    // Overall bill totals
    let totalSubtotal = 0;
    let totalDiscount = 0;
    let totalGST = 0;
    let grandTotal = 0;


    // Display every item in the bill
    bill.forEach(item => {

        // Create container for one bill item
        const billItem = document.createElement("div");


        // Create product name
        const productName = document.createElement("strong");
        productName.textContent = item.product.name;
        billItem.appendChild(productName);


        // Create quantity controls
        const quantityControls = document.createElement("div");


        // Create decrease button
        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "−";


        // Create quantity display
        const quantityText = document.createElement("span");
        quantityText.textContent = ` ${item.quantity} `;


        // Create increase button
        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";


        // Add quantity controls to container
        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(quantityText);
        quantityControls.appendChild(increaseButton);

        billItem.appendChild(quantityControls);


        // Create remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        billItem.appendChild(removeButton);


        // Create MRP text
        const mrpText = document.createElement("p");
        mrpText.textContent = `MRP: ₹${item.product.mrp}`;
        billItem.appendChild(mrpText);


        // Create discount percentage text
        const discountText = document.createElement("p");
        discountText.textContent =
            `Discount: ${item.product.discount}%`;

        billItem.appendChild(discountText);


        // Create GST percentage text
        const gstText = document.createElement("p");
        gstText.textContent =
            `GST: ${item.product.gst}%`;

        billItem.appendChild(gstText);


        // Calculate product subtotal
        const productSubtotal =
            item.product.mrp * item.quantity;


        // Create subtotal text
        const subtotalText = document.createElement("p");
        subtotalText.textContent =
            `Subtotal: ₹${productSubtotal}`;

        billItem.appendChild(subtotalText);


        // Calculate discount amount
        const discountAmount =
            (item.product.discount / 100) * productSubtotal;


        // Create discount amount text
        const discountAmountText =
            document.createElement("p");

        discountAmountText.textContent =
            `Discount Amount: ₹${discountAmount}`;

        billItem.appendChild(discountAmountText);


        // Calculate taxable amount
        const taxableAmount =
            productSubtotal - discountAmount;


        // Calculate GST amount
        const gstAmount =
            taxableAmount * (item.product.gst / 100);


        // Create GST amount text
        const gstAmountText =
            document.createElement("p");

        gstAmountText.textContent =
            `GST Amount: ₹${gstAmount.toFixed(2)}`;

        billItem.appendChild(gstAmountText);


        // Calculate final product amount
        const totalAmount =
            taxableAmount + gstAmount;


        // Create total amount text
        const totalAmountText =
            document.createElement("p");

        totalAmountText.textContent =
            `Total Amount: ₹${totalAmount}`;

        billItem.appendChild(totalAmountText);


        // Add item values to overall totals
        totalSubtotal += productSubtotal;
        totalDiscount += discountAmount;
        totalGST += gstAmount;
        grandTotal += totalAmount;


        // Decrease quantity
        decreaseButton.addEventListener("click", function () {

            if (item.quantity > 1) {

                item.quantity--;

                displayBill();

            }

        });


        // Increase quantity
        increaseButton.addEventListener("click", function () {

            item.quantity++;

            displayBill();

        });


        // Remove product
        removeButton.addEventListener("click", function () {

            const index = bill.indexOf(item);

            bill.splice(index, 1);

            displayBill();

        });


        // Add completed bill item to webpage
        billItems.appendChild(billItem);

    });


    // Update overall bill summary
    subtotal.textContent =
        `₹${totalSubtotal.toFixed(2)}`;

    discount.textContent =
        `₹${totalDiscount.toFixed(2)}`;

    gst.textContent =
        `₹${totalGST.toFixed(2)}`;

    grandTotalDisplay.textContent =
        `₹${grandTotal.toFixed(2)}`;

}


// Get products from JSON file
fetch("product.json")

    .then(response => response.json())

    .then(data => {

        // Store JSON data in products
        products = data;


        // Add products to dropdown
        products.forEach(product => {

            // Create dropdown option
            const option =
                document.createElement("option");


            // Set option text
            option.textContent =
                product.name;


            // Set option value
            option.value =
                product.name;


            // Add option to dropdown
            productSelect.appendChild(option);

        });

    });


// Detect product selection
productSelect.addEventListener("change", function () {

    // Find selected product
    const selectedProduct =
        products.find(product => {
            return product.name === productSelect.value;
        });


    // Display selected product in console
    console.log(selectedProduct);

});