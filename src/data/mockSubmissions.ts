export interface Submission {
  id: string;
  name: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  date: string;
  type: string;
  notes?: string;
  attachments?: string[];
}

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    name: 'Acme Corp Insurance',
    status: 'pending',
    date: '2024-04-14',
    type: 'Commercial Casualty',
    notes: 'Initial submission for review',
    attachments: ['policy.pdf', 'risk_assessment.pdf']
  }
]; 