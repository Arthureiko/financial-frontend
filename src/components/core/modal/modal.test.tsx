import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "./index";

describe("Modal", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    title: "Test Modal",
    content: "Test Content",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não deve renderizar quando open é false", () => {
    render(<Modal {...defaultProps} open={false} />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("deve renderizar quando open é true", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("deve chamar onClose quando o botão de fechar é clicado", () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole("button", { name: "Fechar" });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("deve chamar onClose quando o overlay é clicado", () => {
    render(<Modal {...defaultProps} />);
    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("não deve chamar onClose quando o modal é clicado", () => {
    render(<Modal {...defaultProps} />);
    const modal = screen.getByTestId("modal");
    const overlay = screen.getByTestId("modal-overlay");

    fireEvent.click(modal);
    expect(defaultProps.onClose).not.toHaveBeenCalled();

    // Verificar se o evento não se propagou para o overlay
    expect(overlay).toBeInTheDocument();
  });

  it("deve renderizar com a variante success por padrão", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
  });

  it("deve renderizar com a variante danger quando especificada", () => {
    render(<Modal {...defaultProps} variant="danger" />);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
  });

  it("deve renderizar o overlay corretamente", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
  });
});
