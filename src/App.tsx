import { useContractMetadata, useContract, useNetworkMismatch, useNFTBalance, useClaimedNFTSupply, useUnclaimedNFTSupply, metamaskWallet, useAddress, useConnect } from "@thirdweb-dev/react";
import { useState } from "react";

const metamaskConfig = metamaskWallet();

function App() {
  const [claiming, setClaiming] = useState(false);
  const { contract, isLoading } = useContract(import.meta.env.VITE_CONTRACT_ADDRESS);
  const { data: contractMetadata } = useContractMetadata(contract)
  const { data: claimedSupply } = useClaimedNFTSupply(contract)
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(contract)
  const address = useAddress();
  const connect = useConnect();
  const isWrongNetwork = useNetworkMismatch();
  const { data: ownerBalance } = useNFTBalance(contract, address);

  const connectWallet = async () => {
    const wallet = await connect(metamaskConfig);
    console.log("connected to ", wallet);
  }

  const mint = async () => {

    if (!address) {
      connectWallet();
      return;
    }
    if ((ownerBalance?.toNumber() || 0) > 0) {
      alert("you have already minted!")
      return;
    }

    if (isWrongNetwork) {
      alert("please connect to the correct network!")
      return;
    }

    setClaiming(true);

    try {
      await contract?.erc721.claim(1);
      alert("minted successfully!")
      console.log(ownerBalance);

    }
    catch (e) {
      alert(e);
    }

    setClaiming(false);
  }

  if (!contract || !contractMetadata) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        welcome to the Ankyverse..
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-screen justify-center items-center max-w-6xl flex-col p-6 md:p-12">
      <main className="grid gap-6 rounded-md bg-black/20 p-6 md:grid-cols-2 md:p-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-2xl font-bold text-secondary">
            {contractMetadata?.name}
          </h1>
          <p className="text-center leading-relaxed">
            {contractMetadata?.description}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex w-full max-w-sm flex-col space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-md">
              <img className="aspect-square object-cover" src={contractMetadata?.image} />
            </div>

            <div className="flex max-w-sm justify-between">
              <p>Total Minted</p>
              <p>{claimedSupply?.toNumber()} / {(claimedSupply?.toNumber() || 0) + (unclaimedSupply?.toNumber() || 0)}</p>
            </div>
            <div className="flex justify-center">
              {address === undefined ? <button
                onClick={connectWallet} className="rounded-full bg-primary px-6 py-2 text-white hover:bg-opacity-75">
                Connect Wallet
              </button> : <button onClick={mint} disabled={claiming || (ownerBalance?.toNumber() || 0) > 0} className="rounded-full bg-primary px-6 py-2 text-white hover:bg-opacity-75">
                {claiming ? "Claiming..." : (ownerBalance?.toNumber() || 0) ? "Thankyou for becoming a part of this <3" : "Mint"}
              </button>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
