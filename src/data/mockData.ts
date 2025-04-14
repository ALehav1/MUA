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
  },
  {
    submissionId: 'SUB12346',
    insuredName: 'TechStart Solutions',
    address: '456 Innovation Drive, Silicon Valley, USA',
    status: 'In Review',
    dateReceived: '2024-04-12',
    lineOfBusiness: 'Cyber & Professional Liability',
    broker: 'Aon',
    enrichmentData: {
      financialData: {
        revenue: 25000000,
        employees: 100,
        industry: 'Technology'
      },
      locationData: {
        state: 'CA',
        city: 'San Francisco',
        zipCode: '94105'
      },
      additionalInfo: {
        yearsInBusiness: 5,
        claimsHistory: 'One minor incident'
      }
    },
    riskAnalysis: {
      overallScore: 68,
      components: [
        {
          name: 'Cyber Security',
          score: 75,
          weight: 0.4,
          details: 'Good security practices with room for improvement'
        },
        {
          name: 'Financial Stability',
          score: 65,
          weight: 0.3,
          details: 'Growing startup with venture funding'
        },
        {
          name: 'Professional Experience',
          score: 60,
          weight: 0.3,
          details: 'Young company but experienced leadership'
        }
      ],
      narrativeSummary: 'Emerging tech company with strong growth potential. Cyber security measures are above average but could be enhanced.',
      keyFlags: ['Rapid Growth', 'Cloud Services Provider'],
      detailedData: {
        cyberModel: {
          score: 75,
          details: 'Above average cyber resilience'
        }
      }
    },
    quoteRecommendation: {
      status: 'Approved',
      coverage: [
        {
          type: 'Cyber Liability',
          limit: 5000000,
          deductible: 50000,
          premium: 85000
        },
        {
          type: 'Professional Liability',
          limit: 2000000,
          deductible: 25000,
          premium: 45000
        }
      ],
      keyConditions: [
        'Quarterly security audits required',
        'Incident response plan mandatory',
        'Employee cyber training program'
      ],
      premiumIndication: {
        base: 130000,
        adjustments: -10000,
        total: 120000
      },
      aiConfidence: 'High'
    },
    interactionLog: [
      {
        question: 'What security certifications do they have?',
        answer: 'The company holds SOC2 Type II and ISO 27001 certifications.',
        timestamp: '2024-04-12T15:30:00Z'
      }
    ]
  },
  {
    submissionId: 'SUB12347',
    insuredName: 'GreenField Farms',
    address: '789 Rural Route, Heartland, USA',
    status: 'Needs Info',
    dateReceived: '2024-04-11',
    lineOfBusiness: 'Farm & Ranch',
    broker: 'Willis Towers Watson',
    enrichmentData: {
      financialData: {
        revenue: 15000000,
        employees: 75,
        industry: 'Agriculture'
      },
      locationData: {
        state: 'IA',
        city: 'Cedar Rapids',
        zipCode: '52404'
      },
      additionalInfo: {
        yearsInBusiness: 30,
        claimsHistory: 'Two weather-related claims'
      }
    },
    riskAnalysis: {
      overallScore: 65,
      components: [
        {
          name: 'Weather Risk',
          score: 55,
          weight: 0.4,
          details: 'High exposure to severe weather events'
        },
        {
          name: 'Operations',
          score: 80,
          weight: 0.3,
          details: 'Modern farming practices and equipment'
        },
        {
          name: 'Claims History',
          score: 60,
          weight: 0.3,
          details: 'Recent weather-related claims'
        }
      ],
      narrativeSummary: 'Traditional farm operation with modern practices but significant weather exposure. Additional information needed on flood mitigation.',
      keyFlags: ['Flood Zone', 'Crop Diversity'],
      detailedData: {
        weatherModel: {
          score: 55,
          details: 'High severe weather exposure'
        }
      }
    },
    quoteRecommendation: {
      status: 'Pending Review',
      coverage: [
        {
          type: 'Property',
          limit: 3000000,
          deductible: 25000,
          premium: 65000
        },
        {
          type: 'Equipment Breakdown',
          limit: 1000000,
          deductible: 10000,
          premium: 25000
        }
      ],
      keyConditions: [
        'Flood protection measures required',
        'Equipment maintenance records',
        'Weather monitoring system'
      ],
      premiumIndication: {
        base: 90000,
        adjustments: 20000,
        total: 110000
      },
      aiConfidence: 'Medium'
    },
    interactionLog: [
      {
        question: 'What flood mitigation measures are in place?',
        answer: 'Awaiting detailed information from broker on flood protection systems.',
        timestamp: '2024-04-11T09:15:00Z'
      }
    ]
  }
]; 