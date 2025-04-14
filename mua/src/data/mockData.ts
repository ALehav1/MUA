export interface Submission {
  submissionId: string;
  insuredName: string;
  address: string;
  status: 'New' | 'In Review' | 'Needs Info' | 'Quoted' | 'Bound' | 'Declined';
  dateReceived: string;
  lineOfBusiness: string;
  broker: string;
  enrichmentData: EnrichmentData;
  riskAnalysis: RiskAnalysis;
  quoteRecommendation: QuoteRecommendation;
  interactionLog: InteractionLog[];
}

export interface EnrichmentData {
  financialData: {
    revenue: number;
    employees: number;
    industry: string;
  };
  locationData: {
    state: string;
    city: string;
    zipCode: string;
  };
  additionalInfo: {
    [key: string]: any;
  };
}

export interface RiskAnalysis {
  overallScore: number;
  components: RiskComponent[];
  narrativeSummary: string;
  keyFlags: string[];
  detailedData: {
    [key: string]: any;
  };
}

export interface RiskComponent {
  name: string;
  score: number;
  weight: number;
  details: string;
}

export interface QuoteRecommendation {
  status: 'Pending Review' | 'Approved' | 'Rejected';
  coverage: Coverage[];
  keyConditions: string[];
  premiumIndication: {
    base: number;
    adjustments: number;
    total: number;
  };
  aiConfidence: 'High' | 'Medium' | 'Low';
}

export interface Coverage {
  type: string;
  limit: number;
  deductible: number;
  premium: number;
}

export interface InteractionLog {
  question: string;
  answer: string;
  timestamp: string;
}

// Mock Data
export const mockSubmissions: Submission[] = [
  {
    submissionId: 'SUB12345',
    insuredName: 'Acme Manufacturing Inc.',
    address: '123 Industrial Way, Anytown, USA',
    status: 'New',
    dateReceived: '2024-04-13',
    lineOfBusiness: 'General Liability & Property',
    broker: 'Marsh McLennan',
    enrichmentData: {
      financialData: {
        revenue: 50000000,
        employees: 250,
        industry: 'Manufacturing'
      },
      locationData: {
        state: 'CA',
        city: 'Los Angeles',
        zipCode: '90001'
      },
      additionalInfo: {
        yearsInBusiness: 15,
        claimsHistory: 'Clean'
      }
    },
    riskAnalysis: {
      overallScore: 72,
      components: [
        {
          name: 'Financial Stability',
          score: 85,
          weight: 0.3,
          details: 'Strong financial position with consistent growth'
        },
        {
          name: 'Location Risk',
          score: 65,
          weight: 0.2,
          details: 'Moderate earthquake exposure'
        },
        {
          name: 'Operations',
          score: 70,
          weight: 0.3,
          details: 'Standard manufacturing processes'
        },
        {
          name: 'Claims History',
          score: 90,
          weight: 0.2,
          details: 'Minimal claims in past 5 years'
        }
      ],
      narrativeSummary: 'The account exhibits low financial risk with strong revenue growth and clean claims history. Recommend proceed with standard underwriting guidelines.',
      keyFlags: ['Earthquake Zone 4', 'High Employee Count'],
      detailedData: {
        catModel: {
          score: 65,
          details: 'Moderate CAT exposure'
        }
      }
    },
    quoteRecommendation: {
      status: 'Pending Review',
      coverage: [
        {
          type: 'General Liability',
          limit: 1000000,
          deductible: 25000,
          premium: 50000
        },
        {
          type: 'Property',
          limit: 5000000,
          deductible: 50000,
          premium: 75000
        }
      ],
      keyConditions: [
        'Earthquake sublimit of $1M',
        'Employee count verification required',
        'Quarterly safety inspections'
      ],
      premiumIndication: {
        base: 125000,
        adjustments: 15000,
        total: 140000
      },
      aiConfidence: 'Medium'
    },
    interactionLog: [
      {
        question: 'Why is the CAT risk high?',
        answer: 'The risk score reflects high flood exposure (RMS Zone A) and proximity to fault lines.',
        timestamp: '2024-04-13T10:00:00Z'
      },
      {
        question: 'What is the impact of the PFAS alert?',
        answer: 'The Praedicat model indicates a growing potential for liability claims in the manufacturing sector.',
        timestamp: '2024-04-13T11:00:00Z'
      }
    ]
  }
  // Add more mock submissions as needed
]; 