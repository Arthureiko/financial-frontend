import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransferOperation } from "./TransferOperation";
import { useTransfers } from "@/hooks/useTransfers";
import { useDeposits } from "@/hooks/useDeposits";

jest.mock("@/hooks/useTransfers");
jest.mock("@/hooks/useDeposits");

const mockUseTransfers = useTransfers as jest.MockedFunction<
  typeof useTransfers
>;
const mockUseDeposits = useDeposits as jest.MockedFunction<typeof useDeposits>;

describe("TransferOperation", () => {
  const mockOnError = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockAddTransfer = jest.fn();

  beforeEach(() => {
    mockUseTransfers.mockReturnValue({
      transfers: [],
      loading: false,
      addTransfer: mockAddTransfer,
    });

    mockUseDeposits.mockReturnValue({
      deposits: [],
      balance: 1000,
      loading: false,
      addDeposit: jest.fn(),
      reverseDeposit: jest.fn(),
      refreshDeposits: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o formulário de transferência corretamente", () => {
    render(
      <TransferOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    expect(screen.getByLabelText("Valor da Transferência")).toBeInTheDocument();
    expect(
      screen.getByLabelText("ID do Usuário Destinatário"),
    ).toBeInTheDocument();
    expect(screen.getByText("Realizar Transferência")).toBeInTheDocument();
  });

  it("deve mostrar mensagem de erro para valor inválido", async () => {
    render(
      <TransferOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    const valorInput = screen.getByLabelText("Valor da Transferência");
    const submitButton = screen.getByText("Realizar Transferência");

    await userEvent.clear(valorInput);
    await userEvent.type(valorInput, "-100");
    const form = submitButton.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(
        "Valor inválido para transferência",
      );
    });
  });

  it("deve mostrar mensagem de erro para ID de usuário vazio", async () => {
    render(
      <TransferOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    const valorInput = screen.getByLabelText("Valor da Transferência");
    const submitButton = screen.getByText("Realizar Transferência");

    await userEvent.clear(valorInput);
    await userEvent.type(valorInput, "100");
    const form = submitButton.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(
        "ID do usuário destinatário é obrigatório",
      );
    });
  });

  it("deve mostrar mensagem de erro para saldo insuficiente", async () => {
    mockUseDeposits.mockReturnValue({
      deposits: [],
      balance: 50,
      loading: false,
      addDeposit: jest.fn(),
      reverseDeposit: jest.fn(),
      refreshDeposits: jest.fn(),
    });

    render(
      <TransferOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    const valorInput = screen.getByLabelText("Valor da Transferência");
    const idInput = screen.getByLabelText("ID do Usuário Destinatário");
    const submitButton = screen.getByText("Realizar Transferência");

    await userEvent.clear(valorInput);
    await userEvent.type(valorInput, "100");
    await userEvent.clear(idInput);
    await userEvent.type(idInput, "123");
    const form = submitButton.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(
        "Saldo insuficiente para realizar a transferência",
      );
    });
  });

  it("deve realizar transferência com sucesso", async () => {
    render(
      <TransferOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    const valorInput = screen.getByLabelText("Valor da Transferência");
    const idInput = screen.getByLabelText("ID do Usuário Destinatário");
    const submitButton = screen.getByText("Realizar Transferência");

    await userEvent.clear(valorInput);
    await userEvent.type(valorInput, "100");
    await userEvent.clear(idInput);
    await userEvent.type(idInput, "123");
    const form = submitButton.closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockAddTransfer).toHaveBeenCalledWith(100, "123");
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Transferência realizada com sucesso!",
      );
    });
  });

  it("deve exibir histórico de transferências", () => {
    const mockTransfers = [
      {
        id: "1",
        amount: 100,
        targetUserId: "123",
        createdAt: new Date().toISOString(),
      },
    ];

    mockUseTransfers.mockReturnValue({
      transfers: mockTransfers,
      loading: false,
      addTransfer: mockAddTransfer,
    });

    render(
      <TransferOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    expect(screen.getByText("Histórico de Transferências")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("R$ 100.00")).toBeInTheDocument();
  });

  it("deve mostrar loading state", () => {
    mockUseTransfers.mockReturnValue({
      transfers: [],
      loading: true,
      addTransfer: mockAddTransfer,
    });

    render(
      <TransferOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });
});
