import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateAccount from "@/pages/CreateAccount";
import { postRegister } from "@/api/usersApi";
import { toast } from "sonner";

// Mock dependencies
vi.mock("@/api/usersApi", () => ({
  postRegister: vi.fn(),
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

describe("CreateAccount Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  // Rendering tests
  it("renders create account form with all expected elements", () => {
    render(<CreateAccount />);

    // Check title
    expect(screen.getByText("Create Your Account")).toBeInTheDocument();

    // Check inputs
    expect(
      screen.getByPlaceholderText("Your email address")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Create a password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();

    // Check button
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  // Form validation tests
  it("shows required error for empty email field", async () => {
    render(<CreateAccount />);

    const emailInput = screen.getByPlaceholderText("Your email address");

    // Focus and blur without entering text - wrapped in act
    await act(async () => {
      fireEvent.focus(emailInput);
      fireEvent.blur(emailInput);
    });

    // Check for validation error
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("validates email format and shows error for invalid email", async () => {
    render(<CreateAccount />);

    const emailInput = screen.getByPlaceholderText("Your email address");

    // Enter invalid email - wrapped in act
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);
    });

    // Check for validation error - using a more reliable approach
    const errorElements = document.querySelectorAll(".text-red-500.text-xs");
    expect(errorElements.length).toBeGreaterThan(0);
    expect(emailInput).toBeInTheDocument();
  });

  it("shows required error for empty password field", async () => {
    render(<CreateAccount />);

    const passwordInput = screen.getByPlaceholderText("Create a password");

    // Focus and blur without entering text - wrapped in act
    await act(async () => {
      fireEvent.focus(passwordInput);
      fireEvent.blur(passwordInput);
    });

    // Check for validation error
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("shows required error for empty confirm password field", async () => {
    render(<CreateAccount />);

    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );

    // Focus and blur without entering text - wrapped in act
    await act(async () => {
      fireEvent.focus(confirmPasswordInput);
      fireEvent.blur(confirmPasswordInput);
    });

    // Check for validation error
    expect(
      screen.getByText("Please confirm your password")
    ).toBeInTheDocument();
  });

  it("shows error when passwords don't match", async () => {
    render(<CreateAccount />);

    // Enter different passwords - wrapped in act
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Create a password"), {
        target: { value: "password123" },
      });

      fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
        target: { value: "differentpassword" },
      });

      // Blur to trigger validation
      fireEvent.blur(screen.getByPlaceholderText("Confirm your password"));
    });

    // Check for validation error
    expect(screen.getByText("Passwords must match")).toBeInTheDocument();
  });

  // Form submission and navigation tests
  it("submits form with valid data, shows success message and navigates to login page", async () => {
    // Mock successful registration
    (postRegister as any).mockResolvedValue({
      id: "123",
      email: "test@example.com",
    });

    render(<CreateAccount />);

    // Fill the form with valid data and submit - wrapped in act
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Your email address"), {
        target: { value: "test@example.com" },
      });

      fireEvent.change(screen.getByPlaceholderText("Create a password"), {
        target: { value: "password123" },
      });

      fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
        target: { value: "password123" },
      });

      // Submit the form
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    // Verify API call, success message and navigation
    await waitFor(() => {
      expect(postRegister).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully"
      );
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error message when registration fails", async () => {
    // Mock failed registration
    (postRegister as any).mockRejectedValue(new Error("Registration failed"));

    render(<CreateAccount />);

    // Fill the form with valid data and submit - wrapped in act
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Your email address"), {
        target: { value: "test@example.com" },
      });

      fireEvent.change(screen.getByPlaceholderText("Create a password"), {
        target: { value: "password123" },
      });

      fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
        target: { value: "password123" },
      });

      // Submit the form
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    // Check error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred. Please try again."
      );
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  // Interaction tests
  it("updates input values correctly when typed into", async () => {
    render(<CreateAccount />);

    const emailInput = screen.getByPlaceholderText("Your email address");
    const passwordInput = screen.getByPlaceholderText("Create a password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );

    // Type into fields - wrapped in act
    await act(async () => {
      // Type into email field
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    });
    expect(emailInput).toHaveValue("test@example.com");

    await act(async () => {
      // Type into password field
      fireEvent.change(passwordInput, { target: { value: "password123" } });
    });
    expect(passwordInput).toHaveValue("password123");

    await act(async () => {
      // Type into confirm password field
      fireEvent.change(confirmPasswordInput, {
        target: { value: "password123" },
      });
    });
    expect(confirmPasswordInput).toHaveValue("password123");
  });

  // ntegration tests
  it("passes correct data to postRegister API function", async () => {
    (postRegister as any).mockResolvedValue({
      id: "123",
      email: "user@example.com",
    });

    render(<CreateAccount />);

    // Fill form with test data and submit - wrapped in act
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Your email address"), {
        target: { value: "user@example.com" },
      });

      fireEvent.change(screen.getByPlaceholderText("Create a password"), {
        target: { value: "securepassword" },
      });

      fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
        target: { value: "securepassword" },
      });

      // Submit the form
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    // Verify API was called with correct parameters
    await waitFor(() => {
      expect(postRegister).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "securepassword",
        confirmPassword: "securepassword",
      });
    });
  });

  it("doesn't submit the form when validation fails", async () => {
    render(<CreateAccount />);

    // Submit without filling the form - wrapped in act
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    // Verify API was not called
    expect(postRegister).not.toHaveBeenCalled();
  });
});
