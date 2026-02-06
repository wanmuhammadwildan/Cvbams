// js/pembayaran.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the payment page
    initPaymentPage();
    
    // Setup tab navigation
    setupTabs();
    
    // Setup form interactions
    setupFormInteractions();
    
    // Setup payment method toggles
    setupPaymentMethods();
    
    // Setup quick amount buttons
    setupQuickAmounts();
    
    // Setup customer search
    setupCustomerSearch();
});

function initPaymentPage() {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal-pemasangan').value = today;
    
    // Initialize payment method details
    updatePaymentMethodDetails();
    
    // Calculate initial summary
    calculatePaymentSummary();
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function setupFormInteractions() {
    // Package selection
    const packageSelect = document.getElementById('paket-internet');
    packageSelect.addEventListener('change', function() {
        updatePackagePrice(this.value);
        calculatePaymentSummary();
    });
    
    // Period selection
    const periodCheckboxes = document.querySelectorAll('input[name="period"]');
    periodCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePeriodSelection(this);
            calculatePaymentSummary();
        });
    });
    
    // Custom period input
    const customPeriodInput = document.getElementById('custom-period');
    customPeriodInput.addEventListener('input', function() {
        // Uncheck all period checkboxes
        periodCheckboxes.forEach(cb => cb.checked = false);
        calculatePaymentSummary();
    });
    
    // Payment amount input
    const paymentAmountInput = document.getElementById('jumlah-dibayar');
    paymentAmountInput.addEventListener('input', function() {
        calculateChange();
    });
    
    // Form submission
    const paymentForm = document.getElementById('form-pembayaran');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });
    
    // Reset button
    document.getElementById('btn-reset').addEventListener('click', function() {
        resetForm();
    });
}

function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            updatePaymentMethodDetails();
        });
    });
}

function setupQuickAmounts() {
    const quickAmountButtons = document.querySelectorAll('.btn-quick-amount');
    
    quickAmountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            
            if (this.id === 'btn-bayar-lunas') {
                // Pay full amount
                const totalAmount = parseFloat(document.getElementById('summary-total').textContent
                    .replace('Rp', '')
                    .replace('.', '')
                    .replace(',', '')
                    .trim());
                document.getElementById('jumlah-dibayar').value = formatCurrency(totalAmount);
            } else {
                // Quick amount
                document.getElementById('jumlah-dibayar').value = formatCurrency(parseInt(amount));
            }
            
            calculateChange();
        });
    });
}

function setupCustomerSearch() {
    document.getElementById('btn-cari-pelanggan').addEventListener('click', function() {
        openCustomerSearchModal();
    });
    
    // Demo customer data (in real app, this would come from an API)
    const demoCustomers = [
        {
            id: 'PLG-001',
            name: 'Ucup Surucup',
            phone: '0876746278823',
            address: 'Jl. Contoh No. 123, Jakarta',
            package: 'pelajar',
            overdue: 0
        },
        {
            id: 'PLG-002',
            name: 'Budi Santoso',
            phone: '081234567890',
            address: 'Jl. Testing No. 456, Bandung',
            package: 'bisnis',
            overdue: 150000
        },
        {
            id: 'PLG-003',
            name: 'Siti Rahayu',
            phone: '082345678901',
            address: 'Jl. Sample No. 789, Surabaya',
            package: 'keluarga',
            overdue: 0
        }
    ];
    
    // Auto-fill for demo
    document.getElementById('id-pelanggan').addEventListener('blur', function() {
        const customerId = this.value;
        if (customerId === 'PLG-001') {
            fillCustomerData(demoCustomers[0]);
        }
    });
}

// Package price mapping
const packagePrices = {
    'pelajar': 100000,
    'keluarga': 200000,
    'bisnis': 350000,
    'corporate': 600000,
    'premium': 1000000
};

function updatePackagePrice(packageType) {
    const price = packagePrices[packageType] || 0;
    document.getElementById('harga-paket').value = formatCurrency(price);
}

function updatePeriodSelection(checkedCheckbox) {
    const periodCheckboxes = document.querySelectorAll('input[name="period"]');
    
    if (checkedCheckbox.checked) {
        // Uncheck other checkboxes
        periodCheckboxes.forEach(cb => {
            if (cb !== checkedCheckbox) {
                cb.checked = false;
            }
        });
        
        // Clear custom period
        document.getElementById('custom-period').value = '';
    }
}

function updatePaymentMethodDetails() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Hide all details
    document.querySelectorAll('.payment-details').forEach(detail => {
        detail.classList.remove('active');
    });
    
    // Show selected method details
    if (selectedMethod === 'transfer') {
        document.getElementById('transfer-details').classList.add('active');
    } else if (selectedMethod === 'ewallet') {
        document.getElementById('ewallet-details').classList.add('active');
    } else if (selectedMethod === 'voucher') {
        document.getElementById('voucher-details').classList.add('active');
    }
}

function calculatePaymentSummary() {
    // Get package price
    const packagePrice = parseFloat(document.getElementById('harga-paket').value
        .replace('Rp', '')
        .replace('.', '')
        .replace(',', '')
        .trim()) || 0;
    
    // Get period
    let period = 0;
    const checkedPeriod = document.querySelector('input[name="period"]:checked');
    if (checkedPeriod) {
        period = parseInt(checkedPeriod.value);
    } else {
        const customPeriod = parseInt(document.getElementById('custom-period').value) || 0;
        period = customPeriod;
    }
    
    // Get overdue
    const overdue = parseFloat(document.getElementById('tunggakan').value
        .replace('Rp', '')
        .replace('.', '')
        .replace(',', '')
        .trim()) || 0;
    
    // Calculate
    const subtotal = packagePrice * period;
    const total = subtotal + overdue;
    
    // Update summary display
    document.getElementById('summary-harga').textContent = formatCurrency(packagePrice);
    document.getElementById('summary-periode').textContent = `${period} Bulan`;
    document.getElementById('summary-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summary-tunggakan').textContent = formatCurrency(overdue);
    document.getElementById('summary-total').textContent = formatCurrency(total);
}

function calculateChange() {
    const totalAmount = parseFloat(document.getElementById('summary-total').textContent
        .replace('Rp', '')
        .replace('.', '')
        .replace(',', '')
        .trim());
    
    const paidAmount = parseFloat(document.getElementById('jumlah-dibayar').value
        .replace('Rp', '')
        .replace('.', '')
        .replace(',', '')
        .trim()) || 0;
    
    const change = paidAmount - totalAmount;
    document.getElementById('kembalian').value = formatCurrency(Math.max(0, change));
}

function fillCustomerData(customer) {
    document.getElementById('nama-pelanggan').value = customer.name;
    document.getElementById('no-hp').value = customer.phone;
    document.getElementById('alamat-pelanggan').value = customer.address;
    document.getElementById('tunggakan').value = formatCurrency(customer.overdue);
    
    // Select the customer's package if available
    if (customer.package) {
        document.getElementById('paket-internet').value = customer.package;
        updatePackagePrice(customer.package);
    }
    
    calculatePaymentSummary();
}

function processPayment() {
    // Get form data
    const formData = {
        customerId: document.getElementById('id-pelanggan').value,
        customerName: document.getElementById('nama-pelanggan').value,
        package: document.getElementById('paket-internet').value,
        period: getSelectedPeriod(),
        totalAmount: parseFloat(document.getElementById('summary-total').textContent
            .replace('Rp', '')
            .replace('.', '')
            .replace(',', '')
            .trim()),
        paidAmount: parseFloat(document.getElementById('jumlah-dibayar').value
            .replace('Rp', '')
            .replace('.', '')
            .replace(',', '')
            .trim()) || 0,
        paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
        notes: document.getElementById('catatan').value
    };
    
    // Validate form
    if (!validatePaymentForm(formData)) {
        return;
    }
    
    // In a real app, you would send this data to the server
    console.log('Processing payment:', formData);
    
    // Show success message
    alert(`Pembayaran berhasil!\nID Transaksi: TRX-${Date.now()}\nTotal: ${formatCurrency(formData.totalAmount)}`);
    
    // Reset form
    resetForm();
    
    // Switch to history tab
    document.querySelector('[data-tab="riwayat-pembayaran"]').click();
}

function validatePaymentForm(formData) {
    if (!formData.customerId) {
        alert('Harap masukkan ID Pelanggan');
        document.getElementById('id-pelanggan').focus();
        return false;
    }
    
    if (!formData.package) {
        alert('Harap pilih paket internet');
        document.getElementById('paket-internet').focus();
        return false;
    }
    
    if (formData.period <= 0) {
        alert('Harap pilih periode pembayaran');
        return false;
    }
    
    if (formData.paidAmount <= 0) {
        alert('Harap masukkan jumlah pembayaran');
        document.getElementById('jumlah-dibayar').focus();
        return false;
    }
    
    if (formData.paidAmount < formData.totalAmount) {
        if (!confirm(`Jumlah pembayaran (${formatCurrency(formData.paidAmount)}) kurang dari total (${formatCurrency(formData.totalAmount)}).\nLanjutkan sebagai pembayaran sebagian?`)) {
            return false;
        }
    }
    
    return true;
}

function getSelectedPeriod() {
    const checkedPeriod = document.querySelector('input[name="period"]:checked');
    if (checkedPeriod) {
        return parseInt(checkedPeriod.value);
    }
    
    const customPeriod = parseInt(document.getElementById('custom-period').value) || 0;
    return customPeriod;
}

function resetForm() {
    document.getElementById('form-pembayaran').reset();
    document.getElementById('harga-paket').value = '';
    document.getElementById('tunggakan').value = '0';
    document.getElementById('jumlah-dibayar').value = '';
    document.getElementById('kembalian').value = '0';
    document.getElementById('custom-period').value = '';
    
    // Reset customer info
    document.getElementById('nama-pelanggan').value = '';
    document.getElementById('no-hp').value = '';
    document.getElementById('alamat-pelanggan').value = '';
    
    // Reset summary
    document.getElementById('summary-harga').textContent = 'Rp 0';
    document.getElementById('summary-periode').textContent = '0 Bulan';
    document.getElementById('summary-subtotal').textContent = 'Rp 0';
    document.getElementById('summary-tunggakan').textContent = 'Rp 0';
    document.getElementById('summary-total').textContent = 'Rp 0';
    
    // Set default payment method
    document.getElementById('method-cash').checked = true;
    updatePaymentMethodDetails();
}

function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function openCustomerSearchModal() {
    alert('Fitur pencarian pelanggan akan membuka modal dengan daftar pelanggan.\n\nUntuk demo, coba masukkan ID: PLG-001');
}
// Tambahkan di dalam fungsi submit form pembayaran kamu
if (response.success) {
    alert("Pembayaran Berhasil!");
    // FUNGSI: Pindah otomatis ke tab riwayat agar admin bisa langsung lihat datanya
    document.querySelector('[data-tab="riwayat-pembayaran"]').click();
    location.reload(); // Refresh untuk update tabel
}

// Initialize when page loads
initPaymentPage();

document.addEventListener('DOMContentLoaded', function() {
    // 1. Logika Perpindahan Tab
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // 2. Logika Cari Pelanggan
    document.getElementById('btn-fetch-customer').addEventListener('click', function() {
        const idString = document.getElementById('input-id-search').value;
        if(!idString) return alert('Masukkan ID Pelanggan!');

        fetch(`/pembayaran/get-customer/${idString}`)
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                } else {
                    document.getElementById('display-name').value = data.name;
                    document.getElementById('display-package').value = data.package;
                    document.getElementById('display-price').value = data.price;
                    // PENTING: Isi ID Database ke hidden input agar tidak null saat konfirmasi
                    document.getElementById('customer-db-id').value = data.db_id;
                }
            });
    });
});