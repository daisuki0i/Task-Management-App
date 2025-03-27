import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import TaskCard from "@/components/task-card";
import { TaskStatus } from "@/lib/types";
import { updateTask, deleteTask } from "@/api/tasksApi";
import { toast } from "sonner";

// Mock dependencies
vi.mock("@/api/tasksApi", () => ({
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("TaskCard Component", () => {
  const defaultProps = {
    id: "task-123",
    title: "Test Task",
    description: "This is a test task description",
    status: "pending" as TaskStatus,
    userId: "user-456",
    onTaskSaved: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Rendering Tests
  it("renders without crashing", () => {
    render(<TaskCard {...defaultProps} />);
    // If this test passes, the component renders successfully
  });

  it("displays task title correctly", () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("displays task description correctly", () => {
    render(<TaskCard {...defaultProps} />);
    expect(
      screen.getByText("This is a test task description")
    ).toBeInTheDocument();
  });

  it("dialog doesn't appear initially", () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.queryByText("Edit Task")).not.toBeInTheDocument();
  });

  it("opens dialog when card is clicked", async () => {
    const user = userEvent.setup();
    render(<TaskCard {...defaultProps} />);

    // Click on the card
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Check dialog appears with correct title
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  // Form Field Tests
  it("form fields are populated with correct initial values", async () => {
    const user = userEvent.setup();
    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Check initial values
    expect(screen.getByLabelText("Name")).toHaveValue("Test Task");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "This is a test task description"
    );

    // For the Select component, we need to target the specific element
    // Use a more specific selector to find the select value element
    const selectValueElement = screen.getByText("Pending", {
      selector: '[data-slot="select-value"]',
    });
    expect(selectValueElement).toBeInTheDocument();
  });

  it("shows validation error when title is cleared", async () => {
    const user = userEvent.setup();
    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Clear the title field
    const titleInput = screen.getByLabelText("Name");
    await user.clear(titleInput);
    await user.tab(); // Move focus to trigger blur event

    // Check validation error appears
    expect(screen.getByText("Title is required")).toBeInTheDocument();
  });

  // Form Interaction Tests
  it("updates form state when typing in title field", async () => {
    const user = userEvent.setup();
    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Type in the title field
    const titleInput = screen.getByLabelText("Name");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Task Title");

    // Check updated value
    expect(titleInput).toHaveValue("Updated Task Title");
  });

  it("updates form state when typing in description field", async () => {
    const user = userEvent.setup();
    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Type in the description field
    const descriptionInput = screen.getByLabelText("Description");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");

    // Check updated value
    expect(descriptionInput).toHaveValue("Updated description");
  });

  // API Interaction Tests
  it("calls updateTask with correct parameters when form is submitted", async () => {
    const user = userEvent.setup();
    (updateTask as any).mockResolvedValue({
      id: "task-123",
      title: "Updated Task",
      description: "Updated description",
      status: "in_progress",
    });

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Update form fields
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated Task");

    await user.clear(screen.getByLabelText("Description"));
    await user.type(
      screen.getByLabelText("Description"),
      "Updated description"
    );

    // Can't directly test Select change due to its complex structure
    // Assuming the status stays the same for this test

    // Submit the form
    await user.click(screen.getByText("Save Changes"));

    // Verify updateTask was called with correct data
    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith("task-123", {
        title: "Updated Task",
        description: "Updated description",
        status: "pending",
      });
    });
  });

  it("calls deleteTask with correct task ID when delete button is clicked", async () => {
    const user = userEvent.setup();
    (deleteTask as any).mockResolvedValue(true);

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Click delete button
    await user.click(screen.getByText("Delete Task"));

    // Verify deleteTask was called with correct ID
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith("task-123");
    });
  });

  it("shows success toast and calls onTaskSaved when task update succeeds", async () => {
    const user = userEvent.setup();
    (updateTask as any).mockResolvedValue({
      id: "task-123",
      title: "Test Task",
      description: "This is a test task description",
      status: "pending",
    });

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Submit the form without changing anything
    await user.click(screen.getByText("Save Changes"));

    // Verify success toast was shown and callback was called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Task updated successfully");
      expect(defaultProps.onTaskSaved).toHaveBeenCalledTimes(1);
    });
  });

  it("shows error toast when task update fails", async () => {
    const user = userEvent.setup();
    (updateTask as any).mockRejectedValue(new Error("Update failed"));

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Submit the form
    await user.click(screen.getByText("Save Changes"));

    // Verify error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to update task. Please try again."
      );
      expect(defaultProps.onTaskSaved).not.toHaveBeenCalled();
    });
  });

  it("shows success toast and calls onTaskSaved when task deletion succeeds", async () => {
    const user = userEvent.setup();
    (deleteTask as any).mockResolvedValue(true);

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Click delete button
    await user.click(screen.getByText("Delete Task"));

    // Verify success toast was shown and callback was called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Task deleted successfully");
      expect(defaultProps.onTaskSaved).toHaveBeenCalledTimes(1);
    });
  });

  it("shows error toast when task deletion fails", async () => {
    const user = userEvent.setup();
    (deleteTask as any).mockRejectedValue(new Error("Deletion failed"));

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Click delete button
    await user.click(screen.getByText("Delete Task"));

    // Verify error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete task. Please try again."
      );
      expect(defaultProps.onTaskSaved).not.toHaveBeenCalled();
    });
  });

  // Dialog Behavior Tests
  it("closes dialog after successful task update", async () => {
    const user = userEvent.setup();
    (updateTask as any).mockResolvedValue({
      id: "task-123",
      title: "Test Task",
      description: "This is a test task description",
      status: "pending",
    });

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Submit the form
    await user.click(screen.getByText("Save Changes"));

    // Verify dialog closes
    await waitFor(() => {
      expect(screen.queryByText("Edit Task")).not.toBeInTheDocument();
    });
  });

  it("closes dialog after successful task deletion", async () => {
    const user = userEvent.setup();
    (deleteTask as any).mockResolvedValue(true);

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Click delete button
    await user.click(screen.getByText("Delete Task"));

    // Verify dialog closes
    await waitFor(() => {
      expect(screen.queryByText("Edit Task")).not.toBeInTheDocument();
    });
  });

  it("dialog remains open when task update fails", async () => {
    const user = userEvent.setup();
    (updateTask as any).mockRejectedValue(new Error("Update failed"));

    render(<TaskCard {...defaultProps} />);

    // Open the dialog
    await user.click(screen.getByText("Test Task").closest(".cursor-pointer")!);

    // Submit the form
    await user.click(screen.getByText("Save Changes"));

    // Verify dialog remains open
    await waitFor(() => {
      expect(screen.getByText("Edit Task")).toBeInTheDocument();
    });
  });
});
