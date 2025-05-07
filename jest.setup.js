import "@testing-library/jest-dom";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

jest.mock("*.module.css", () => ({}));

jest.mock("../app/register/page.module.css", () => ({
  page: "page",
  form: "form",
  logo: "logo",
  header: "header",
  inputContainerMt: "inputContainerMt",
  recover: "recover",
  button: "button",
}));
