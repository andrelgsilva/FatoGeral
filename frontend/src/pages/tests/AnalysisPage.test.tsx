import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Home from '../Home';

vi.mock('../../services/analysisService', () => ({
  createAnalysis: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import { createAnalysis } from '../../services/analysisService';
import toast from 'react-hot-toast';

function renderHomePage() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home Page — Formulário de análise', () => {
  it('shouldShowValidationErrorWhenBothInputsAreEmpty', async () => {
    renderHomePage();
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    expect(screen.getByText(/preencha o texto ou a url/i)).toBeInTheDocument();
  });

  it('shouldDisableSubmitButtonDuringRequest', async () => {
    (createAnalysis as any).mockImplementation(() => new Promise(() => {}));
    renderHomePage();
    await userEvent.type(screen.getByPlaceholderText(/cole aqui o texto/i), 'texto suspeito');
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    expect(screen.getByRole('button', { name: /analisando/i })).toBeDisabled();
  });

  it('shouldDisplayResultAfterSuccessfulAnalysis', async () => {
    (createAnalysis as any).mockResolvedValue({
      id: '1',
      content: 'texto suspeito',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      result: {
        veredito: 'Fake News',
        confianca: 0.92,
        justificativa: 'Texto sem fontes confiáveis.',
        fontes: [],
      },
    });
    renderHomePage();
    await userEvent.type(screen.getByPlaceholderText(/cole aqui o texto/i), 'texto suspeito');
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    expect(await screen.findByText(/fake news/i)).toBeInTheDocument();
    expect(await screen.findByText(/92%/i)).toBeInTheDocument();
  });

  it('shouldDisplayErrorToastWhenApiCallFails', async () => {
    (createAnalysis as any).mockRejectedValue(new Error('API error'));
    renderHomePage();
    await userEvent.type(screen.getByPlaceholderText(/cole aqui o texto/i), 'texto suspeito');
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    expect(await screen.findByRole('button', { name: /analisar/i })).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Erro ao enviar para análise. Tente novamente.');
  });

  it('shouldShowSuccessToastAfterAnalysis', async () => {
    (createAnalysis as any).mockResolvedValue({
      id: '1',
      content: 'texto',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      result: { veredito: 'Verdadeiro', confianca: 0.8, justificativa: 'Ok', fontes: [] },
    });
    renderHomePage();
    await userEvent.type(screen.getByPlaceholderText(/cole aqui o texto/i), 'texto');
    await userEvent.click(screen.getByRole('button', { name: /analisar/i }));
    expect(await screen.findByText(/verdadeiro/i)).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Análise enviada com sucesso!');
  });
});