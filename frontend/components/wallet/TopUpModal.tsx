"use client";

interface Props {
  topUpAmount: string;
  setTopUpAmount: (val: string) => void;
  handleTopUp: (amount: number) => void;
  closeModal: () => void;
}

export function TopUpModal({ topUpAmount, setTopUpAmount, handleTopUp, closeModal }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-6 max-w-sm w-full mx-4 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Up Wallet</h3>
        <input
          type="number"
          placeholder="Enter amount ($)"
          value={topUpAmount}
          onChange={(e) => setTopUpAmount(e.target.value)}
          className="input-field w-full mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleTopUp(Number(topUpAmount))}
            className="flex-1 btn-primary"
          >
            Top Up
          </button>
        </div>
      </div>
    </div>
  );
}
