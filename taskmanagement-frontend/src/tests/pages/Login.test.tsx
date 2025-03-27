import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "@/pages/Login";
import { postLogin } from "@/api/usersApi";
import { toast } from "sonner";

// Mock dependencies
vi.mock("@/api/usersApi", () => ({
  postLogin: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

// Setup navigation mock
const navigateMock = vi.fn();

describe("Login Component", () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    localStorageMock.clear();

    // Reset all mocks
    vi.clearAllMocks();
  });

  it("renders login form with all expected elements", () => {
    render(<Login />);

    // Check title
    expect(screen.getByText("Log in to Your Account")).toBeInTheDocument();

    // Check inputs
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    // Check button
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

    // Check create account link
    expect(screen.getByText("Create Account Here")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it("validates email format and shows error for invalid email", async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");

    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("shows required error for empty email field", async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");

    // Focus and blur without entering text
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("shows required error for empty password field", async () => {
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText("Password");

    // Focus and blur without entering text
    fireEvent.focus(passwordInput);
    fireEvent.blur(passwordInput);

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("allows form submission when all fields are valid", async () => {
    // Mock successful login response
    const mockLoginResponse = {
      email: "test@example.com",
      access_token: "test-token",
    };
    (postLogin as any).mockResolvedValue(mockLoginResponse);

    render(<Login />);

    // Fill in form with valid data
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Verify API call was made
    await waitFor(() => {
      expect(postLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("makes API call with correct credentials", async () => {
    // Mock successful login
    (postLogin as any).mockResolvedValue({
      email: "test@example.com",
      access_token: "test-token",
    });

    render(<Login />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "secure-password" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check API was called with correct data
    await waitFor(() => {
      expect(postLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "secure-password",
      });
    });
  });

  it("stores token in localStorage, shows success message, and navigates on successful login", async () => {
    // Mock successful login
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    (postLogin as any).mockResolvedValue({
      email: "user@example.com",
      access_token: mockToken,
    });

    render(<Login />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Verify token was stored, toast was shown, and navigation occurred
    await waitFor(() => {
      expect(window.localStorage.getItem("token")).toBe(mockToken);
      expect(toast.success).toHaveBeenCalledWith("Login successfully");
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows error message when login fails", async () => {
    // Mock failed login
    (postLogin as any).mockRejectedValue(new Error("Login failed"));

    render(<Login />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong-password" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred. Please try again."
      );
    });
  });

  it("navigates to create account page when link is clicked", () => {
    // We'll need to mock the href setting behavior
    const hrefMock = { href: "" };

    // Save original location
    const originalLocation = window.location;

    // Mock location object
    Object.defineProperty(window, "location", {
      value: hrefMock,
      writable: true,
    });

    render(<Login />);

    // Get and click the create account link
    const createAccountLink = screen.getByText("Create Account Here");
    expect(createAccountLink.getAttribute("href")).toBe("/create-account");

    // Restore original location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("handles API errors gracefully", async () => {
    // Mock an error that would come from the API
    const networkError = new Error("Network error");
    (postLogin as any).mockRejectedValue(networkError);

    render(<Login />);

    // Fill and submit the form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Verify error toast is shown and no navigation happens
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred. Please try again."
      );
      expect(navigateMock).not.toHaveBeenCalled();
      expect(window.localStorage.getItem("token")).toBeNull();
    });
  });
});
