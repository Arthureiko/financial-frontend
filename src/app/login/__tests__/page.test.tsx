import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../page";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("LoginPage", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockLogin = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    jest.clearAllMocks();
  });

  it("deve renderizar a página de login corretamente", () => {
    render(<LoginPage />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Entre com sua conta")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite seu e-mail"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
  });

  it("deve validar o formulário corretamente", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    const submitButton = screen.getByText("Entrar");

    // Teste com email inválido
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
        screen.getByText("Senha deve ter pelo menos 6 caracteres"),
      ).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(
        screen.getByText("Senha deve conter pelo menos uma letra maiúscula"),
      ).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    fireEvent.change(emailInput, { target: { value: "teste@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456Aa" } });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("deve fazer login com sucesso", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    const submitButton = screen.getByText("Entrar");

    fireEvent.change(emailInput, { target: { value: "teste@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456Aa" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("teste@teste.com", "123456Aa");
      expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("deve mostrar erro quando o login falhar", async () => {
    const errorMessage = "Credenciais inválidas";
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Digite seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Digite sua senha");
    const submitButton = screen.getByText("Entrar");

    fireEvent.change(emailInput, { target: { value: "teste@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456Aa" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Ops, algo deu errado!")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("deve navegar para a página de registro ao clicar em criar conta", () => {
    render(<LoginPage />);

    const createAccountButton = screen.getByText("Criar conta");
    fireEvent.click(createAccountButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/register");
  });
});
