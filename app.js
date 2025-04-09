let tronWeb;
let contract;

// Contract ABI (unchanged)
const contractABI = [
    {
        "constant": true,
        "inputs": [{"name": "wallet", "type": "address"}],
        "name": "checkUSDTBalance",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "sender", "type": "address"}, {"name": "recipient", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "transferFromUSDT",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "newUsdtAddress", "type": "address"}],
        "name": "setUSDTAddress",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "wallet", "type": "address"}, {"name": "spender", "type": "address"}],
        "name": "checkAllowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "usdtAddress",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "approveUSDT",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "usdtToken",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "recipient", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "transferUSDT",
        "outputs": [{"name": "", "type": "bool"}],
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
        "inputs": [{"indexed": true, "name": "from", "type": "address"}, {"indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "amount", "type": "uint256"}],
        "name": "USDTTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {"indexed": true, "name": "spender", "type": "address"}, {"indexed": false, "name": "amount", "type": "uint256"}],
        "name": "USDTApproved",
        "type": "event"
    }
];

async function connectWallet() {
    if (!window.tronLink) {
        document.getElementById('output').innerText = "Please install TronLink!";
        console.error("TronLink not detected.");
        return;
    }

    const contractAddress = document.getElementById('contractAddress').value.trim();
    if (!contractAddress || !tronWeb.isAddress(contractAddress)) {
        document.getElementById('output').innerText = "Please enter a valid contract address!";
        console.error("Invalid or empty contract address:", contractAddress);
        return;
    }

    try {
        const response = await window.tronLink.request({ method: 'tron_requestAccounts' });
        console.log("TronLink response:", response);

        tronWeb = window.tronLink.tronWeb;
        if (!tronWeb) {
            document.getElementById('output').innerText = "TronLink not initialized! Ensure TronLink is logged in and set to Shasta testnet.";
            console.error("TronWeb not available.");
            return;
        }

        const network = tronWeb.fullNode.host;
        console.log("TronLink network:", network);
        if (!network.includes("shasta")) {
            document.getElementById('output').innerText = "Please switch TronLink to the Shasta testnet!";
            console.error("Wrong network detected:", network);
            return;
        }

        const accounts = tronWeb.defaultAddress.base58;
        if (!accounts) {
            document.getElementById('output').innerText = "Failed to connect to TronLink. Ensure you're logged in.";
            console.error("No accounts found.");
            return;
        }

        document.getElementById('output').innerText = `Connected: ${accounts}`;
        console.log("Connected account:", accounts);

        contract = await tronWeb.contract(contractABI, contractAddress);
        console.log("Contract initialized:", contract);

        const usdtAddr = await contract.usdtAddress().call();
        console.log("USDT Address from contract:", usdtAddr);
    } catch (error) {
        document.getElementById('output').innerText = `Error connecting to TronLink: ${error.message || error}`;
        console.error("Error in connectWallet:", error);
    }
}

async function checkBalance() {
    if (!contract) {
        document.getElementById('output').innerText = "Please connect your TronLink wallet first!";
        console.error("Contract not initialized.");
        return;
    }

    const wallet = document.getElementById('balanceAddress').value.trim();
    if (!wallet || !tronWeb.isAddress(wallet)) {
        document.getElementById('output').innerText = "Please enter a valid wallet address!";
        console.error("Invalid or empty wallet address:", wallet);
        return;
    }

    try {
        console.log("Checking USDT balance for wallet:", wallet);
        const balance = await contract.checkUSDTBalance(wallet).call();
        const balanceFormatted = tronWeb.fromSun(balance); // Assuming 6 decimals for USDT
        console.log("Balance:", balance.toString(), "Formatted:", balanceFormatted);
        document.getElementById('output').innerText = `Balance: ${balanceFormatted} USDT`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message || error}`;
        console.error("Error in checkBalance:", error);
    }
}

async function transferUSDT() {
    if (!contract) {
        document.getElementById('output').innerText = "Please connect your TronLink wallet first!";
        console.error("Contract not initialized.");
        return;
    }

    const recipient = document.getElementById('transferRecipient').value.trim();
    const amount = document.getElementById('transferAmount').value.trim();
    if (!recipient || !amount || isNaN(amount) || Number(amount) <= 0) {
        document.getElementById('output').innerText = "Please enter a valid recipient address and amount!";
        console.error("Invalid recipient or amount:", recipient, amount);
        return;
    }

    if (!tronWeb.isAddress(recipient)) {
        document.getElementById('output').innerText = "Invalid recipient address!";
        console.error("Invalid recipient address:", recipient);
        return;
    }

    const amountWithDecimals = tronWeb.toSun(amount); // Converts to smallest unit (6 decimals)
    const wallet = tronWeb.defaultAddress.base58;
    const contractAddress = contract.address;

    try {
        // Check balance
        const balance = await contract.checkUSDTBalance(wallet).call();
        if (balance.lt(amountWithDecimals)) {
            document.getElementById('output').innerText = "Insufficient USDT balance!";
            console.error("Insufficient balance:", balance.toString(), "Required:", amountWithDecimals);
            return;
        }

        // Check allowance
        const allowance = await contract.checkAllowance(wallet, contractAddress).call();
        if (allowance.lt(amountWithDecimals)) {
            document.getElementById('output').innerText = "Insufficient allowance! Approving...";
            console.log("Approving contract to spend:", amountWithDecimals);
            await contract.approveUSDT(contractAddress, amountWithDecimals).send({ feeLimit: 20000000 });
            console.log("Approval successful. Waiting for confirmation...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for approval to propagate
        }

        console.log("Transferring", amount, "USDT to", recipient);
        const result = await contract.transferUSDT(recipient, amountWithDecimals).send({ feeLimit: 20000000 });
        console.log("Transfer result:", result);
        document.getElementById('output').innerText = `Transferred ${amount} USDT to ${recipient}`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message || error}`;
        console.error("Error in transferUSDT:", error);
    }
}

async function approveUSDT() {
    if (!contract) {
        document.getElementById('output').innerText = "Please connect your TronLink wallet first!";
        console.error("Contract not initialized.");
        return;
    }

    const spender = document.getElementById('approveSpender').value.trim();
    const amount = document.getElementById('approveAmount').value.trim();
    if (!spender || !amount || isNaN(amount) || Number(amount) <= 0) {
        document.getElementById('output').innerText = "Please enter a valid spender address and amount!";
        console.error("Invalid spender or amount:", spender, amount);
        return;
    }

    if (!tronWeb.isAddress(spender)) {
        document.getElementById('output').innerText = "Invalid spender address!";
        console.error("Invalid spender address:", spender);
        return;
    }

    const amountWithDecimals = tronWeb.toSun(amount); // Converts to smallest unit (6 decimals)

    try {
        console.log("Approving", amount, "USDT for spender:", spender);
        const result = await contract.approveUSDT(spender, amountWithDecimals).send({ feeLimit: 20000000 });
        console.log("Approve result:", result);
        document.getElementById('output').innerText = `Approved ${amount} USDT for ${spender}`;
    } catch (error) {
        document.getElementById('output').innerText = `Error: ${error.message || error}`;
        console.error("Error in approveUSDT:", error);
    }
}