import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        providerChanged(provider);
        setWeb3Api({
          provider,
          web3: new Web3(provider),
        });
      } else {
        window.alert("Please Install Metamask wallet or other");
      }
    };
    loadProvider();
  }, []);

  const [account, setAccount] = useState(null);
  useEffect(() => {
    const loadAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && loadAccounts();
  }, [web3Api.web3]);

  const providerChanged = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());
  };
  //Load Contract
  const [contract, setContract] = useState();
  useEffect(() => {
    const loadContracts = async () => {
      const contractFile = await fetch("/abis/StorgeName.json");
      const convertToJson = await contractFile.json();
      //find the abi
      const abi = convertToJson.abi;

      const netWorkid = await web3Api.web3.eth.net.getId();

      const networkObject = convertToJson.networks[netWorkid];

      if (networkObject) {
        const contractAddress = convertToJson.networks[netWorkid].address;
        const deployedContract = await new web3Api.web3.eth.Contract(
          abi,
          contractAddress
        );
        setContract(deployedContract);
      } else {
        window.alert("Please connect your wallet with Ropstent Network");
      }
    };
    web3Api.web3 && loadContracts();
  }, [web3Api.web3]);
  const [name, setName] = useState();
  const addName = async () => {
    if (name) {
      const addName = await contract.methods.setName( name )
        .send({ from: account });

      window.location.reload();
    } else {
      window.alert("Please Enter your Name");
    }
  };

  const [loadeName, setLoadeName] = useState("");

  useEffect(() => {
    const loadeName = async () => {
        const name = await contract.methods.getName().call();
        setLoadeName(name);
      setLoading(false);
    };
    contract  && loadeName();
  },[contract]);

 

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand">Zoubair Dapps</a>
          <form className="d-flex">
            <button className="btn btn-outline-success">{account}</button>
          </form>
        </div>
      </nav>
      <div className="mainPart">
       
        <div class="card m-3">
          <div class="card-header bg-dark text-white">Welcome To Storge Name</div>
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <h2>Add your Name now to our descentralize applications.</h2>
              <footer class="blockquote-footer">By Zoubair Hattab</footer>
            </blockquote>
          </div>
        </div>
        <div className="Productinputs container">
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
            Enter Your  Name
            </span>
            <input
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              onChange={(e) =>
                setName( e.target.value )
              }
            />
          </div>

  
   
          <button
            type="button "
            className="btn btn-success p-auto m-3"
            onClick={addName}
          >
     
            Add Name
          </button>
          <div className="container m-3 alert alert-danger" role="alert">
       <h4> Your Name Store on Blockchain=  {loadeName}</h4>
      </div>
        </div>
      </div>
   
   
 
  </div>
  );
}

export default App;
