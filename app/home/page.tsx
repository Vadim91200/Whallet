"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import AddTaskModal from '@/components/AddTaskModal';

import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const parent = localStorage.getItem("parentObjectId")
  console.log("Parent Object Id", parent)
  const client = useSuiClient();
  const [savingsData, setSavingsData] = useState([]);
  const [childrenData, setChildrenData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const parentObjectId = await client.getObject({ id: parent, options: { showContent: true } });
      console.log("Les données du parent", parentObjectId)
      setChildrenData(parentObjectId.data?.content.fields.children)
      console.log(childrenData)
      const fetchedData = childrenData.map((child) => ({
        name: child.fields.name,
        expense: child.fields.expenses,
        id: child.fields.id.id,
        task: child.fields.task,
      })
      ,console.log("the first one ", childrenData[0].fields.name)
    ) || [];
      setSavingsData(fetchedData);
      
    };
    fetchData();
  }, []);
  return (
    <div className="max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white">
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Whallet</h1>
        <p className="text-sm text-gray-600 mt-2">
          Empowering kids.
        </p>
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Your balance</p>
            <h1 className="text-3xl font-bold">$15,000.25</h1>
          </div>
          <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded-md font-semibold">History</button>
        </header>

        {/* Savings Overview */}
        <section className="bg-blue-50 p-4 rounded-lg mb-4">
          <h2 className="font-semibold text-lg">Savings Overview</h2>
          <p className="text-2xl font-bold">$4,000</p>
          <hr className="my-2" />
          <div className="space-y-2">
            {Array.from(savingsData, (item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">{item.name} saving</p>
                </div>
                <p className="font-bold">${item.amount}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-md font-semibold">Add funds</button>
            <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-md font-semibold">Withdraw Funds</button>
          </div>
        </section>
        <div className="flex justify-center mb-4">
        <button onClick={openModal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-lg"
        >
          <span>➕</span>
          <span>New Task</span>
        </button>
      </div>
        {/* Savings History */}
        <section className="mb-4">
        {childrenData.map((task) => (
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg mb-3">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm font-medium">{task.description}</p>
                <p className="text-xs text-blue-600 font-semibold">5</p>
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
          </div>
          ))}
        </section>
      </div>
      {/* Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={closeModal} childId={childrenData[0].fields.id.id}/>
    
    </div>
  );
}