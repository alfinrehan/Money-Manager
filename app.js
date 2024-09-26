// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expensesElement = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');

// Ambil data transaksi dari Local Storage, jika ada
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Fungsi untuk memformat angka ke dalam format Rupiah
function formatRupiah(number) {
    return 'Rp ' + number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Update Balance, Income, and Expenses
function updateSummary() {
    const amounts = transactions.map(transaction => transaction.amount);
    const totalBalance = amounts.reduce((acc, item) => acc + item, 0);
    const income = amounts.filter(amount => amount > 0).reduce((acc, item) => acc + item, 0);
    const expenses = amounts.filter(amount => amount < 0).reduce((acc, item) => acc + item, 0);

    balanceElement.innerText = formatRupiah(totalBalance);
    incomeElement.innerText = formatRupiah(income);
    expensesElement.innerText = formatRupiah(Math.abs(expenses));
}

// Add Transaction to DOM
function addTransactionToDOM(transaction) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'transaction-item');

    li.innerHTML = `
        ${transaction.description} 
        <span>${transaction.amount < 0 ? '-' : '+'} ${formatRupiah(Math.abs(transaction.amount))}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
    `;

    li.classList.add(transaction.amount < 0 ? 'negative' : 'positive');
    transactionList.appendChild(li);
}

// Remove Transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    // Simpan perubahan ke Local Storage setelah penghapusan transaksi
    localStorage.setItem('transactions', JSON.stringify(transactions));
    init();
}

// Handle New Transaction
transactionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const description = descriptionInput.value;
    const amount = +amountInput.value;

    const newTransaction = {
        id: Math.floor(Math.random() * 1000000),
        description: description,
        amount: amount
    };

    transactions.push(newTransaction);

    // Simpan transaksi ke Local Storage
    localStorage.setItem('transactions', JSON.stringify(transactions));

    addTransactionToDOM(newTransaction);
    updateSummary();

    descriptionInput.value = '';
    amountInput.value = '';
});

// Initialize App
function init() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionToDOM);
    updateSummary();
}

// Inisialisasi aplikasi saat halaman dimuat
init();
