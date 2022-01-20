import React, {useEffect, useState, createContext} from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = createContext();

const { ethereum } = window;

const createEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {

    const [ formData, setFormData ] = useState({ addressTo:'', amount: '', keyword: '', message: '' });
    const [ isLoading, setIsLoading ] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [ transactions , setTransactions ] = useState([])

    const handleChange = (e, name) =>{
        setFormData((prevState) => setFormData({...prevState, [name]: e.target.value}))
    }

    const getAllTransactions = async() =>{
        try {
            if(!ethereum) return alert('Please install metamask')
            const transactionContract = createEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions(); 
            const structuredTransactions = availableTransactions.map((transaction) =>({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))
            setTransactions(structuredTransactions)
        } catch (error) {
            console.log(error)
        }
    }

    const [ currentAccount, setCurrentAccount ] = useState('');
    
    const checkIfWalletIsConnected = async () =>{

        try {
            
            if(!ethereum) return alert('Please install metamask')
    
            const account = await ethereum.request({ method: 'eth_accounts' });
    
    
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    
            if(account.length){
                setCurrentAccount(accounts[0])
                getAllTransactions();
            } else{
                console.log('no accounts found')
            }

        } catch (error) {
            
            console.log(e)
            throw new Error("No ethereum object.")

        }


    }

    const checkIfTransactionsExist = async() =>{
        try {
            const transactionContract = createEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem('transactionCount', transactionCount);

        } catch (error) {
            console.log(e)
            throw new Error("No ethereum object.")
        }
    }

    const connectWallet = async() =>{
        try{
            if(!ethereum) return alert('Please install metamask')

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);

        }catch(e){
            console.log(e)
            throw new Error("No ethereum object.")
        }
    }

    const sendTransaction = async() => {    
        try{
            if(ethereum){

             const { addressTo, amount, keyword, message } = formData;
             const transactionContract = createEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount)

            console.log(currentAccount, addressTo)

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                  from: currentAccount,
                  to: addressTo,
                  gas: "0x5208",
                  value: parsedAmount._hex,
                }],
              });
      
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading ${transactionHash.hash}`);

            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());
        } else {
            console.log("No ethereum object");
        }
        } catch(e){
            console.log(e);
            throw new Error("No ethereum object.")
        }
    }

    useEffect(() =>{
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, [])



    return (<TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
            </TransactionContext.Provider>)
};
