import Link from 'next/link';
import { useCustomWallet } from "@/contexts/CustomWallet";
import ProfilePopover from "@/components/ProfilePopover";
import { CreateCounter } from "@/components/CreateCounter";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Counter } from "@/components/Counter";
import { useEffect, useState } from "react";

export default function Connect () {
  const { isConnected } = useCustomWallet();
  const [counterId, setCounter] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (isValidSuiObjectId(hash)) {
      setCounter(hash);
    }
  }, []);

  return (
    <div className="max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white">
        <img src="/images/MainScreen.png" alt="Whale and coins" className="w-full" />

      {/* Content section */}
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Whallet</h1>
        <p className="text-sm text-gray-600 mt-2">
          Empowering kids in high-inflation economies with secure crypto savings accounts.
        </p>

        <ProfilePopover />

        <p className="text-sm text-gray-500 mt-4">
        <div className="flex flex-col items-center sm:flex-row gap-4 sm:items-start">
        {isConnected ? (
          counterId ? (
            <Counter id={counterId} />
          ) : (
            <CreateCounter
              onCreated={(id) => {
                window.location.hash = id;
                setCounter(id);
              }}
            />
          )
        ) : (
          <div>Please connect your wallet to continue.</div>
        )}
      </div>
        </p>
      </div>
    </div>
  );
};