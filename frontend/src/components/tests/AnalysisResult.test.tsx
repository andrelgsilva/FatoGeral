import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnalysisResult } from '../../components/AnalysisResult';
import type { Analysis } from '../../services/analysisService';

const mockAnalysisBase: Analysis = {
  id: '1',
  content: 'texto suspeito',
  status: 'COMPLETED',
  createdAt: new Date().toISOString(),
  result: {
    veredito: 'Fake News',
    confianca: 0.87,
    justificativa: 'Texto sem fontes confiáveis.',
    fontes: ['https://source.com'],
  },
};

describe('AnalysisResult', () => {
  it('shouldShowSpinnerWhenStatusIsPending', () => {
    const analysis: Analysis = { ...mockAnalysisBase, status: 'PENDING', result: null };
    render(<AnalysisResult analysis={analysis} />);
    expect(screen.getByText(/ia está analisando/i)).toBeInTheDocument();
  });

  it('shouldShowErrorStateWhenStatusIsError', () => {
    const analysis: Analysis = { ...mockAnalysisBase, status: 'ERROR', result: null };
    render(<AnalysisResult analysis={analysis} />);
    expect(screen.getByText(/erro ao processar/i)).toBeInTheDocument();
  });

  it('shouldDisplayVerdictBadgeWithCorrectColor', () => {
    render(<AnalysisResult analysis={mockAnalysisBase} />);
    expect(screen.getByText('Fake News')).toBeInTheDocument();
  });

  it('shouldDisplayConfidenceAsPercentage', () => {
    render(<AnalysisResult analysis={mockAnalysisBase} />);
    expect(screen.getByText('87%')).toBeInTheDocument();
  });

  it('shouldDisplayJustificationText', () => {
    render(<AnalysisResult analysis={mockAnalysisBase} />);
    expect(screen.getByText('Texto sem fontes confiáveis.')).toBeInTheDocument();
  });

  it('shouldDisplaySourceLinksWhenAvailable', () => {
    render(<AnalysisResult analysis={mockAnalysisBase} />);
    const link = screen.getByRole('link', { name: /source\.com/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://source.com');
  });

  it('shouldNotDisplaySourcesWhenEmpty', () => {
    const analysis: Analysis = {
      ...mockAnalysisBase,
      result: { ...mockAnalysisBase.result!, fontes: [] },
    };
    render(<AnalysisResult analysis={analysis} />);
    expect(screen.queryByText('Fontes')).not.toBeInTheDocument();
  });
});