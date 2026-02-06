// js/transkrip.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the transcript page
    initTranscriptPage();
    
    // Setup filter functionality
    setupFilters();
    
    // Setup export functionality
    setupExport();
    
    // Setup table interactions
    setupTableInteractions();
    
    // Setup pagination
    setupPagination();
    
    // Load initial data
    loadTranscriptData();
});

// Data storage
let transcriptData = [];
let filteredData = [];
let currentPage = 1;
let pageSize = 25;
let totalPages = 1;

// Demo data (in real app, this would come from API)
const demoTransactions = [
    {
        id: 'TRX-20230520-001',
        date: '2023-05-20',
        customerName: 'Ucup Surucup',
        customerId: 'PLG-001',
        package: 'Paket Pelajar 10Mbps',
        period: 1,
        totalAmount: 100000,
        paidAmount: 100000,
        status: 'lunas',
        phone: '0876746278823',
        address: 'Jl. Contoh No. 123, Jakarta',
        notes: 'Pembayaran tepat waktu'
    },
    {
        id: 'TRX-20230519-002',
        date: '2023-05-19',
        customerName: 'Budi Santoso',
        customerId: 'PLG-002',
        package: 'Paket Bisnis 50Mbps',
        period: 3,
        totalAmount: 1050000,
        paidAmount: 1050000,
        status: 'lunas',
        phone: '081234567890',
        address: 'Jl. Testing No. 456, Bandung',
        notes: ''
    },
    {
        id: 'TRX-20230518-003',
        date: '2023-05-18',
        customerName: 'Siti Rahayu',
        customerId: 'PLG-003',
        package: 'Paket Keluarga 20Mbps',
        period: 6,
        totalAmount: 1200000,
        paidAmount: 600000,
        status: 'sebagian',
        phone: '082345678901',
        address: 'Jl. Sample No. 789, Surabaya',
        notes: 'Pembayaran sebagian, sisa akan dibayar minggu depan'
    },
    {
        id: 'TRX-20230517-004',
        date: '2023-05-17',
        customerName: 'Ahmad Fauzi',
        customerId: 'PLG-004',
        package: 'Paket Corporate 100Mbps',
        period: 12,
        totalAmount: 7200000,
        paidAmount: 0,
        status: 'pending',
        phone: '083456789012',
        address: 'Jl. Business No. 101, Jakarta',
        notes: 'Menunggu konfirmasi transfer'
    },
    {
        id: 'TRX-20230516-005',
        date: '2023-05-16',
        customerName: 'Company Corp',
        customerId: 'PLG-005',
        package: 'Paket Premium 200Mbps',
        period: 3,
        totalAmount: 3000000,
        paidAmount: 3000000,
        status: 'lunas',
        phone: '0211234567',
        address: 'Jl. Corporate No. 999, Jakarta',
        notes: 'Pembayaran via transfer bank'
    },
    {
        id: 'TRX-20230515-006',
        date: '2023-05-15',
        customerName: 'John Doe',
        customerId: 'PLG-006',
        package: 'Paket Pelajar 10Mbps',
        period: 1,
        totalAmount: 100000,
        paidAmount: 100000,
        status: 'lunas',
        phone: '084567890123',
        address: 'Jl. Student No. 45, Bogor',
        notes: ''
    },
    {
        id: 'TRX-20230514-007',
        date: '2023-05-14',
        customerName: 'Jane Smith',
        customerId: 'PLG-007',
        package: 'Paket Keluarga 20Mbps',
        period: 2,
        totalAmount: 400000,
        paidAmount: 200000,
        status: 'sebagian',
        phone: '085678901234',
        address: 'Jl. Family No. 67, Depok',
        notes: 'Cicilan pertama'
    },
    {
        id: 'TRX-20230513-008',
        date: '2023-05-13',
        customerName: 'Robert Johnson',
        customerId: 'PLG-008',
        package: 'Paket Bisnis 50Mbps',
        period: 6,
        totalAmount: 2100000,
        paidAmount: 2100000,
        status: 'lunas',
        phone: '086789012345',
        address: 'Jl. Office No. 89, Tangerang',
        notes: 'Pembayaran via e-wallet'
    }
];

function initTranscriptPage() {
    // Initialize transcript data
    transcriptData = [...demoTransactions];
    
    // Initialize charts
    initCharts();
    
    // Set default dates
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    document.getElementById('tanggal-mulai').value = formatDate(firstDay);
    document.getElementById('tanggal-selesai').value = formatDate(today);
}

function initCharts() {
    // Daily Chart
    const dailyCtx = document.getElementById('dailyChart').getContext('2d');
    const dailyChart = new Chart(dailyCtx, {
        type: 'bar',
        data: {
            labels: ['14 Mei', '15 Mei', '16 Mei', '17 Mei', '18 Mei', '19 Mei', '20 Mei'],
            datasets: [{
                label: 'Pendapatan Harian (Rp)',
                data: [2100000, 100000, 3000000, 7200000, 1200000, 1050000, 100000],
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgb(52, 152, 219)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Rp ${context.raw.toLocaleString('id-ID')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            if (value >= 1000000) {
                                return 'Rp ' + (value / 1000000).toFixed(1) + ' Jt';
                            }
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                }
            }
        }
    });
    
    // Package Chart
    const packageCtx = document.getElementById('packageChart').getContext('2d');
    const packageChart = new Chart(packageCtx, {
        type: 'doughnut',
        data: {
            labels: ['Pelajar', 'Keluarga', 'Bisnis', 'Corporate', 'Premium'],
            datasets: [{
                data: [2, 2, 2, 1, 1],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(230, 126, 34, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
    
    // Store chart instances
    window.dailyChart = dailyChart;
    window.packageChart = packageChart;
}

function setupFilters() {
    // Quick filter buttons
    const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
    quickFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            quickFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyQuickFilter(this.dataset.period);
        });
    });
    
    // Apply filter button
    document.getElementById('btn-apply-filter').addEventListener('click', function() {
        applyFilters();
    });
    
    // Reset filter button
    document.getElementById('btn-reset-filter').addEventListener('click', function() {
        resetFilters();
    });
}

function setupExport() {
    // Export to Excel
    document.getElementById('btn-export-excel').addEventListener('click', function() {
        exportToExcel();
    });
    
    // Export to PDF
    document.getElementById('btn-export-pdf').addEventListener('click', function() {
        exportToPDF();
    });
    
    // Export to CSV
    document.getElementById('btn-export-csv').addEventListener('click', function() {
        exportToCSV();
    });
    
    // Print report
    document.getElementById('btn-print').addEventListener('click', function() {
        printReport();
    });
    
    // Confirm export
    document.getElementById('btn-confirm-export').addEventListener('click', function() {
        confirmExport();
    });
    
    // Cancel export
    document.getElementById('btn-cancel-export').addEventListener('click', function() {
        closeModal('modal-preview');
    });
}

function setupTableInteractions() {
    // Select all checkbox
    document.getElementById('select-all-checkbox').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
    });
    
    // Select all button
    document.getElementById('btn-select-all').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = true);
        document.getElementById('select-all-checkbox').checked = true;
    });
    
    // Deselect all button
    document.getElementById('btn-deselect-all').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = false);
        document.getElementById('select-all-checkbox').checked = false;
    });
    
    // Page size change
    document.getElementById('page-size-select').addEventListener('change', function() {
        pageSize = this.value === 'all' ? filteredData.length : parseInt(this.value);
        currentPage = 1;
        renderTable();
    });
}

function setupPagination() {
    // First page
    document.getElementById('first-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage = 1;
            renderTable();
        }
    });
    
    // Previous page
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    
    // Next page
    document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    
    // Last page
    document.getElementById('last-page').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage = totalPages;
            renderTable();
        }
    });
}

function loadTranscriptData() {
    // In real app, load data from API
    // For demo, use the sample data
    filteredData = [...transcriptData];
    applyFilters();
}

function applyQuickFilter(period) {
    const today = new Date();
    const startDate = document.getElementById('tanggal-mulai');
    const endDate = document.getElementById('tanggal-selesai');
    
    switch(period) {
        case 'today':
            startDate.value = formatDate(today);
            endDate.value = formatDate(today);
            break;
        case 'week':
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startDate.value = formatDate(startOfWeek);
            endDate.value = formatDate(today);
            break;
        case 'month':
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            startDate.value = formatDate(firstDay);
            endDate.value = formatDate(today);
            break;
        case 'year':
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            startDate.value = formatDate(firstDayOfYear);
            endDate.value = formatDate(today);
            break;
        case 'all':
            // Set to all time (last 5 years)
            const fiveYearsAgo = new Date();
            fiveYearsAgo.setFullYear(today.getFullYear() - 5);
            startDate.value = formatDate(fiveYearsAgo);
            endDate.value = formatDate(today);
            break;
    }
    
    setTimeout(() => applyFilters(), 100);
}

function applyFilters() {
    const startDate = new Date(document.getElementById('tanggal-mulai').value);
    const endDate = new Date(document.getElementById('tanggal-selesai').value);
    const statusFilter = document.getElementById('status-pembayaran').value;
    const packageFilter = document.getElementById('paket-internet').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Filter data
    filteredData = transcriptData.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        
        // Date filter
        if (transactionDate < startDate || transactionDate > endDate) {
            return false;
        }
        
        // Status filter
        if (statusFilter !== 'all' && transaction.status !== statusFilter) {
            return false;
        }
        
        // Package filter
        if (packageFilter !== 'all') {
            const packageName = transaction.package.toLowerCase();
            if (!packageName.includes(packageFilter)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Sort data
    sortData(filteredData, sortBy);
    
    // Update summary
    updateSummary();
    
    // Update charts
    updateCharts();
    
    // Render table
    currentPage = 1;
    renderTable();
}

function resetFilters() {
    document.getElementById('tanggal-mulai').value = '2023-05-01';
    document.getElementById('tanggal-selesai').value = '2023-05-31';
    document.getElementById('status-pembayaran').value = 'all';
    document.getElementById('paket-internet').value = 'all';
    document.getElementById('sort-by').value = 'date_desc';
    
    // Reset quick filter buttons
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.quick-filter-btn[data-period="month"]').classList.add('active');
    
    applyFilters();
}

function sortData(data, sortBy) {
    switch(sortBy) {
        case 'date_desc':
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date_asc':
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'amount_desc':
            data.sort((a, b) => b.totalAmount - a.totalAmount);
            break;
        case 'amount_asc':
            data.sort((a, b) => a.totalAmount - b.totalAmount);
            break;
        case 'name_asc':
            data.sort((a, b) => a.customerName.localeCompare(b.customerName));
            break;
        case 'name_desc':
            data.sort((a, b) => b.customerName.localeCompare(a.customerName));
            break;
    }
}

function updateSummary() {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.paidAmount, 0);
    const totalTransactions = filteredData.length;
    const completedTransactions = filteredData.filter(item => item.status === 'lunas').length;
    const pendingTransactions = filteredData.filter(item => item.status === 'pending').length;
    
    document.getElementById('total-pendapatan').textContent = formatCurrency(totalRevenue);
    document.getElementById('total-transaksi').textContent = totalTransactions.toLocaleString();
    document.getElementById('transaksi-lunas').textContent = completedTransactions.toLocaleString();
    document.getElementById('transaksi-pending').textContent = pendingTransactions.toLocaleString();
}

function updateCharts() {
    // Update daily chart with filtered data
    const dailyData = filteredData.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += transaction.paidAmount;
        return acc;
    }, {});
    
    const dates = Object.keys(dailyData).sort();
    const amounts = dates.map(date => dailyData[date]);
    
    window.dailyChart.data.labels = dates.map(date => formatDateDisplay(date));
    window.dailyChart.data.datasets[0].data = amounts;
    window.dailyChart.update();
    
    // Update package chart
    const packageCounts = filteredData.reduce((acc, transaction) => {
        const packageName = transaction.package.split(' ')[1]; // Get package type
        acc[packageName] = (acc[packageName] || 0) + 1;
        return acc;
    }, {});
    
    const packageLabels = Object.keys(packageCounts);
    const packageData = Object.values(packageCounts);
    
    window.packageChart.data.labels = packageLabels;
    window.packageChart.data.datasets[0].data = packageData;
    window.packageChart.update();
}

function renderTable() {
    const tbody = document.getElementById('transcript-data');
    tbody.innerHTML = '';
    
    // Calculate pagination
    totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredData.length / pageSize);
    
    const startIndex = pageSize === 'all' ? 0 : (currentPage - 1) * pageSize;
    const endIndex = pageSize === 'all' ? filteredData.length : startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Render rows
    pageData.forEach((transaction, index) => {
        const row = document.createElement('tr');
        const rowNumber = startIndex + index + 1;
        
        row.innerHTML = `
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${transaction.id}">
            </td>
            <td>${rowNumber}</td>
            <td>${transaction.id}</td>
            <td>${formatDateDisplay(transaction.date)}</td>
            <td>${transaction.customerName}</td>
            <td>${transaction.customerId}</td>
            <td>${transaction.package}</td>
            <td>${transaction.period} Bulan</td>
            <td class="text-right">${formatCurrency(transaction.totalAmount)}</td>
            <td class="text-right">${formatCurrency(transaction.paidAmount)}</td>
            <td>
                <span class="status-badge status-${transaction.status}">
                    ${getStatusText(transaction.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-detail" onclick="showDetail('${transaction.id}')" title="Lihat Detail">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" onclick="editTransaction('${transaction.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteTransaction('${transaction.id}')" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Update pagination info
    updatePaginationInfo();
    
    // Update page numbers
    renderPageNumbers();
}

function updatePaginationInfo() {
    const startIndex = pageSize === 'all' ? 1 : (currentPage - 1) * pageSize + 1;
    const endIndex = pageSize === 'all' ? filteredData.length : Math.min(currentPage * pageSize, filteredData.length);
    
    document.getElementById('page-start').textContent = startIndex.toLocaleString();
    document.getElementById('page-end').textContent = endIndex.toLocaleString();
    document.getElementById('total-items').textContent = filteredData.length.toLocaleString();
    document.getElementById('data-count').textContent = `${filteredData.length} transaksi ditemukan`;
    
    // Update button states
    document.getElementById('first-page').disabled = currentPage === 1;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
    document.getElementById('last-page').disabled = currentPage === totalPages;
}

function renderPageNumbers() {
    const container = document.getElementById('page-numbers');
    container.innerHTML = '';
    
    // Always show first page
    addPageNumber(1);
    
    // Show ellipsis if needed
    if (currentPage > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        container.appendChild(ellipsis);
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
            addPageNumber(i);
        }
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        container.appendChild(ellipsis);
    }
    
    // Always show last page if there is more than 1 page
    if (totalPages > 1) {
        addPageNumber(totalPages);
    }
}

function addPageNumber(pageNumber) {
    const container = document.getElementById('page-numbers');
    const button = document.createElement('button');
    button.className = `page-number ${pageNumber === currentPage ? 'active' : ''}`;
    button.textContent = pageNumber;
    button.addEventListener('click', () => {
        currentPage = pageNumber;
        renderTable();
    });
    container.appendChild(button);
}

function exportToExcel() {
    // Get selected rows or all rows
    const selectedRows = getSelectedRows();
    const dataToExport = selectedRows.length > 0 ? selectedRows : filteredData;
    
    if (dataToExport.length === 0) {
        alert('Tidak ada data untuk diekspor.');
        return;
    }
    
    // Prepare data for Excel
    const excelData = prepareExcelData(dataToExport);
    
    // Show preview
    showExcelPreview(excelData);
}

function prepareExcelData(transactions) {
    const includeSummary = document.getElementById('export-summary').checked;
    
    // Prepare header
    const headers = [
        'No',
        'ID Transaksi',
        'Tanggal',
        'Nama Pelanggan',
        'ID Pelanggan',
        'Paket Internet',
        'Periode (Bulan)',
        'Total Tagihan (Rp)',
        'Dibayar (Rp)',
        'Sisa (Rp)',
        'Status',
        'Catatan'
    ];
    
    // Prepare rows
    const rows = transactions.map((transaction, index) => [
        index + 1,
        transaction.id,
        formatDateDisplay(transaction.date),
        transaction.customerName,
        transaction.customerId,
        transaction.package,
        transaction.period,
        transaction.totalAmount,
        transaction.paidAmount,
        transaction.totalAmount - transaction.paidAmount,
        getStatusText(transaction.status),
        transaction.notes || ''
    ]);
    
    // Add summary if requested
    let summaryRows = [];
    if (includeSummary) {
        const totalRevenue = transactions.reduce((sum, item) => sum + item.paidAmount, 0);
        const totalTransactions = transactions.length;
        const totalLunas = transactions.filter(item => item.status === 'lunas').length;
        const totalPending = transactions.filter(item => item.status === 'pending').length;
        
        summaryRows = [
            [],
            ['RINGKASAN TRANSAKSI'],
            ['Total Transaksi:', totalTransactions],
            ['Transaksi Lunas:', totalLunas],
            ['Transaksi Pending:', totalPending],
            ['Total Pendapatan:', formatCurrency(totalRevenue)],
            ['Tanggal Ekspor:', new Date().toLocaleDateString('id-ID')],
            ['Ekspor oleh:', 'Administrator ISP']
        ];
    }
    
    return {
        headers,
        rows,
        summaryRows
    };
}

function showExcelPreview(data) {
    const preview = document.getElementById('excel-preview');
    let html = '<table class="preview-table">';
    
    // Add headers
    html += '<thead><tr>';
    data.headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead>';
    
    // Add rows
    html += '<tbody>';
    data.rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody>';
    
    // Add summary if exists
    if (data.summaryRows.length > 0) {
        html += '<tfoot>';
        data.summaryRows.forEach(row => {
            html += '<tr>';
            row.forEach((cell, index) => {
                if (index === 0 && row.length === 1) {
                    html += `<td colspan="${data.headers.length}" style="font-weight: bold; text-align: center; background-color: #f0f0f0;">${cell}</td>`;
                } else {
                    html += `<td${index === 0 ? ' colspan="2" style="font-weight: bold;"' : ''}>${cell}</td>`;
                }
            });
            html += '</tr>';
        });
        html += '</tfoot>';
    }
    
    html += '</table>';
    preview.innerHTML = html;
    
    // Store data for export
    window.previewData = data;
    
    // Show modal
    openModal('modal-preview');
}

function confirmExport() {
    const data = window.previewData;
    const format = document.getElementById('export-format').value;
    const fileName = `transkrip_pembayaran_${formatDate(new Date())}.${format}`;
    
    // Prepare worksheet
    const wsData = [
        data.headers,
        ...data.rows,
        ...data.summaryRows
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add styling (column widths)
    const wscols = [
        {wch: 5},   // No
        {wch: 15},  // ID Transaksi
        {wch: 12},  // Tanggal
        {wch: 25},  // Nama Pelanggan
        {wch: 12},  // ID Pelanggan
        {wch: 25},  // Paket Internet
        {wch: 12},  // Periode
        {wch: 15},  // Total Tagihan
        {wch: 15},  // Dibayar
        {wch: 15},  // Sisa
        {wch: 10},  // Status
        {wch: 30}   // Catatan
    ];
    ws['!cols'] = wscols;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transkrip Pembayaran');
    
    // Export file
    XLSX.writeFile(wb, fileName);
    
    // Close modal
    closeModal('modal-preview');
    
    // Show success message
    alert(`File ${fileName} berhasil diunduh!`);
}

function exportToPDF() {
    alert('Fitur export PDF akan membuka dialog untuk membuat file PDF.');
    // In real app, implement PDF generation using jsPDF or similar library
}

function exportToCSV() {
    const data = prepareExcelData(filteredData);
    const csvContent = [
        data.headers.join(','),
        ...data.rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `transkrip_pembayaran_${formatDate(new Date())}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('File CSV berhasil diunduh!');
}

function printReport() {
    window.print();
}

function getSelectedRows() {
    const selectedIds = [];
    document.querySelectorAll('.row-checkbox:checked').forEach(checkbox => {
        selectedIds.push(checkbox.dataset.id);
    });
    
    return filteredData.filter(transaction => selectedIds.includes(transaction.id));
}

function showDetail(transactionId) {
    const transaction = transcriptData.find(t => t.id === transactionId);
    if (!transaction) return;
    
    const modalContent = document.getElementById('modal-detail-content');
    modalContent.innerHTML = `
        <div class="detail-container">
            <div class="detail-header">
                <h4>Detail Transaksi ${transaction.id}</h4>
                <span class="detail-status status-${transaction.status}">
                    ${getStatusText(transaction.status)}
                </span>
            </div>
            
            <div class="detail-grid">
                <div class="detail-section">
                    <h5><i class="fas fa-user"></i> Informasi Pelanggan</h5>
                    <div class="detail-row">
                        <span class="detail-label">Nama:</span>
                        <span class="detail-value">${transaction.customerName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">ID Pelanggan:</span>
                        <span class="detail-value">${transaction.customerId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">No. HP:</span>
                        <span class="detail-value">${transaction.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Alamat:</span>
                        <span class="detail-value">${transaction.address}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h5><i class="fas fa-wifi"></i> Informasi Paket</h5>
                    <div class="detail-row">
                        <span class="detail-label">Paket:</span>
                        <span class="detail-value">${transaction.package}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Periode:</span>
                        <span class="detail-value">${transaction.period} Bulan</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Transaksi:</span>
                        <span class="detail-value">${formatDateDisplay(transaction.date)}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h5><i class="fas fa-money-bill-wave"></i> Informasi Pembayaran</h5>
                    <div class="detail-row">
                        <span class="detail-label">Total Tagihan:</span>
                        <span class="detail-value">${formatCurrency(transaction.totalAmount)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Dibayar:</span>
                        <span class="detail-value">${formatCurrency(transaction.paidAmount)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Sisa:</span>
                        <span class="detail-value">${formatCurrency(transaction.totalAmount - transaction.paidAmount)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Catatan:</span>
                        <span class="detail-value">${transaction.notes || '-'}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="printReceipt('${transaction.id}')">
                    <i class="fas fa-print"></i> Cetak Kwitansi
                </button>
                <button class="btn btn-secondary" onclick="editTransaction('${transaction.id}')">
                    <i class="fas fa-edit"></i> Edit Transaksi
                </button>
            </div>
        </div>
    `;
    
    // Add CSS for detail modal
    const style = document.createElement('style');
    style.textContent = `
        .detail-container { padding: 20px; }
        .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .detail-header h4 { margin: 0; color: var(--primary); }
        .detail-status { padding: 8px 15px; border-radius: 20px; font-weight: 600; }
        .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 30px; }
        .detail-section { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .detail-section h5 { margin-bottom: 20px; color: var(--primary); display: flex; align-items: center; gap: 10px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .detail-row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .detail-label { font-weight: 600; color: var(--dark); }
        .detail-value { text-align: right; color: var(--gray); }
        .detail-actions { display: flex; gap: 15px; justify-content: flex-end; }
    `;
    modalContent.appendChild(style);
    
    openModal('modal-detail');
}

function editTransaction(transactionId) {
    alert(`Fitur edit transaksi ${transactionId} akan membuka form edit.`);
    // In real app, this would open an edit form
}

function deleteTransaction(transactionId) {
    if (confirm(`Apakah Anda yakin ingin menghapus transaksi ${transactionId}?`)) {
        // In real app, send delete request to API
        transcriptData = transcriptData.filter(t => t.id !== transactionId);
        applyFilters();
        alert('Transaksi berhasil dihapus!');
    }
}

function printReceipt(transactionId) {
    alert(`Mencetak kwitansi untuk transaksi ${transactionId}`);
    // In real app, this would open a print dialog with receipt template
}

function getStatusText(status) {
    switch(status) {
        case 'lunas': return 'Lunas';
        case 'sebagian': return 'Sebagian';
        case 'pending': return 'Pending';
        default: return status;
    }
}

function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDateDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.classList.remove('active');
        }
    });
}

// Initialize
initTranscriptPage();