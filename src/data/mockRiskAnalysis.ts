export interface RiskFactor {
  category: string;
  score: number;
  details: string;
}

export interface RiskAnalysis {
  id: string;
  submissionId: string;
  score: number;
  factors: RiskFactor[];
  recommendations?: string[];
}

export const mockRiskAnalysis: RiskAnalysis[] = [
  {
    id: '1',
    submissionId: '1',
    score: 75,
    factors: [
      {
        category: 'Financial Stability',
        score: 80,
        details: 'Strong financial indicators'
      },
      {
        category: 'Claims History',
        score: 70,
        details: 'Moderate claims frequency'
      }
    ],
    recommendations: [
      'Consider higher deductible',
      'Implement safety training program'
    ]
  }
]; 