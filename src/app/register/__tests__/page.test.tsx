import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../page";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("RegisterPage", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockRegister = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ register: mockRegister });
    jest.clearAllMocks();
  });

  it("deve renderizar a página de registro corretamente", () => {
    render(<RegisterPage />);

    expect(screen.getByText("Cadastro")).toBeInTheDocument();
    expect(screen.getByText("Crie sua conta para começar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite seu nome")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite seu e-mail"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
    expect(screen.getByText("Voltar para login")).toBeInTheDocument();
  });

  it("deve validar o formulário corretamente", async () => {
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText("Digite seu nome");
    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    const submitButton = screen.getByText("Criar conta");

    fireEvent.change(nameInput, { target: { value: "a" } });
    fireEvent.blur(nameInput);
    await waitFor(() => {
      expect(
        screen.getByText("O nome deve ter no mínimo 3 caracteres"),
      ).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    fireEvent.change(nameInput, { target: { value: "João Silva" } });
    fireEvent.change(emailInput, { target: { value: "email-invalido" } });
    fireEvent.blur(emailInput);
    await waitFor(() => {
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    fireEvent.change(emailInput, { target: { value: "teste@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(
        screen.getByText("A senha deve ter no mínimo 6 caracteres"),
      ).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    fireEvent.change(nameInput, { target: { value: "João Silva" } });
    fireEvent.change(emailInput, { target: { value: "teste@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("deve fazer registro com sucesso", async () => {
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText("Digite seu nome");
    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    const submitButton = screen.getByText("Criar conta");

    fireEvent.change(nameInput, { target: { value: "João Silva" } });
    fireEvent.change(emailInput, { target: { value: "teste@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "teste@teste.com",
        "123456",
        "João Silva",
      );
      expect(screen.getByText("Oba, tudo certo!")).toBeInTheDocument();
      expect(
        screen.getByText("Cadastro realizado com sucesso!"),
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockRouter.push).toHaveBeenCalledWith("/login");
      },
      { timeout: 3000 },
    );
  });

  it("deve mostrar erro quando o registro falhar", async () => {
    const errorMessage = "E-mail já cadastrado";
    mockRegister.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText("Digite seu nome");
    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    const submitButton = screen.getByText("Criar conta");

    fireEvent.change(nameInput, { target: { value: "João Silva" } });
    fireEvent.change(emailInput, { target: { value: "teste@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "teste@teste.com",
        "123456",
        "João Silva",
      );
      expect(screen.getByText("Ops, algo deu errado!")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("deve navegar para a página de login ao clicar em 'Voltar para login'", () => {
    render(<RegisterPage />);

    const loginButton = screen.getByText("Voltar para login");
    fireEvent.click(loginButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });
});
