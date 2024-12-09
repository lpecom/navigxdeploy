export type KYCStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export interface KYCDocument {
  type: string;
  url: string;
  uploadedAt: string;
}

export interface DriverKYC {
  status: KYCStatus;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  documents: {
    documentFront?: KYCDocument;
    documentBack?: KYCDocument;
    selfie?: KYCDocument;
    proofOfAddress?: KYCDocument;
  };
}