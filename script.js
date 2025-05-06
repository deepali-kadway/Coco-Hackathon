document.addEventListener('DOMContentLoaded', () => {
    const donationForm = document.getElementById('donationForm');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');

    // Handle amount button clicks
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Clear custom amount input
            customAmountInput.value = '';
        });
    });

    // Handle custom amount input
    customAmountInput.addEventListener('input', () => {
        amountButtons.forEach(btn => btn.classList.remove('active'));
    });

    // Format card number input
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    // Format expiry date input
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // Format CVV input
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });

    // Form submission
    donationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get selected amount
        let amount = customAmountInput.value;
        const activeButton = document.querySelector('.amount-btn.active');
        if (activeButton) {
            amount = activeButton.dataset.amount;
        }

        if (!amount) {
            alert('Please select or enter a donation amount');
            return;
        }

        // Basic validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        const expiry = expiryInput.value;
        const cvv = cvvInput.value;

        if (!name || !email || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate card number (Luhn algorithm)
        if (!validateCardNumber(cardNumber)) {
            alert('Please enter a valid card number');
            return;
        }

        // Validate expiry date
        if (!validateExpiryDate(expiry)) {
            alert('Please enter a valid expiry date');
            return;
        }

        // Validate CVV
        if (cvv.length < 3) {
            alert('Please enter a valid CVV');
            return;
        }

        // Simulate payment processing
        try {
            const submitButton = document.querySelector('.donate-btn');
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            alert('Thank you for your donation! Your contribution will help protect our Blue Carbon ecosystems.');
            donationForm.reset();
            amountButtons.forEach(btn => btn.classList.remove('active'));
        } catch (error) {
            alert('There was an error processing your donation. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Donate Now';
        }
    });
});

// Luhn algorithm for card number validation
function validateCardNumber(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    // Loop through values starting from the rightmost digit
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// Validate expiry date
function validateExpiryDate(expiry) {
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
} 