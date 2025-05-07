import { render, screen } from "@testing-library/react";
import Layout, { metadata, viewport } from "../layout";

jest.mock("@/components/core/Sidebar", () => ({
  Sidebar: () => <div data-testid="mock-sidebar">Sidebar</div>,
}));

describe("Dashboard Layout", () => {
  it("deve renderizar o layout com todos os componentes", () => {
    render(
      <Layout>
        <div data-testid="mock-children">Conteúdo</div>
      </Layout>,
    );

    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-children")).toBeInTheDocument();
  });

  it("deve ter os metadados corretos", () => {
    expect(metadata.title).toBe("Dashboard");
    expect(metadata.description).toBe("Dashboard financeiro.");
    expect(metadata.robots).toEqual({
      index: false,
      follow: true,
      nocache: true,
    });
  });

  it("deve ter as configurações de viewport corretas", () => {
    expect(viewport).toEqual({
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    });
  });
});
