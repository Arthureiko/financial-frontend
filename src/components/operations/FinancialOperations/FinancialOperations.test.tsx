import { render, screen, fireEvent } from "@testing-library/react";
import { FinancialOperations } from "./FinancialOperations";

jest.mock("../DepositOperation/DepositOperation", () => ({
  DepositOperation: ({ onError, onSuccess }: any) => (
    <div data-testid="deposit-operation">
      <button onClick={() => onError("Erro ao processar operação")}>
        Simular Erro
      </button>
      <button onClick={() => onSuccess("Operação realizada com sucesso")}>
        Simular Sucesso
      </button>
    </div>
  ),
}));

jest.mock("../TransferOperation/TransferOperation", () => ({
  TransferOperation: ({ onError, onSuccess }: any) => (
    <div data-testid="transfer-operation">
      <button onClick={() => onError("Erro ao processar transferência")}>
        Simular Erro
      </button>
      <button onClick={() => onSuccess("Transferência realizada com sucesso")}>
        Simular Sucesso
      </button>
    </div>
  ),
}));

describe("FinancialOperations", () => {
  it("deve renderizar o componente com a tab de depósito ativa por padrão", () => {
    render(<FinancialOperations />);
    expect(screen.getByText("Depósitos")).toBeInTheDocument();
    expect(screen.getByText("Transferências")).toBeInTheDocument();
    expect(screen.getByTestId("deposit-operation")).toBeInTheDocument();
  });

  it("deve alternar entre as tabs de depósito e transferência", () => {
    render(<FinancialOperations />);

    const transferButton = screen.getByText("Transferências");
    fireEvent.click(transferButton);

    expect(screen.getByTestId("transfer-operation")).toBeInTheDocument();

    const depositButton = screen.getByText("Depósitos");
    fireEvent.click(depositButton);

    expect(screen.getByTestId("deposit-operation")).toBeInTheDocument();
  });

  it("deve exibir o modal de erro quando handleError é chamado", () => {
    render(<FinancialOperations />);

    const errorButton = screen.getByText("Simular Erro");
    fireEvent.click(errorButton);

    expect(screen.getByText("Erro")).toBeInTheDocument();
    expect(screen.getByText("Erro ao processar operação")).toBeInTheDocument();
  });

  it("deve exibir o modal de sucesso quando handleSuccess é chamado", () => {
    render(<FinancialOperations />);

    const successButton = screen.getByText("Simular Sucesso");
    fireEvent.click(successButton);

    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(
      screen.getByText("Operação realizada com sucesso"),
    ).toBeInTheDocument();
  });

  it("deve fechar o modal quando o botão de fechar é clicado", () => {
    render(<FinancialOperations />);

    const successButton = screen.getByText("Simular Sucesso");
    fireEvent.click(successButton);

    const closeButton = screen.getByRole("button", { name: /fechar/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText("Sucesso")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Operação realizada com sucesso"),
    ).not.toBeInTheDocument();
  });
});
