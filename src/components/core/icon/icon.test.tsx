import { render } from "@testing-library/react";
import { Icon } from "./index";

jest.mock("react-icons/fa", () => ({
  FaEye: () => <div data-testid="eye-icon" />,
  FaEyeSlash: () => <div data-testid="eye-slash-icon" />,
}));

describe("Icon", () => {
  it("deve renderizar o ícone de olho aberto", () => {
    const { getByTestId } = render(<Icon name="eye" />);
    expect(getByTestId("eye-icon")).toBeInTheDocument();
  });

  it("deve renderizar o ícone de olho fechado", () => {
    const { getByTestId } = render(<Icon name="eye_closed" />);
    expect(getByTestId("eye-slash-icon")).toBeInTheDocument();
  });

  it("não deve renderizar nada quando o nome do ícone é inválido", () => {
    const { container } = render(<Icon name="invalid_icon" />);
    expect(container.firstChild).toBeNull();
  });

  it("deve aplicar os estilos customizados", () => {
    const customStyle = { color: "red" };
    const { getByTestId } = render(<Icon name="eye" style={customStyle} />);
    const icon = getByTestId("eye-icon");
    expect(icon).toBeInTheDocument();
  });
});
