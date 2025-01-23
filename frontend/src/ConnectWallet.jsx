import { useEffect } from 'react'

const ConnectWallet = ({ account, setAccount }) => {
useEffect(() => {
    checkIfWalletIsConnected()
}, [])

const checkIfWalletIsConnected = async () => {
    if (typeof window.ethereum !== 'undefined') {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
        setAccount(accounts[0])
        }
    } catch (error) {
        console.error("An error occurred while checking the wallet connection:", error)
    }
    }
}

const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setAccount(accounts[0])
    } catch (error) {
        console.error("An error occurred while connecting the wallet:", error)
    }
    } else {
    alert("Please install MetaMask!")
    }
}

return (
    <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
    </button>
)
}

export default ConnectWallet;