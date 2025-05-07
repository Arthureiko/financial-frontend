import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../index";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

jest.mock("@/hooks/useAuth");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("../Sidebar.module.css", () => ({
  navLink: "navLink",
  active: "active",
}));

describe("Sidebar", () => {
  const mockLogout = jest.fn();
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue("/dashboard");
    localStorage.setItem("current-user", JSON.stringify({ name: "Test User" }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("deve renderizar o componente corretamente", () => {
    render(<Sidebar />);
    expect(screen.getByText("Financeiro")).toBeInTheDocument();
    expect(screen.getByText("Olá, Test User")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("deve mostrar 'Usuário' quando não houver dados do usuário", () => {
    localStorage.clear();
    render(<Sidebar />);
    expect(screen.getByText("Olá, Usuário")).toBeInTheDocument();
  });

  it("deve chamar logout e redirecionar ao clicar no botão de logout", () => {
    render(<Sidebar />);
    const logoutButton = screen.getByRole("button");
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("deve ter o link do dashboard ativo quando estiver na rota /dashboard", () => {
    render(<Sidebar />);
    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink?.className).toContain("active");
  });
});
