import { render, screen } from "@testing-library/react";
import { Button } from "./index";

describe("Button", () => {
  it("deve renderizar o botão com texto", () => {
    render(<Button>Teste</Button>);
    expect(screen.getByText("Teste")).toBeInTheDocument();
  });

  it("deve renderizar com a variante container por padrão", () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "container");
  });

  it("deve renderizar com a variante outline", () => {
    render(<Button variant="outline">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "outline");
  });

  it("deve renderizar com a variante text", () => {
    render(<Button variant="text">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "text");
  });

  it("deve renderizar com a variante back", () => {
    render(<Button variant="back">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "back");
  });

  it("deve renderizar o botão com ícone à esquerda", () => {
    const LeftIcon = () => <span data-testid="left-icon">Icon</span>;
    render(<Button leftIcon={<LeftIcon />}>Teste</Button>);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("deve renderizar o botão com ícone à direita", () => {
    const RightIcon = () => <span data-testid="right-icon">Icon</span>;
    render(<Button rightIcon={<RightIcon />}>Teste</Button>);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("deve renderizar o botão com texto de carregamento", () => {
    render(<Button loading>Teste</Button>);
    expect(screen.getByText("Carregando..")).toBeInTheDocument();
  });

  it("deve renderizar o botão com texto de carregamento personalizado", () => {
    render(
      <Button loading loadingText="Processando...">
        Teste
      </Button>,
    );
    expect(screen.getByText("Processando...")).toBeInTheDocument();
  });

  it("deve aplicar estilos customizados", () => {
    const customStyle = { backgroundColor: "red", color: "white" };
    const { container } = render(<Button style={customStyle}>Teste</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveStyle(customStyle);
  });

  it("deve aplicar width customizado", () => {
    const { container } = render(<Button width="200px">Teste</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveStyle({ "--button-width": "200px" });
  });

  it("deve aplicar cor de texto customizada", () => {
    const { container } = render(<Button textColor="red">Teste</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveStyle({ "--button-text-color": "red" });
  });

  it("deve aplicar cor de fundo customizada", () => {
    const { container } = render(<Button backgroundColor="blue">Teste</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveStyle({ "--button-background-color": "blue" });
  });

  it("deve aplicar tamanho de fonte customizado", () => {
    const { container } = render(<Button fontSize="20px">Teste</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveStyle({ "--button-font-size": "20px" });
  });
});
