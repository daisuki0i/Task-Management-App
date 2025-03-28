import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import AddTaskButton from "@/components/add-task-button";
import { TaskStatus } from "@/lib/types";
import { createTask } from "@/api/tasksApi";
import { toast } from "sonner";

// Mock dependencies
vi.mock("@/api/tasksApi", () => ({
  createTask: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AddTaskButton Component", () => {
  const defaultProps = {
    status: "pending" as TaskStatus,
    onTaskSaved: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Rendering Tests
  it("renders without crashing", () => {
    render(<AddTaskButton {...defaultProps} />);
    // If this test passes without throwing an error, the component renders successfully
  });

  it("shows '+ New Task' button text", () => {
    render(<AddTaskButton {...defaultProps} />);
    expect(screen.getByText("+ New Task")).toBeInTheDocument();
  });

  it("dialog doesn't appear initially", () => {
    render(<AddTaskButton {...defaultProps} />);
    expect(screen.queryByText("New Task")).not.toBeInTheDocument();
  });

  it("opens dialog when button is clicked", async () => {
    const user = userEvent.setup();
    render(<AddTaskButton {...defaultProps} />);

    // Click the button to open dialog
    await user.click(screen.getByText("+ New Task"));

    // Check dialog appears with correct title
    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("renders form with all required fields", async () => {
    const user = userEvent.setup();
    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Check for all form elements
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Task Status")).toBeInTheDocument();
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("shows status field as read-only with passed status", async () => {
    const user = userEvent.setup();
    const customProps = {
      ...defaultProps,
      status: "in_progress" as TaskStatus,
    };

    render(<AddTaskButton {...customProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Check status field
    const statusField = screen.getByLabelText("Task Status");
    expect(statusField).toHaveValue("in_progress");
    expect(statusField).toHaveAttribute("readOnly");
    expect(statusField).toHaveClass("bg-gray-100");
    expect(statusField).toHaveClass("cursor-not-allowed");
  });

  // Form Validation Tests
  it("shows validation errors when form is submitted empty", async () => {
    const user = userEvent.setup();
    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Submit empty form
    await user.click(screen.getByText("Add Task"));

    // Check for validation errors
    expect(screen.getByText("Task name is required")).toBeInTheDocument();
  });

  it("removes validation errors when fields are properly filled", async () => {
    const user = userEvent.setup();
    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Submit empty form to trigger errors
    await user.click(screen.getByText("Add Task"));

    // Fill the fields
    await user.type(screen.getByLabelText("Name"), "New Task Title");
    await user.type(screen.getByLabelText("Description"), "Task Description");

    // Check that errors are gone
    expect(screen.queryByText("Task name is required")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Description is required")
    ).not.toBeInTheDocument();
  });

  // Form Interaction Tests
  it("updates form state when typing in fields", async () => {
    const user = userEvent.setup();
    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Type in the fields
    await user.type(screen.getByLabelText("Name"), "Test Task");
    await user.type(screen.getByLabelText("Description"), "Test Description");

    // Check field values
    expect(screen.getByLabelText("Name")).toHaveValue("Test Task");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Test Description"
    );
  });

  // API Interaction Tests
  it("calls createTask with correct data when form is submitted", async () => {
    const user = userEvent.setup();
    (createTask as any).mockResolvedValue({
      id: "123",
      title: "Test Task",
      description: "Test Description",
      status: "pending",
    });

    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Fill the form
    await user.type(screen.getByLabelText("Name"), "Test Task");
    await user.type(screen.getByLabelText("Description"), "Test Description");

    // Submit the form
    await user.click(screen.getByText("Add Task"));

    // Verify createTask was called with correct data
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
      });
    });
  });

  it("shows success toast when task creation succeeds", async () => {
    const user = userEvent.setup();
    (createTask as any).mockResolvedValue({
      id: "123",
      title: "Test Task",
      description: "Test Description",
      status: "pending",
    });

    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Fill and submit the form
    await user.type(screen.getByLabelText("Name"), "Test Task");
    await user.type(screen.getByLabelText("Description"), "Test Description");
    await user.click(screen.getByText("Add Task"));

    // Verify success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Task created successfully");
    });
  });

  it("shows error toast when task creation fails", async () => {
    const user = userEvent.setup();
    (createTask as any).mockRejectedValue(new Error("Creation failed"));

    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Fill and submit the form
    await user.type(screen.getByLabelText("Name"), "Test Task");
    await user.type(screen.getByLabelText("Description"), "Test Description");
    await user.click(screen.getByText("Add Task"));

    // Verify error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred. Please try again."
      );
    });
  });

  it("calls onTaskSaved callback after successful task creation", async () => {
    const user = userEvent.setup();
    (createTask as any).mockResolvedValue({
      id: "123",
      title: "Test Task",
      description: "Test Description",
      status: "pending",
    });

    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Fill and submit the form
    await user.type(screen.getByLabelText("Name"), "Test Task");
    await user.type(screen.getByLabelText("Description"), "Test Description");
    await user.click(screen.getByText("Add Task"));

    // Verify callback
    await waitFor(() => {
      expect(defaultProps.onTaskSaved).toHaveBeenCalledTimes(1);
    });
  });

  it("resets form and closes dialog after successful submission", async () => {
    const user = userEvent.setup();
    (createTask as any).mockResolvedValue({
      id: "123",
      title: "Test Task",
      description: "Test Description",
      status: "pending",
    });

    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Fill and submit the form
    await user.type(screen.getByLabelText("Name"), "Test Task");
    await user.type(screen.getByLabelText("Description"), "Test Description");
    await user.click(screen.getByText("Add Task"));

    // Verify dialog closes
    await waitFor(() => {
      expect(screen.queryByText("New Task")).not.toBeInTheDocument();
    });

    // Re-open to check form is reset
    await user.click(screen.getByText("+ New Task"));

    // Fields should be empty
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
  });

  // Edge cases
  it("handles different TaskStatus values correctly", async () => {
    const user = userEvent.setup();
    const completedProps = {
      ...defaultProps,
      status: "completed" as TaskStatus,
    };

    render(<AddTaskButton {...completedProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Verify status is correctly displayed
    expect(screen.getByLabelText("Task Status")).toHaveValue("completed");
  });

  it("does not call API if form validation fails", async () => {
    const user = userEvent.setup();
    render(<AddTaskButton {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("+ New Task"));

    // Submit without filling
    await user.click(screen.getByText("Add Task"));

    // Verify API not called
    expect(createTask).not.toHaveBeenCalled();
  });
});
