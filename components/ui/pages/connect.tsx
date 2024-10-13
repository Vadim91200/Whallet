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
    console.log("my adress", keypair.getPublicKey().toSuiAddress())
    const tx = new Transaction();
    tx.setGasBudget(100000000); 
    console.log("tx created", keypair)
    try {
      const childrenObject = tx.moveCall({
        target: `0xef5d4a739e26b1c784277bbeff474afc3625eced38e605c4dd684ae50dfaf418::AccountModuleyarn::create_child`,
        arguments: [                    // TxContext
          tx.object(),            // Parent object ID
        ],
      });
    } catch (err) {
      console.error(err);
      throw new Error("Non");
    }
    console.log("move call")
    client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
  });
    console.log("Finish")
  };
  const handleCreateParent = async () => {
    console.log("parent")
    const keypair = await enokiFlow.getKeypair();
    console.log("my adress", keypair.getPublicKey().toSuiAddress())
    const tx = new Transaction();
    tx.setGasBudget(100000000); 
    console.log("tx created", keypair)
    const parentObject = tx.moveCall({
        target: `0xef5d4a739e26b1c784277bbeff474afc3625eced38e605c4dd684ae50dfaf418::AccountModule::create_parent`,
        arguments: [],
    });
    console.log("move call", parentObject)
    const ert = client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
    });
    console.log("Finish", ert)
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

              <label className="block text-gray-700 mb-1" htmlFor={`birthday-${index}`}>
                Birthday
              </label>
              <input
                type="text"
                id={`birthday-${index}`}
                value={childrenData[index]?.birthday || ''}
                onChange={(e) => handleChildDataChange(index, 'birthday', e.target.value)}
                placeholder="MM/DD/YYYY"
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
              setChildrenData(Array(Number(e.target.value)).fill({ name: '', birthday: '', email: '' }));
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