import { render, screen } from "@testing-library/react";
import Page from "../page";

jest.mock("@/components/core/Header", () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

jest.mock(
  "@/components/operations/FinancialOperations/FinancialOperations",
  () => ({
    FinancialOperations: () => (
      <div data-testid="mock-financial-operations">Financial Operations</div>
    ),
  }),
);

describe("Dashboard Page", () => {
  it("should render the page with all components", () => {
    render(<Page />);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-financial-operations")).toBeInTheDocument();
  });
});
