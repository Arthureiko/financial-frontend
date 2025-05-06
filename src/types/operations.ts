export interface Operation {
  id: string;
  type: "deposit" | "transfer" | "reversal";
  amount: number;
  userId: string;
  targetUserId?: string;
  status: "pending" | "completed" | "reversed";
  createdAt: Date;
  reversedAt?: Date;
}

export interface DepositData {
  amount: number;
}

export interface TransferData {
  amount: number;
  targetUserId: string;
}

export interface ReversalData {
  operationId: string;
}
