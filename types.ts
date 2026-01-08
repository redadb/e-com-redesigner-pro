
export interface RedesignResult {
  html: string;
  css: string;
  explanation?: string;
}

export interface TransformationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  originalCode: string;
  redesignedCode: RedesignResult | null;
  error?: string;
}
