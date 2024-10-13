import ProfilePopover from "@/components/ProfilePopover";
import { useEffect, useState } from "react";
import { useCustomWallet } from "@/contexts/CustomWallet";
import { useRouter } from "next/navigation";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getFullnodeUrl, SuiClient, } from '@mysten/sui/client';
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { useEnokiFlow } from '@mysten/enoki/react';

export default function Connect() {
  const router = useRouter();
  const [numChildren, setNumChildren] = useState('');
  const [childrenData, setChildrenData] = useState([]);
  const [parent, setparent] = useState('');
  const client = useSuiClient();
  const enokiFlow = useEnokiFlow();
  const { isConnected, address } =
    useCustomWallet();
  const handleChildDataChange = (index, field, value) => {
    const updatedData = [...childrenData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setChildrenData(updatedData);
  };

  const handleCreateChildren = async () => {
    console.log(childrenData);
    const keypair = await enokiFlow.getKeypair();
    console.log("my address for children", keypair.getPublicKey().toSuiAddress());

    const tx = new Transaction();
    tx.setGasBudget(100000000);

    console.log("I created the children but the parent is", parent);

    childrenData.forEach((child) => {
      tx.moveCall({
        target: `0x1e000a2e13062e56f58af947a922e46612bf9323374b12173d19bb452c2c5fbf::AccountModule::create_child`,
        arguments: [
          tx.object("Jaqueline"),
          tx.object(parent),
        ],
      });
      console.log("move call for child", child);
    });

    const response = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: {
        showEffects: true,
      },
    });

    console.log("Finish for children", response);
    await localStorage.setItem("parentObjectId", parent);
    router.push("/home");
  };
  const handleCreateParent = async () => {
    console.log("parent")
    const keypair = await enokiFlow.getKeypair();
    console.log("my adress", keypair.getPublicKey().toSuiAddress())
    const tx = new Transaction();
    tx.setGasBudget(100000000);
    console.log("tx created", keypair)
    const parentObject = tx.moveCall({
      target: `0x1e000a2e13062e56f58af947a922e46612bf9323374b12173d19bb452c2c5fbf::AccountModule::create_parent`,
      arguments: [tx.object("Michel"),],
    });
    console.log("move call", parentObject)
    const response = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: {
        showEffects: true
      }
    });
    console.log("Finish", response)
    
    setparent(response.effects.created[0].reference.objectId);
    console.log("i put the objectid", parent);
  };
  return (
    <div className="max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white">
      <img src="/images/MainScreen.png" alt="Whale and coins" className="w-full" />
      {numChildren !== '' ? (
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Whallet</h1>
          <p className="text-sm text-gray-600 mt-2">
            Empowering kids.
          </p>
          {Array.from({ length: Number(numChildren) }).map((_, index) => (
            <div key={index} className="text-left mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Child {index + 1}</h2>

              <label className="block text-gray-700 mb-1" htmlFor={`name-${index}`}>
                Name
              </label>
              <input
                type="text"
                id={`name-${index}`}
                value={childrenData[index]?.name || ''}
                onChange={(e) => handleChildDataChange(index, 'name', e.target.value)}
                placeholder="Joe"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />

              <label className="block text-gray-700 mb-1" htmlFor={`email-${index}`}>
                Email
              </label>
              <input
                type="email"
                id={`email-${index}`}
                value={childrenData[index]?.email || ''}
                onChange={(e) => handleChildDataChange(index, 'email', e.target.value)}
                placeholder="john.doe@gmail.com"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
            </div>
          ))}

          <button
            onClick={handleCreateChildren}
            className="w-full py-3 bg-blue-500 text-white rounded-full font-semibold text-lg"
          >
            Continue
          </button>
        </div>
      ) : isConnected ? (
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Let’s set up your Whallet?</h1>
          <p className="text-sm text-gray-600 mb-4">How many children do you have?</p>

          {/* Input Field for Number of Children */}
          <input
            type="number"
            value={numChildren}
            onChange={(e) => {
              handleCreateParent();
              setNumChildren(e.target.value);
              setChildrenData(Array(Number(e.target.value)).fill({ name: '', email: '' }));
            }}
            placeholder="Number"
            className="w-full p-3 border border-gray-300 rounded-lg text-center mb-4"
          />
        </div>
      ) : (
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Whallet</h1>
          <p className="text-sm text-gray-600 mt-2">Empowering kids.</p>
          <ProfilePopover />
        </div>
      )}
    </div>
  );
};