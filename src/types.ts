export interface CSRIntervention {
  ID: string | number;
  Sector: string;
  Title: string;
  Description: string;
  Budget_Lakhs: number | string;
  Location: string;
  Status: string;
  Contact_Person?: string;
  Date_Added?: string;
}

export interface EOISubmission {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  interventionId: string | number;
  message: string;
}

export type ActivePage = 
  | 'home'
  | 'about'
  | 'interventions'
  | 'join'
  | 'contributors'
  | 'gallery'
  | 'contact';
