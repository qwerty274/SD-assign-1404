const nameInput=document.getElementById('nameInput');
const donationInput=document.getElementById('donationInput');
const generateButton=document.getElementById('generateButton');
const certificateName = document.getElementById("certificateName");
const certificateDonation = document.getElementById("certificateDonation");
const dateInput = document.getElementById("dateInput");
const certificateDate = document.getElementById("certificateDate");
const certificate = document.getElementById("certificate");

generateButton.addEventListener('click', function() {
    const name = nameInput.value;
    const donation = donationInput.value;
    const currentDate = new Date().toLocaleString();

    certificateName.textContent = name;
    certificateDonation.textContent = donation;
    certificateDate.textContent = currentDate;
    
    dateInput.value = currentDate;

    certificate.style.display = "block";

});