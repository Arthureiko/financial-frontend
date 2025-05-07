import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DepositOperation } from "./DepositOperation";
import { useDeposits } from "@/hooks/useDeposits";

jest.mock("@/hooks/useDeposits");

const mockUseDeposits = useDeposits as jest.MockedFunction<typeof useDeposits>;

describe("DepositOperation", () => {
  const mockOnError = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    mockUseDeposits.mockReturnValue({
      deposits: [],
      balance: 1000,
      loading: false,
      addDeposit: jest.fn(),
      reverseDeposit: jest.fn(),
      refreshDeposits: jest.fn(),
    });
  });

  it("deve renderizar o componente corretamente", () => {
    render(
      <DepositOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    expect(screen.getByText("Saldo Atual")).toBeInTheDocument();
    expect(screen.getByText("R$ 1000.00")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor do Depósito")).toBeInTheDocument();
    expect(screen.getByText("Depositar")).toBeInTheDocument();
  });

  it("deve mostrar loading quando estiver carregando", () => {
    mockUseDeposits.mockReturnValue({
      deposits: [],
      balance: 0,
      loading: true,
      addDeposit: jest.fn(),
      reverseDeposit: jest.fn(),
      refreshDeposits: jest.fn(),
    });

    render(
      <DepositOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve realizar um depósito com sucesso", async () => {
    const mockAddDeposit = jest.fn();
    mockUseDeposits.mockReturnValue({
      deposits: [],
      balance: 1000,
      loading: false,
      addDeposit: mockAddDeposit,
      reverseDeposit: jest.fn(),
      refreshDeposits: jest.fn(),
    });

    render(
      <DepositOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    const input = screen.getByLabelText("Valor do Depósito");
    const submitButton = screen.getByText("Depositar");

    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddDeposit).toHaveBeenCalledWith(100);
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Depósito realizado com sucesso!",
      );
    });
  });

  it("deve mostrar erro ao tentar depositar valor inválido", async () => {
    render(
      <DepositOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    const input = screen.getByLabelText("Valor do Depósito");
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "-100" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith("Valor inválido para depósito");
    });
  });

  it("deve reverter um depósito com sucesso", async () => {
    const mockReverseDeposit = jest.fn();
    const mockDeposits = [
      {
        id: "123",
        amount: 100,
        createdAt: new Date().toISOString(),
      },
    ];

    mockUseDeposits.mockReturnValue({
      deposits: mockDeposits,
      balance: 1000,
      loading: false,
      addDeposit: jest.fn(),
      reverseDeposit: mockReverseDeposit,
      refreshDeposits: jest.fn(),
    });

    render(
      <DepositOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    const reverseButton = screen.getByText("Reverter");
    fireEvent.click(reverseButton);

    await waitFor(() => {
      expect(mockReverseDeposit).toHaveBeenCalledWith("123");
      expect(mockOnSuccess).toHaveBeenCalledWith(
        "Depósito revertido com sucesso!",
      );
    });
  });

  it("deve copiar ID para a área de transferência", async () => {
    const mockDeposits = [
      {
        id: "123",
        amount: 100,
        createdAt: new Date().toISOString(),
      },
    ];

    mockUseDeposits.mockReturnValue({
      deposits: mockDeposits,
      balance: 1000,
      loading: false,
      addDeposit: jest.fn(),
      reverseDeposit: jest.fn(),
      refreshDeposits: jest.fn(),
    });

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });

    render(
      <DepositOperation onError={mockOnError} onSuccess={mockOnSuccess} />,
    );

    const copyButton = screen.getByText("Copiar");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("123");
      expect(
        screen.getByText("ID copiado para a área de transferência!"),
      ).toBeInTheDocument();
    });
  });
});
