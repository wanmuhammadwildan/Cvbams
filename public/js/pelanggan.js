// js/pelanggan.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the pelanggan page
    initPelangganPage();

    // Setup tab navigation
    setupTabs();

    // Setup form interactions
    setupFormInteractions();

    // Setup table interactions
    // setupTableInteractions();

    // Setup filter and search
    // setupFilterAndSearch();

    // Setup pagination
    // setupPagination();

    // Load initial data
    // loadPelangganData();
});

// Data storage
let pelangganData = [];
let filteredData = [];
let currentPage = 1;
let pageSize = 25;
let totalPages = 1;
let pelangganToDelete = null;

// Demo data (in real app, this would come from API)
const demoPelanggan = [
    {
        id: 'PLG-001',
        nama: 'Ucup Surucup',
        noHp: '0876746278823',
        email: 'ucup@example.com',
        alamat: 'Jl. Contoh No. 123, Jakarta Selatan',
        paket: 'Paket Pelajar - 10 Mbps',
        paketType: 'pelajar',
        tanggalPemasangan: '2023-05-20',
        tanggalExpire: '2023-06-20',
        status: 'aktif',
        catatan: 'Pelanggan baru'
    },
    {
        id: 'PLG-002',
        nama: 'Budi Santoso',
        noHp: '081234567890',
        email: 'budi@example.com',
        alamat: 'Jl. Testing No. 456, Bandung',
        paket: 'Paket Bisnis - 50 Mbps',
        paketType: 'bisnis',
        tanggalPemasangan: '2023-05-19',
        tanggalExpire: '2023-08-19',
        status: 'aktif',
        catatan: 'Pembayaran 3 bulan'
    },
    {
        id: 'PLG-003',
        nama: 'Siti Rahayu',
        noHp: '082345678901',
        email: 'siti@example.com',
        alamat: 'Jl. Sample No. 789, Surabaya',
        paket: 'Paket Keluarga - 20 Mbps',
        paketType: 'keluarga',
        tanggalPemasangan: '2023-05-18',
        tanggalExpire: '2023-11-18',
        status: 'aktif',
        catatan: 'Pembayaran 6 bulan'
    },
    {
        id: 'PLG-004',
        nama: 'Ahmad Fauzi',
        noHp: '083456789012',
        email: 'ahmad@example.com',
        alamat: 'Jl. Business No. 101, Jakarta',
        paket: 'Paket Corporate - 100 Mbps',
        paketType: 'corporate',
        tanggalPemasangan: '2023-05-17',
        tanggalExpire: '2023-06-17',
        status: 'nonaktif',
        catatan: 'Belum memperpanjang'
    },
    {
        id: 'PLG-005',
        nama: 'Company Corp',
        noHp: '0211234567',
        email: 'company@example.com',
        alamat: 'Jl. Corporate No. 999, Jakarta',
        paket: 'Paket Premium - 200 Mbps',
        paketType: 'premium',
        tanggalPemasangan: '2023-05-16',
        tanggalExpire: '2023-08-16',
        status: 'aktif',
        catatan: 'Corporate account'
    },
    {
        id: 'PLG-006',
        nama: 'John Doe',
        noHp: '08111222333',
        email: 'john@example.com',
        alamat: 'Jl. Merdeka No. 45, Jakarta',
        paket: 'Paket Pelajar - 10 Mbps',
        paketType: 'pelajar',
        tanggalPemasangan: '2023-05-15',
        tanggalExpire: '2023-06-15',
        status: 'aktif',
        catatan: ''
    },
    {
        id: 'PLG-007',
        nama: 'Jane Smith',
        noHp: '08222333444',
        email: 'jane@example.com',
        alamat: 'Jl. Sudirman No. 67, Jakarta',
        paket: 'Paket Keluarga - 20 Mbps',
        paketType: 'keluarga',
        tanggalPemasangan: '2023-05-14',
        tanggalExpire: '2023-06-14',
        status: 'nonaktif',
        catatan: 'Pindah alamat'
    },
    {
        id: 'PLG-008',
        nama: 'Robert Johnson',
        noHp: '08333444555',
        email: 'robert@example.com',
        alamat: 'Jl. Thamrin No. 89, Jakarta',
        paket: 'Paket Bisnis - 50 Mbps',
        paketType: 'bisnis',
        tanggalPemasangan: '2023-05-13',
        tanggalExpire: '2023-08-13',
        status: 'aktif',
        catatan: 'Pembayaran via transfer'
    }
];

function initPelangganPage() {
    // Set default dates
    const today = new Date();
    document.getElementById('tanggal-pemasangan').value = formatDate(today);
    
    // Set expire date (30 days from today)
    const expireDate = new Date(today);
    expireDate.setDate(today.getDate() + 30);
    document.getElementById('tanggal-expire').value = formatDate(expireDate);
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
    
    // Switch to tambah pelanggan from list
    document.getElementById('btn-tambah-dari-list').addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        document.querySelector('[data-tab="tambah-pelanggan"]').classList.add('active');
        document.getElementById('tambah-pelanggan').classList.add('active');
        
        // Focus on ID field
        document.getElementById('id-pelanggan').focus();
    });
    
    // Export button
    document.getElementById('btn-export-pelanggan').addEventListener('click', function() {
        exportPelangganData();
    });
}

function setupFormInteractions() {
    // Package selection - auto calculate expire date
    const packageSelect = document.getElementById('paket-internet');
    packageSelect.addEventListener('change', function() {
        updateExpireDate(this.value);
    });
    
    // Installation date change - update expire date
    const installDate = document.getElementById('tanggal-pemasangan');
    installDate.addEventListener('change', function() {
        updateExpireDate(packageSelect.value);
    });
    
    // Form submission
    const tambahForm = document.getElementById('form-tambah-pelanggan');
    tambahForm.addEventListener('submit', function(e) {
        e.preventDefault();
        tambahPelanggan();
    });
    
    // Reset form
    document.getElementById('btn-reset-form').addEventListener('click', function() {
        resetForm();
    });
    
    // Edit form submission
    const editForm = document.getElementById('form-edit-pelanggan');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updatePelanggan();
    });
    
    // Cancel edit
    document.getElementById('btn-cancel-edit').addEventListener('click', function() {
        closeModal('modal-edit-pelanggan');
    });
    
    // Edit from detail
    document.getElementById('btn-edit-from-detail').addEventListener('click', function() {
        const pelangganId = document.getElementById('detail-pelanggan-content').dataset.id;
        closeModal('modal-detail-pelanggan');
        openEditModal(pelangganId);
    });
    
    // Confirm delete
    document.getElementById('btn-confirm-hapus').addEventListener('click', function() {
        if (pelangganToDelete) {
            deletePelanggan(pelangganToDelete);
            pelangganToDelete = null;
        }
    });
}

function setupTableInteractions() {
    // Page size change
    document.getElementById('page-size-select').addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        renderTable();
    });
}

function setupFilterAndSearch() {
    // Search input
    document.getElementById('search-pelanggan').addEventListener('input', function() {
        applyFilters();
    });
    
    // Status filter
    document.getElementById('filter-status').addEventListener('change', function() {
        applyFilters();
    });
    
    // Package filter
    document.getElementById('filter-paket').addEventListener('change', function() {
        applyFilters();
    });
    
    // Sort by
    document.getElementById('sort-by').addEventListener('change', function() {
        applyFilters();
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

function loadPelangganData() {
    // In real app, load data from API
    // For demo, use the sample data
    pelangganData = [...demoPelanggan];
    applyFilters();
}

function updateExpireDate(packageType) {
    const installDate = new Date(document.getElementById('tanggal-pemasangan').value);
    if (!installDate || isNaN(installDate.getTime())) return;
    
    const expireDate = new Date(installDate);
    
    // Set expire date based on package (default 30 days)
    switch(packageType) {
        case 'pelajar':
        case 'keluarga':
        case 'bisnis':
        case 'corporate':
        case 'premium':
            expireDate.setDate(installDate.getDate() + 30);
            break;
        default:
            expireDate.setDate(installDate.getDate() + 30);
    }
    
    document.getElementById('tanggal-expire').value = formatDate(expireDate);
}

function tambahPelanggan() {
    // Get form data
    const formData = {
        id: document.getElementById('id-pelanggan').value.trim().toUpperCase(),
        nama: document.getElementById('nama-pelanggan').value.trim(),
        noHp: document.getElementById('no-hp').value.trim(),
        email: document.getElementById('email').value.trim(),
        alamat: document.getElementById('alamat').value.trim(),
        paket: document.getElementById('paket-internet').selectedOptions[0].text,
        paketType: document.getElementById('paket-internet').value,
        tanggalPemasangan: document.getElementById('tanggal-pemasangan').value,
        tanggalExpire: document.getElementById('tanggal-expire').value,
        status: document.querySelector('input[name="status"]:checked').value,
        catatan: document.getElementById('catatan').value.trim(),
        tanggalDaftar: new Date().toISOString().split('T')[0]
    };
    
    // Validate form
    if (!validatePelangganForm(formData)) {
        return;
    }
    
    // Check if ID already exists
    if (pelangganData.find(p => p.id === formData.id)) {
        alert('ID Pelanggan sudah terdaftar! Gunakan ID yang lain.');
        document.getElementById('id-pelanggan').focus();
        return;
    }
    
    // Add to data array
    pelangganData.unshift(formData);
    
    // Show success message
    showSuccessMessage(formData);
    
    // Reset form
    resetForm();
    
    // Switch to list tab and refresh
    document.querySelector('[data-tab="kelola-pelanggan"]').click();
    applyFilters();
}

function validatePelangganForm(formData) {
    if (!formData.id) {
        alert('Harap masukkan ID Pelanggan');
        document.getElementById('id-pelanggan').focus();
        return false;
    }
    
    // Validate ID format (PLG-XXX)
    const idRegex = /^PLG-\d{3,}$/;
    if (!idRegex.test(formData.id)) {
        alert('Format ID Pelanggan tidak valid. Gunakan format: PLG-001, PLG-002, dst.');
        document.getElementById('id-pelanggan').focus();
        return false;
    }
    
    if (!formData.nama) {
        alert('Harap masukkan Nama Lengkap');
        document.getElementById('nama-pelanggan').focus();
        return false;
    }
    
    if (!formData.noHp) {
        alert('Harap masukkan Nomor HP');
        document.getElementById('no-hp').focus();
        return false;
    }
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneRegex.test(formData.noHp.replace(/[^0-9]/g, ''))) {
        alert('Nomor HP tidak valid. Masukkan 10-13 digit angka.');
        document.getElementById('no-hp').focus();
        return false;
    }
    
    if (!formData.alamat) {
        alert('Harap masukkan Alamat Lengkap');
        document.getElementById('alamat').focus();
        return false;
    }
    
    if (!formData.paketType) {
        alert('Harap pilih Paket Internet');
        document.getElementById('paket-internet').focus();
        return false;
    }
    
    return true;
}

function showSuccessMessage(pelanggan) {
    const message = `
        ✅ Pelanggan Berhasil Ditambahkan!
        
        ID Pelanggan: ${pelanggan.id}
        Nama: ${pelanggan.nama}
        No. HP: ${pelanggan.noHp}
        Paket: ${pelanggan.paket}
        Tanggal Pemasangan: ${formatDateDisplay(pelanggan.tanggalPemasangan)}
        Status: ${pelanggan.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
        
        Data pelanggan telah tersimpan dalam sistem.
    `;
    
    alert(message);
}

function resetForm() {
    document.getElementById('form-tambah-pelanggan').reset();
    
    // Set default dates
    const today = new Date();
    const expireDate = new Date(today);
    expireDate.setDate(today.getDate() + 30);
    
    document.getElementById('tanggal-pemasangan').value = formatDate(today);
    document.getElementById('tanggal-expire').value = formatDate(expireDate);
    
    // Set default status
    document.getElementById('status-aktif').checked = true;
    
    // Clear ID field
    document.getElementById('id-pelanggan').value = '';
    
    // Focus on ID field
    document.getElementById('id-pelanggan').focus();
}

function applyFilters() {
    const searchTerm = document.getElementById('search-pelanggan').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const packageFilter = document.getElementById('filter-paket').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Filter data
    filteredData = pelangganData.filter(pelanggan => {
        // Search filter
        if (searchTerm && 
            !pelanggan.id.toLowerCase().includes(searchTerm) &&
            !pelanggan.nama.toLowerCase().includes(searchTerm) &&
            !pelanggan.noHp.includes(searchTerm)) {
            return false;
        }
        
        // Status filter
        if (statusFilter !== 'all' && pelanggan.status !== statusFilter) {
            return false;
        }
        
        // Package filter
        if (packageFilter !== 'all' && pelanggan.paketType !== packageFilter) {
            return false;
        }
        
        return true;
    });
    
    // Sort data
    sortData(filteredData, sortBy);
    
    // Update summary
    updateSummary();
    
    // Render table
    currentPage = 1;
    renderTable();
}

function sortData(data, sortBy) {
    switch(sortBy) {
        case 'id_asc':
            data.sort((a, b) => a.id.localeCompare(b.id));
            break;
        case 'id_desc':
            data.sort((a, b) => b.id.localeCompare(a.id));
            break;
        case 'nama_asc':
            data.sort((a, b) => a.nama.localeCompare(b.nama));
            break;
        case 'nama_desc':
            data.sort((a, b) => b.nama.localeCompare(a.nama));
            break;
        case 'tanggal_desc':
            data.sort((a, b) => new Date(b.tanggalPemasangan) - new Date(a.tanggalPemasangan));
            break;
        case 'tanggal_asc':
            data.sort((a, b) => new Date(a.tanggalPemasangan) - new Date(b.tanggalPemasangan));
            break;
    }
}

function updateSummary() {
    const totalPelanggan = pelangganData.length;
    const pelangganAktif = pelangganData.filter(p => p.status === 'aktif').length;
    const pelangganNonaktif = pelangganData.filter(p => p.status === 'nonaktif').length;
    
    // Count expired today
    const today = new Date().toISOString().split('T')[0];
    const expireToday = pelangganData.filter(p => p.tanggalExpire === today).length;
    
    document.getElementById('total-pelanggan').textContent = totalPelanggan;
    document.getElementById('pelanggan-aktif').textContent = pelangganAktif;
    document.getElementById('pelanggan-nonaktif').textContent = pelangganNonaktif;
    document.getElementById('expire-hari-ini').textContent = expireToday;
}

function renderTable() {
    const tbody = document.getElementById('pelanggan-data');
    tbody.innerHTML = '';
    
    // Calculate pagination
    totalPages = Math.ceil(filteredData.length / pageSize);
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Render rows
    pageData.forEach((pelanggan, index) => {
        const row = document.createElement('tr');
        const rowNumber = startIndex + index + 1;
        
        // Shorten address for display
        const shortAddress = pelanggan.alamat.length > 30 ? 
            pelanggan.alamat.substring(0, 30) + '...' : pelanggan.alamat;
        
        row.innerHTML = `
            <td>${rowNumber}</td>
            <td><strong>${pelanggan.id}</strong></td>
            <td>${pelanggan.nama}</td>
            <td>${pelanggan.noHp}</td>
            <td title="${pelanggan.alamat}">${shortAddress}</td>
            <td>${pelanggan.paket.split(' - ')[0]}</td>
            <td>${formatDateDisplay(pelanggan.tanggalPemasangan)}</td>
            <td>${formatDateDisplay(pelanggan.tanggalExpire)}</td>
            <td>
                <span class="status-badge status-${pelanggan.status}">
                    ${pelanggan.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action-small btn-detail" onclick="showDetail('${pelanggan.id}')" title="Lihat Detail">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action-small btn-edit" onclick="openEditModal('${pelanggan.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action-small btn-hapus" onclick="confirmDelete('${pelanggan.id}')" title="Hapus">
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
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, filteredData.length);
    
    document.getElementById('page-start').textContent = startIndex;
    document.getElementById('page-end').textContent = endIndex;
    document.getElementById('total-items').textContent = filteredData.length;
    
    // Update button states
    const firstBtn = document.getElementById('first-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const lastBtn = document.getElementById('last-page');
    
    firstBtn.disabled = currentPage === 1;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    lastBtn.disabled = currentPage === totalPages;
    
    // Add/remove disabled class
    [firstBtn, prevBtn, nextBtn, lastBtn].forEach(btn => {
        if (btn.disabled) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
}

function renderPageNumbers() {
    const container = document.getElementById('page-numbers');
    container.innerHTML = '';
    
    // Show limited page numbers
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;
    
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    // Show first page if not in range
    if (startPage > 1) {
        addPageNumber(1);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            container.appendChild(ellipsis);
        }
    }
    
    // Show page numbers
    for (let i = startPage; i <= endPage; i++) {
        addPageNumber(i);
    }
    
    // Show last page if not in range
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            container.appendChild(ellipsis);
        }
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

function showDetail(pelangganId) {
    const pelanggan = pelangganData.find(p => p.id === pelangganId);
    if (!pelanggan) return;
    
    const modalContent = document.getElementById('detail-pelanggan-content');
    modalContent.dataset.id = pelangganId;
    
    const statusText = pelanggan.status === 'aktif' ? 'Aktif' : 'Nonaktif';
    const statusClass = pelanggan.status === 'aktif' ? 'status-aktif' : 'status-nonaktif';
    
    modalContent.innerHTML = `
        <div class="detail-container">
            <div class="detail-header">
                <div class="detail-id">${pelanggan.id}</div>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> Informasi Pribadi</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Nama Lengkap:</span>
                        <span class="detail-value">${pelanggan.nama}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">No. HP:</span>
                        <span class="detail-value">${pelanggan.noHp}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${pelanggan.email || '-'}</span>
                    </div>
                    <div class="detail-item full-width">
                        <span class="detail-label">Alamat:</span>
                        <span class="detail-value">${pelanggan.alamat}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-wifi"></i> Informasi Layanan</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Paket Internet:</span>
                        <span class="detail-value">${pelanggan.paket}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tanggal Pemasangan:</span>
                        <span class="detail-value">${formatDateDisplay(pelanggan.tanggalPemasangan)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tanggal Expire:</span>
                        <span class="detail-value">${formatDateDisplay(pelanggan.tanggalExpire)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value"><span class="status-badge ${statusClass}">${statusText}</span></span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-sticky-note"></i> Catatan</h4>
                <div class="detail-notes">
                    ${pelanggan.catatan || 'Tidak ada catatan'}
                </div>
            </div>
        </div>
        
        <style>
            .detail-container { padding: 10px; }
            .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
            .detail-id { font-size: 1.2rem; font-weight: 700; color: var(--primary); }
            .detail-section { margin-bottom: 25px; }
            .detail-section h4 { color: var(--primary); margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
            .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
            .detail-item { display: flex; flex-direction: column; }
            .detail-item.full-width { grid-column: 1 / -1; }
            .detail-label { font-weight: 600; color: var(--dark); margin-bottom: 5px; font-size: 0.9rem; }
            .detail-value { color: var(--gray); }
            .detail-value .status-badge { display: inline-block; }
            .detail-notes { background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); }
        </style>
    `;
    
    openModal('modal-detail-pelanggan');
}

function openEditModal(pelangganId) {
    const pelanggan = pelangganData.find(p => p.id === pelangganId);
    if (!pelanggan) return;
    
    // Fill edit form
    document.getElementById('edit-id-pelanggan').value = pelanggan.id;
    document.getElementById('edit-nama-pelanggan').value = pelanggan.nama;
    document.getElementById('edit-no-hp').value = pelanggan.noHp;
    document.getElementById('edit-email').value = pelanggan.email || '';
    document.getElementById('edit-alamat').value = pelanggan.alamat;
    document.getElementById('edit-paket-internet').value = pelanggan.paketType;
    document.getElementById('edit-tanggal-pemasangan').value = pelanggan.tanggalPemasangan;
    document.getElementById('edit-tanggal-expire').value = pelanggan.tanggalExpire;
    document.getElementById('edit-catatan').value = pelanggan.catatan || '';
    
    // Set status radio
    if (pelanggan.status === 'aktif') {
        document.getElementById('edit-status-aktif').checked = true;
    } else {
        document.getElementById('edit-status-nonaktif').checked = true;
    }
    
    // Store pelanggan ID in form
    document.getElementById('form-edit-pelanggan').dataset.id = pelangganId;
    
    openModal('modal-edit-pelanggan');
}

function updatePelanggan() {
    const form = document.getElementById('form-edit-pelanggan');
    const pelangganId = form.dataset.id;
    
    const index = pelangganData.findIndex(p => p.id === pelangganId);
    if (index === -1) return;
    
    // Update data
    pelangganData[index] = {
        ...pelangganData[index],
        nama: document.getElementById('edit-nama-pelanggan').value.trim(),
        noHp: document.getElementById('edit-no-hp').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        alamat: document.getElementById('edit-alamat').value.trim(),
        paket: document.getElementById('edit-paket-internet').selectedOptions[0].text,
        paketType: document.getElementById('edit-paket-internet').value,
        tanggalPemasangan: document.getElementById('edit-tanggal-pemasangan').value,
        tanggalExpire: document.getElementById('edit-tanggal-expire').value,
        status: document.querySelector('input[name="edit-status"]:checked').value,
        catatan: document.getElementById('edit-catatan').value.trim()
    };
    
    // Close modal
    closeModal('modal-edit-pelanggan');
    
    // Show success message
    alert('Data pelanggan berhasil diperbarui!');
    
    // Refresh table
    applyFilters();
}

function confirmDelete(pelangganId) {
    const pelanggan = pelangganData.find(p => p.id === pelangganId);
    if (!pelanggan) return;
    
    pelangganToDelete = pelangganId;
    document.getElementById('hapus-pelanggan-message').textContent = 
        `Apakah Anda yakin ingin menghapus pelanggan ${pelanggan.id} - ${pelanggan.nama}?`;
    
    openModal('modal-hapus-pelanggan');
}

function deletePelanggan(pelangganId) {
    // Remove from data array
    pelangganData = pelangganData.filter(p => p.id !== pelangganId);
    
    // Close modal
    closeModal('modal-hapus-pelanggan');
    
    // Show success message
    alert('Pelanggan berhasil dihapus!');
    
    // Refresh table
    applyFilters();
}

function exportPelangganData() {
    // Create CSV content
    const headers = ['ID Pelanggan', 'Nama', 'No. HP', 'Email', 'Alamat', 'Paket', 'Tanggal Pemasangan', 'Tanggal Expire', 'Status', 'Catatan'];
    const csvContent = [
        headers.join(','),
        ...pelangganData.map(p => [
            p.id,
            `"${p.nama}"`,
            p.noHp,
            p.email || '',
            `"${p.alamat}"`,
            `"${p.paket}"`,
            p.tanggalPemasangan,
            p.tanggalExpire,
            p.status === 'aktif' ? 'Aktif' : 'Nonaktif',
            `"${p.catatan || ''}"`
        ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `data_pelanggan_${formatDate(new Date())}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Data pelanggan berhasil diexport!');
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
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

// Export function for HTML buttons
window.showDetail = showDetail;
window.openEditModal = openEditModal;
window.confirmDelete = confirmDelete;
window.closeModal = closeModal;

// Initialize
initPelangganPage();

document.addEventListener('DOMContentLoaded', function() {
    // Logika Tab (Tetap)
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // FIX TOMBOL EDIT
    const modalEdit = document.getElementById('modal-edit-pelanggan');
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            // Isi data ke modal
            document.getElementById('edit-nama-pelanggan').value = this.dataset.name;
            document.getElementById('edit-no-hp').value = this.dataset.phone;
            document.getElementById('edit-alamat').value = this.dataset.address;
            
            // Set tujuan update ke rute Laravel yang benar
            document.getElementById('form-edit-pelanggan').action = `/pelanggan/${id}`;
            
            // Munculkan Modal
            modalEdit.classList.add('active');
            modalEdit.style.display = 'flex';
        });
    });
});

// Fungsi Tutup Modal
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function() {
    // 1. Logika Tab
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // 2. Logika Edit
    const modalEdit = document.getElementById('modal-edit-pelanggan');
    const formEdit = document.getElementById('form-edit-pelanggan');

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-dbid');
            document.getElementById('edit-nama').value = this.getAttribute('data-name');
            document.getElementById('edit-phone').value = this.getAttribute('data-phone');
            document.getElementById('edit-status').value = this.getAttribute('data-status');

            // Ganti URL Action Form Update
            formEdit.action = `/pelanggan/${id}`;
            modalEdit.style.display = 'flex';
        });
    });

    // 3. Logika Detail
    const modalDetail = document.getElementById('modal-detail-pelanggan');
    document.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', function() {
            const content = `
                <p><strong>ID Pelanggan:</strong> ${this.dataset.id}</p>
                <p><strong>Nama Lengkap:</strong> ${this.dataset.name}</p>
                <p><strong>Nomor HP:</strong> ${this.dataset.phone}</p>
                <p><strong>Paket:</strong> ${this.dataset.package}</p>
                <p><strong>Status:</strong> ${this.dataset.status.toUpperCase()}</p>
                <p><strong>Alamat:</strong> ${this.dataset.address}</p>
            `;
            document.getElementById('detail-content').innerHTML = content;
            modalDetail.style.display = 'flex';
        });
    });
});

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}
