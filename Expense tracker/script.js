// JavaScript code to handle user input, local storage, and dynamic updates
const transactionForm = document.getElementById("transaction-form");
const transactionsList = document.getElementById("transactions");
const incomeTotal = document.getElementById("income-total");
const expenseTotal = document.getElementById("expense-total");
const totalBalance = document.getElementById("total-balance");
const editForm = document.getElementById("edit-form");
const editTransactionForm = document.getElementById("edit-transaction-form");
const saveEditedTransactionButton = document.getElementById("save-edited-transaction");
const cancelEditButton = document.getElementById("cancel-edit");

// Load income and expenses from local storage
let income = JSON.parse(localStorage.getItem("income")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Variable to keep track of the currently edited transaction
let editingIndex = null;
let editingType = null;

// Function to calculate and update income total
function updateIncomeTotal() {
    const incomeSum = income.reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2);
    incomeTotal.textContent = incomeSum;
}

// Function to calculate and update expense total
function updateExpenseTotal() {
    const expenseSum = expenses.reduce((acc, item) => acc + parseFloat(item.amount), 0).toFixed(2);
    expenseTotal.textContent = expenseSum;
}

// Function to calculate and update total balance
function updateBalance() {
    const incomeSum = parseFloat(incomeTotal.textContent);
    const expenseSum = parseFloat(expenseTotal.textContent);
    const balance = (incomeSum - expenseSum).toFixed(2);
    totalBalance.textContent = balance;
}

// Function to display income and expense transactions
function displayTransactions() {
    transactionsList.innerHTML = "";

    income.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="income">${item.name} - $${item.amount}</span>
            <button onclick="editTransaction('income', ${index})">Edit</button>
            <button onclick="deleteTransaction('income', ${index})">Delete</button>
        `;
        transactionsList.appendChild(li);
    });

    expenses.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="expense">${item.name} - $${item.amount}</span>
            <button onclick="editTransaction('expense', ${index})">Edit</button>
            <button onclick="deleteTransaction('expense', ${index})">Delete</button>
        `;
        transactionsList.appendChild(li);
    });

    updateIncomeTotal();
    updateExpenseTotal();
    updateBalance();
}

// Function to add a transaction (income or expense)
function addTransaction(type, name, amount) {
    if (type === "income") {
        income.push({ name, amount });
        localStorage.setItem("income", JSON.stringify(income));
    } else if (type === "expense") {
        expenses.push({ name, amount });
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }
    displayTransactions();
}

// Function to edit a transaction
function editTransaction(type, index) {
    const transaction = type === "income" ? income[index] : expenses[index];
    editingIndex = index;
    editingType = type;

    // Prompt dialogs to input edited name, amount, and type
    const newName = prompt("Enter edited description:", transaction.name);
    const newAmount = parseFloat(prompt("Enter edited amount:", transaction.amount)).toFixed(2);
    const newType = prompt("Enter edited type (income or expense):", type);

    if (newName !== null && !isNaN(newAmount) && (newType === "income" || newType === "expense")) {
        const editedTransaction = { name: newName, amount: newAmount };

        // Remove the transaction from its current type
        if (editingType === "income") {
            income.splice(editingIndex, 1);
        } else if (editingType === "expense") {
            expenses.splice(editingIndex, 1);
        }

        // Add the edited transaction to the new type
        if (newType === "income") {
            income.push(editedTransaction);
        } else if (newType === "expense") {
            expenses.push(editedTransaction);
        }

        localStorage.setItem("income", JSON.stringify(income));
        localStorage.setItem("expenses", JSON.stringify(expenses));

        displayTransactions();
        updateIncomeTotal();
        updateExpenseTotal();
        updateBalance();
        alert("Transaction edited successfully!");
    } else {
        alert("Invalid input. Transaction not edited.");
    }
}

// Event listener for cancel edit button
cancelEditButton.addEventListener("click", function () {
    editForm.style.display = "none";
});

// Function to delete a transaction
function deleteTransaction(type, index) {
    if (type === "income") {
        income.splice(index, 1);
        localStorage.setItem("income", JSON.stringify(income));
    } else if (type === "expense") {
        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }
    displayTransactions();
    updateIncomeTotal();
    updateExpenseTotal();
    updateBalance();
}

// Event listener for adding a transaction
transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const type = document.getElementById("transaction-type").value;
    const name = document.getElementById("transaction-name").value;
    const amount = parseFloat(document.getElementById("transaction-amount").value).toFixed(2);
    if (type && name && !isNaN(amount)) {
        addTransaction(type, name, amount);
        document.getElementById("transaction-name").value = "";
        document.getElementById("transaction-amount").value = "";
    }
});

// Initial display of transactions
displayTransactions();
