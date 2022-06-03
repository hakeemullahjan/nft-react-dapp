import { useState } from "react";
import "./App.css";
import abi from "./abi.json";
import Web3 from "web3";

const CONTRACT_ADDRESS = "0xF22392D227B4Cb26de3A99bbd90B4E5D92f6C455";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState<any>(null);

  const connectWalletAction = async () => {
    try {
      const { ethereum }: any = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      var web3 = new Web3(ethereum);
      var contract = new web3.eth.Contract(abi as any, CONTRACT_ADDRESS);

      setContract(contract);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const mint = async () => {
    if (contract && currentAccount) {
      await contract.methods
        .mint()
        .send({
          from: currentAccount,
          gasLimit: 1000000,
        })
        .on("transactionHash", (hash: any) => {
          // hash of tx
          console.log("hash", hash);
        })
        .on("confirmation", function (confirmationNumber: any, receipt: any) {
          if (confirmationNumber === 2) {
            // tx confirmed
            console.log("confirmation", confirmationNumber, receipt);
          }
        })
        .on("error", function (err: any) {
          console.log("err", err);
        });
    }
  };

  return (
    <div className="App">
      {currentAccount ? (
        <h2>{currentAccount}</h2>
      ) : (
        <button onClick={connectWalletAction}>Connect Wallet</button>
      )}
      <button onClick={mint}>Mint</button>
    </div>
  );
}

export default App;
