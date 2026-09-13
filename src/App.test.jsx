import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows the login screen", () => {
  render(<App initialToken={null} bootError={null} />);
  expect(screen.getByRole("heading", { name: /keep the songs/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /continue with spotify/i })).toBeInTheDocument();
});
