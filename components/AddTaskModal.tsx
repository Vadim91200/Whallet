import { useState } from 'react';
import Image from 'next/image';
import { useEnokiFlow } from '@mysten/enoki/react';
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    childId: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose , childId }) => {
    const client = useSuiClient();
    const enokiFlow = useEnokiFlow();
    const [taskTitle, setTaskTitle] = useState(""); // State for task title

    if (!isOpen) return null;

    const handleClick = async () => {
        onClose();
        const keypair = await enokiFlow.getKeypair();

        const tx = new Transaction();
        tx.setGasBudget(100000000);
        tx.moveCall({
            target: `0x1e000a2e13062e56f58af947a922e46612bf9323374b12173d19bb452c2c5fbf::AccountModule::create_task`,
            arguments: [
                tx.object(childId),
                tx.object(taskTitle),
            ],
        });

        const response = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
            options: {
                showEffects: true,
            },
        });

        console.log("Finish for task", response);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-end z-50">
            <div className="bg-blue-100 w-full max-w-md rounded-t-3xl p-6 animate-slideUp">
                <h2 className="text-2xl font-bold mb-6">Add a new task</h2>

                <label className="block text-sm font-semibold mb-2">Task Title</label>
                <input
                    type="text"
                    placeholder="Task"
                    value={taskTitle} // Bind to state
                    onChange={(e) => setTaskTitle(e.target.value)} // Update state on input
                    className="w-full p-3 rounded-lg mb-4 bg-white"
                />

                <label className="block text-sm font-semibold mb-2">Funding</label>
                <div className="w-full p-3 rounded-lg mb-4 bg-white text-center text-2xl font-bold">
                    $50
                </div>

                <label className="block text-sm font-semibold mb-2">Due Date</label>
                <div className="flex space-x-2 mb-4">
                    {['12 Oct', '13 Oct Today', '14 Oct', '15 Oct'].map((date, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-full ${date === '13 Oct Today'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-500'
                                }`}
                        >
                            {date}
                        </button>
                    ))}
                </div>

                <label className="block text-sm font-semibold mb-2">Assignee</label>
                <div className="flex space-x-2 mb-6">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-full">
                        <Image src="/images/joe.png" alt="Joe" width={24} height={24} className="rounded-full" />
                        <span>Joe</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white text-gray-500 rounded-full">
                        <Image src="/images/jane.png" alt="Jane" width={24} height={24} className="rounded-full" />
                        <span>Jane</span>
                    </button>
                </div>

                <button
                    onClick={handleClick}
                    className="w-full py-3 text-center bg-white text-xl font-bold rounded-lg"
                >
                    Create Task
                </button>
            </div>

            <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AddTaskModal;