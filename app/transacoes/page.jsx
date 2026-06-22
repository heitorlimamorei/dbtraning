import { TransactionApp } from "@/components/transactions/transaction-app";

export const metadata = {
  title: "Transações e Concorrência BD",
  description:
    "Walkthroughs de transações, recuperabilidade, grafos de precedência, 2PL e timestamp.",
};

export default function TransactionsPage() {
  return <TransactionApp />;
}
