import { render, screen } from "@testing-library/react";
import { Header } from "./index";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 2, 15));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("deve renderizar o título Financeiro na página dashboard", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByText("Financeiro")).toBeInTheDocument();
  });

  it("deve renderizar o título Página quando a rota não está mapeada", () => {
    (usePathname as jest.Mock).mockReturnValue("/rota-nao-mapeada");
    render(<Header />);
    expect(screen.getByText("Página")).toBeInTheDocument();
  });

  it("deve renderizar a data atual formatada", () => {
    render(<Header />);
    expect(screen.getByText("15 de março de 2024")).toBeInTheDocument();
  });

  it("deve renderizar o título Página quando pathname é null", () => {
    (usePathname as jest.Mock).mockReturnValue(null);
    render(<Header />);
    expect(screen.getByText("Página")).toBeInTheDocument();
  });

  it("deve renderizar o header com as classes corretas", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("header");
  });
});
