export interface Quote {
  id: string;
  submissionId: string;
  amount: number;
  terms: string[];
  conditions?: string[];
  validUntil?: string;
}

export const mockQuotes: Quote[] = [
  {
    id: '1',
    submissionId: '1',
    amount: 50000,
    terms: [
      '12-month policy term',
      'Standard coverage limits',
      'Standard deductible'
    ],
    conditions: [
      'Safety training program implementation required',
      'Quarterly risk assessment required'
    ],
    validUntil: '2024-05-14'
  }
]; 