import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1000);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1000);
      await tx.wait()
      getBalance();
    }
  }

  const handleBurn = async(x, item) => {
    if(atm){
      if(balance > x){
        let tx = await atm.burn(x);
        await tx.wait();
        getBalance();
        console.log(`${item} bought!`)
      }
      else{
        console.log("You don't have enough balance!")
      }
    }
    
  }
 


  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div style={{backgroundColor : "#ffd383"}}>
        <p className="para">Your Account: {account}</p>
        <p className="para">Your Balance: {balance}</p>
        <button className="button-ss--" onClick={deposit} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid green", borderRadius: "10px"}}>Deposit 1000 ETH</button>
        <button className="button-ss--" onClick={withdraw} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid red", borderRadius: "10px"}}>Withdraw 1000 ETH</button>
        <hr></hr>
        <div style={{width: "100%",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <div style={{display: "flex", width: "30%", justifyContent: "space-between", alignItems: "center"}}>
          <p className="para">Buy a coffee [50 Tokens] </p>
          <button className="button-ss--" onClick={() => handleBurn(50, "coffee")} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid green", borderRadius: "10px"}}>Buy</button>
          </div>
          <div style={{display: "flex", width: "30%", justifyContent: "space-between", alignItems: "center"}}>
            <p className="para">Buy a SoftDrink [75 Tokens] </p>
            <button className="button-ss--" onClick={() => handleBurn(75, "SoftDrink")} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid green", borderRadius: "10px"}}>Buy</button>
          </div>
          <div style={{display: "flex", width: "30%", justifyContent: "space-between", alignItems: "center"}}>
          <p className="para">Buy a RedBull [250 Tokens] </p>
          <button className="button-ss--" onClick={() => handleBurn(250, "RedBull")} style={{padding: "0.5em 1.2em", cursor: "pointer", margin: "0em 2em", border: "2px solid green", borderRadius: "10px"}}>Buy</button>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header className="header"><h1>Welcome to the DrinksHuB!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
        .header{
          background-color: #ffc65c;
        }
        h1 {
          margin: 0;
          padding: 1rem 0
         }
        .para {
         color: red;
        }
        .button-ss-- {
          background-color: #ffc65c;
        }
      `}
      </style>
    </main>
  )
}
