let tronWeb;
let contract;
const contractAddress = "TB1dhjkqEUWjvHXza6RSGJaQEVm1vreZNW"; // Replace with USDTWalletInteraction address
const contractABI = require('./USDTWalletInteractionABI.json');

async function connectWallet() {
    if (window.tronLink) {
        try {
            await window.tronLink.request({ method: 'tron_requestAccounts' });
            tronWeb = window.tronLink.tronWeb;
            if (!tronWeb) {
                document.getElementById('output').innerText = "TronLink not properly initialized!";
                return;
            }
            const accounts = await tronWeb.defaultAddress.base58;
            document.getElementById('output').innerText = `Connected: ${accounts}`;
            contract = await tronWeb.contract(contractABI, contractAddress);
        } catch (error) {
            document.getElementById('output').innerText = `Error: ${error.message}`;
        }
    } else {
        document.getElementById('output').innerText = "Please install TronLink!";
    }
}

async function checkBalance() {
    const wallet = document.getElementById('balanceAddress').value;
    try {
        const balance = await contract.checkUSDTBalance(wallet).call();
        document.getElementById('output').innerText = `Balance: ${balance} USDT`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
}

async function transferUSDT() {
    const recipient = document.getElementById('transferRecipient').value;
    const amount = document.getElementById('transferAmount').value;
    try {
        const result = await contract.transferUSDT(recipient, amount).send({
            feeLimit: 10000000 // Adjust fee limit as needed
        });
        document.getElementById('output').innerText = `Transferred ${amount} USDT to ${recipient}`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
}

async function approveUSDT() {
    const spender = document.getElementById('approveSpender').value;
    const amount = document.getElementById('approveAmount').value;
    try {
        const result = await contract.approveUSDT(spender, amount).send({
            feeLimit: 10000000 // Adjust fee limit as needed
        });
        document.getElementById('output').innerText = `Approved ${amount} USDT for ${spender}`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
}