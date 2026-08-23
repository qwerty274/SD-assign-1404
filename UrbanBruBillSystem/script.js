let products;
let bill=[]; //stores products added to bill
const subtotal = document.getElementById("subtotal");
const productSelect = document.getElementById("productSelect");
const quantityDisplay = document.getElementById("quantity");

const addToBill=document.getElementById("addToBill");
addToBill.addEventListener("click", function() {
    const selectedProduct = products.find(product => {
        return product.name === productSelect.value;
});

const quantity = Number(quantityDisplay.textContent);

bill.push({
    product : selectedProduct,
    quantity : quantity
});
console.log(bill);
const billItems = document.getElementById("billItems");
billItems.innerHTML="";
bill.forEach(item => {
    const billItem= document.createElement("p");

    billItem.textContent = `${item.product.name} × ${item.quantity}`;
    billItems.appendChild(billItem);
});
});

const increaseQtyButton = document.getElementById("increaseQty");
const decreaseQtyButton = document.getElementById("decreaseQty");

increaseQtyButton.addEventListener("click", function() {
    let quantity = Number(quantityDisplay.textContent);
    quantity++;
    quantityDisplay.textContent = quantity;
});

decreaseQtyButton.addEventListener("click", function() {
    let quantity = Number(quantityDisplay.textContent);
    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
    }
});


fetch("product.json")
    .then(response => response.json())
    .then(data => {

        products = data;

        products.forEach(product => {

            const option = document.createElement("option");

            option.textContent = product.name;
            option.value = product.name;

            productSelect.appendChild(option);
        });
    });

productSelect.addEventListener("change", function() {

    const selectedProduct = products.find(product => {
        return product.name === productSelect.value;
    });

    console.log(selectedProduct);
});