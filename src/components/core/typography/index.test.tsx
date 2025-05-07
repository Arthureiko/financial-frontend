import React from "react";
import { render, screen } from "@testing-library/react";
import { Typography } from "./index";

describe("Typography", () => {
  it("deve renderizar o texto corretamente", () => {
    render(<Typography>Texto de teste</Typography>);
    expect(screen.getByText("Texto de teste")).toBeInTheDocument();
  });

  it("deve aplicar a variante h1 corretamente", () => {
    render(<Typography variant="h1">Título H1</Typography>);
    const element = screen.getByText("Título H1");
    expect(element.tagName).toBe("H1");
    expect(element).toHaveStyle({
      fontSize: "2rem",
      fontWeight: "bold",
    });
  });

  it("deve aplicar estilos personalizados", () => {
    render(
      <Typography
        variant="body"
        size={1.5}
        weight={600}
        color="#FF0000"
        style={{ textAlign: "center" }}
      >
        Texto personalizado
      </Typography>,
    );
    const element = screen.getByText("Texto personalizado");
    expect(element).toHaveStyle({
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#FF0000",
      textAlign: "center",
    });
  });

  it("deve usar a variante body como padrão", () => {
    render(<Typography>Texto padrão</Typography>);
    const element = screen.getByText("Texto padrão");
    expect(element.tagName).toBe("P");
    expect(element).toHaveStyle({
      fontSize: "1rem",
      fontWeight: "normal",
    });
  });
});
