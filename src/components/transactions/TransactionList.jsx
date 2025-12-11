import { memo, useState } from 'react';
import Transaction from './Transaction';
import { Inbox } from 'lucide-react';

const TransactionList = memo(function TransactionList({ transactions, onDeleteTransaction, limit }) {
  const [activeId, setActiveId] = useState(null);
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Inbox className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Tidak ada transaksi
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          Tidak ada transaksi yang sesuai dengan filter
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction, index) => (
        <Transaction
          key={transaction._id}
          transaction={transaction}
          onDeleteTransaction={onDeleteTransaction}
          index={index}
          isActive={activeId === transaction._id}
          setActiveTransactionId={setActiveId}
        />
      ))}
    </div>
  );
});

export default TransactionList;
