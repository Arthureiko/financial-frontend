import { render } from "@testing-library/react";
import RegisterLayout, { metadata } from "../layout";

describe("RegisterLayout", () => {
  it("deve renderizar o layout corretamente", () => {
    const { container } = render(
      <RegisterLayout>
        <div>Conteúdo de teste</div>
      </RegisterLayout>,
    );
    expect(container).toBeInTheDocument();
  });

  it("deve ter os metadados corretos", () => {
    expect(metadata.title).toBe("Cadastro de conta");
    expect(metadata.description).toBe(
      "Realize transferência de saldo e depósito.",
    );
    expect(metadata.robots).toEqual({
      index: false,
      follow: true,
      nocache: true,
    });
  });
});
