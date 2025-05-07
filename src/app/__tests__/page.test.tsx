import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import HomePage from "../page";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("HomePage", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve redirecionar para dashboard quando usuário está autenticado", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "1" },
      loading: false,
    });
    render(<HomePage />);
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("deve mostrar loading quando está carregando", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });
    render(<HomePage />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve renderizar botões de login e registro quando não autenticado", () => {
    render(<HomePage />);
    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Criar conta")).toBeInTheDocument();
  });

  it("deve navegar para página de login ao clicar no botão entrar", async () => {
    render(<HomePage />);
    const loginButton = screen.getByText("Entrar");
    await userEvent.click(loginButton);
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("deve navegar para página de registro ao clicar no botão criar conta", async () => {
    render(<HomePage />);
    const registerButton = screen.getByText("Criar conta");
    await userEvent.click(registerButton);
    expect(mockRouter.push).toHaveBeenCalledWith("/register");
  });

  it("deve renderizar o título e subtítulo corretamente", () => {
    render(<HomePage />);
    expect(
      screen.getByText("Bem-vindo ao Portal Financeiro"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Seu guia para realizar transferência de saldo e depósito",
      ),
    ).toBeInTheDocument();
  });
});
