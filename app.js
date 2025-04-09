let tronWeb;
let contract;

// Paste the ABI directly here
const contractABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "checkUSDTBalance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "sender",
                "type": "address"
            },
            {
                "name": "recipient",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFromUSDT",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newUsdtAddress",
                "type": "address"
            }
        ],
        "name": "setUSDTAddress",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "wallet",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "checkAllowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "usdtAddress",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "spender",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approveUSDT",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "usdtToken",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "recipient",
                "type": "address"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferUSDT",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "wallet",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "balance",
                "type": "uint256"
            }
        ],
        "name": "USDTBalanceChecked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "USDTTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "USDTApproved",
        "type": "event"
    }
];

// Replace with the actual contract address from Tron-IDE
const contractAddress = "TB1dhjkqEUWjvHXza6RSGJaQEVm1vreZNW";

async function connectWallet() {
    if (window.tronLink) {
        try {
            await window.tronLink.request({ method: 'tron_requestAccounts' });
            tronWeb = window.tronLink.tronWeb;
            if (!tronWeb) {
                document.getElementById('output').innerText = "TronLink not properly initialized! Please ensure TronLink is logged in and set to Shasta testnet.";
                return;
            }
            const accounts = await tronWeb.defaultAddress.base58;
            if (!accounts) {
                document.getElementById('output').innerText = "Failed to connect to TronLink. Please ensure you're logged in.";
                return;
            }
            document.getElementById('output').innerText = `Connected: ${accounts}`;
            contract = await tronWeb.contract(contractABI, contractAddress);
            if (!contract) {
                document.getElementById('output').innerText = "Failed to initialize contract. Please check the contract address and ABI.";
            }
        } catch (error) {
            document.getElementById('output').innerText = `Error connecting to TronLink: ${error.message}`;
        }
    } else {
        document.getElementById('output').innerText = "Please install TronLink!";
    }
}

async function checkBalance() {
    if (!contract) {
        document.getElementById('output').innerText = "Please connect your TronLink wallet first!";
        return;
    }
    const wallet = document.getElementById('balanceAddress').value;
    if (!wallet) {
        document.getElementById('output').innerText = "Please enter a wallet address!";
        return;
    }
    try {
        const balance = await contract.checkUSDTBalance(wallet).call();
        document.getElementById('output').innerText = `Balance: ${balance} USDT`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
}

async function transferUSDT() {
    if (!contract) {
        document.getElementById('output').innerText = "Please connect your TronLink wallet first!";
        return;
    }
    const recipient = document.getElementById('transferRecipient').value;
    const amount = document.getElementById('transferAmount').value;
    if (!recipient || !amount) {
        document.getElementById('output').innerText = "Please enter a recipient address and amount!";
        return;
    }
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
    if (!contract) {
        document.getElementById('output').innerText = "Please connect your TronLink wallet first!";
        return;
    }
    const spender = document.getElementById('approveSpender').value;
    const amount = document.getElementById('approveAmount').value;
    if (!spender || !amount) {
        document.getElementById('output').innerText = "Please enter a spender address and amount!";
        return;
    }
    try {
        const result = await contract.approveUSDT(spender, amount).send({
            feeLimit: 10000000 // Adjust fee limit as needed
        });
        document.getElementById('output').innerText = `Approved ${amount} USDT for ${spender}`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message}`;
    }
}

