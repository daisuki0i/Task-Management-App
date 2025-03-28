import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// Remove userEvent import since we're not clicking anymore
import TaskDashboard from "@/pages/App";
import { getTasks } from "@/api/tasksApi";
import { toast } from "sonner";
import userEvent from "@testing-library/user-event";

// Mock dependencies
vi.mock("@/api/tasksApi", () => ({
  getTasks: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/task-column", () => ({
  default: vi.fn(({ title, status, tasks, bgColor, dotColor, onTaskSaved }) => (
    <div
      data-testid={`task-column-${status}`}
      data-title={title}
      data-status={status}
      data-bg-color={bgColor}
      data-dot-color={dotColor}
      data-task-count={tasks.length}
    >
      Task Column
      <button data-testid={`callback-test-${status}`} onClick={onTaskSaved}>
        Test Callback
      </button>
    </div>
  )),
}));

// Mock data
const mockTasks = [
  {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    status: "pending",
    userId: "user1",
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description 2",
    status: "in_progress",
    userId: "user1",
  },
  {
    id: "3",
    title: "Task 3",
    description: "Description 3",
    status: "completed",
    userId: "user1",
  },
  {
    id: "4",
    title: "Task 4",
    description: "Description 4",
    status: "pending",
    userId: "user1",
  },
];

describe("TaskDashboard Component", () => {
  // Setup window location mock
  const originalLocation = window.location;
  let locationMock: { href: string };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock successful API response by default
    (getTasks as Mock).mockResolvedValue(mockTasks);

    // Create mockable location object
    locationMock = { href: window.location.href };

    // Define a custom getter/setter for window.location
    Object.defineProperty(window, "location", {
      configurable: true,
      value: locationMock,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
      writable: true,
    });
  });

  // 1. Component Rendering Tests
  it("renders without crashing", () => {
    render(<TaskDashboard />);
    // If this test passes without throwing an error, the component renders successfully
  });

  it("displays the logout link correctly", async () => {
    render(<TaskDashboard />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });
  });

  it("renders exactly 3 TaskColumn components", async () => {
    render(<TaskDashboard />);

    // Wait for the component to fetch tasks and render columns
    await waitFor(() => {
      const columns = screen.getAllByTestId(/task-column-/);
      expect(columns.length).toBe(3);
    });
  });

  it("renders columns with correct props", async () => {
    render(<TaskDashboard />);

    await waitFor(() => {
      // Check pending column props
      const pendingColumn = screen.getByTestId("task-column-pending");
      expect(pendingColumn).toHaveAttribute("data-title", "Pending");
      expect(pendingColumn).toHaveAttribute("data-bg-color", "bg-[#E5E4E1]");
      expect(pendingColumn).toHaveAttribute("data-dot-color", "bg-[#878583]");

      // Check in_progress column props
      const inProgressColumn = screen.getByTestId("task-column-in_progress");
      expect(inProgressColumn).toHaveAttribute("data-title", "In Progress");
      expect(inProgressColumn).toHaveAttribute("data-bg-color", "bg-[#F8E6BA]");
      expect(inProgressColumn).toHaveAttribute(
        "data-dot-color",
        "bg-[#CA9132]"
      );

      // Check completed column props
      const completedColumn = screen.getByTestId("task-column-completed");
      expect(completedColumn).toHaveAttribute("data-title", "Completed");
      expect(completedColumn).toHaveAttribute("data-bg-color", "bg-[#DCEBDD]");
      expect(completedColumn).toHaveAttribute("data-dot-color", "bg-[#5F9772]");
    });
  });

  // 2. Data Fetching Tests
  it("calls getTasks when component mounts", () => {
    render(<TaskDashboard />);
    expect(getTasks).toHaveBeenCalledTimes(1);
  });

  it("updates tasks state correctly when data is fetched successfully", async () => {
    render(<TaskDashboard />);

    await waitFor(() => {
      // Check that tasks are distributed correctly to columns
      const pendingColumn = screen.getByTestId("task-column-pending");
      const inProgressColumn = screen.getByTestId("task-column-in_progress");
      const completedColumn = screen.getByTestId("task-column-completed");

      // We expect 2 pending tasks, 1 in_progress task, and 1 completed task
      expect(pendingColumn).toHaveAttribute("data-task-count", "2");
      expect(inProgressColumn).toHaveAttribute("data-task-count", "1");
      expect(completedColumn).toHaveAttribute("data-task-count", "1");
    });
  });

  it("displays error toast when getTasks fails", async () => {
    // Mock API error
    (getTasks as Mock).mockRejectedValueOnce(
      new Error("Failed to fetch tasks")
    );

    render(<TaskDashboard />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred while fetching tasks"
      );
    });
  });

  // 3. Task Filtering Tests
  it("filters tasks correctly by status", async () => {
    render(<TaskDashboard />);

    await waitFor(() => {
      // Verify filtered tasks by checking task count in each column
      const pendingColumn = screen.getByTestId("task-column-pending");
      expect(pendingColumn).toHaveAttribute("data-task-count", "2"); // 2 pending tasks

      const inProgressColumn = screen.getByTestId("task-column-in_progress");
      expect(inProgressColumn).toHaveAttribute("data-task-count", "1"); // 1 in_progress task

      const completedColumn = screen.getByTestId("task-column-completed");
      expect(completedColumn).toHaveAttribute("data-task-count", "1"); // 1 completed task
    });
  });

  // User Interaction Tests
  it("has logout button links to /login'", async () => {
    render(<TaskDashboard />);

    await waitFor(() => {
      const logoutButton = screen.getByRole("button", { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();

      // Simulate click
      userEvent.click(logoutButton);
      expect(window.location.href).toContain("/login");
    });
  });

  // Column Config Tests
  it("has correct column configurations", async () => {
    render(<TaskDashboard />);

    await waitFor(() => {
      const pendingColumn = screen.getByTestId("task-column-pending");
      const inProgressColumn = screen.getByTestId("task-column-in_progress");
      const completedColumn = screen.getByTestId("task-column-completed");

      // Check Pending column config
      expect(pendingColumn).toHaveAttribute("data-title", "Pending");
      expect(pendingColumn).toHaveAttribute("data-status", "pending");
      expect(pendingColumn).toHaveAttribute("data-bg-color", "bg-[#E5E4E1]");
      expect(pendingColumn).toHaveAttribute("data-dot-color", "bg-[#878583]");

      // Check In Progress column config
      expect(inProgressColumn).toHaveAttribute("data-title", "In Progress");
      expect(inProgressColumn).toHaveAttribute("data-status", "in_progress");
      expect(inProgressColumn).toHaveAttribute("data-bg-color", "bg-[#F8E6BA]");
      expect(inProgressColumn).toHaveAttribute(
        "data-dot-color",
        "bg-[#CA9132]"
      );

      // Check Completed column config
      expect(completedColumn).toHaveAttribute("data-title", "Completed");
      expect(completedColumn).toHaveAttribute("data-status", "completed");
      expect(completedColumn).toHaveAttribute("data-bg-color", "bg-[#DCEBDD]");
      expect(completedColumn).toHaveAttribute("data-dot-color", "bg-[#5F9772]");
    });
  });

  // 7. Callback Tests
  it("passes fetchTasks as onTaskSaved callback to TaskColumn components", async () => {
    render(<TaskDashboard />);

    // Clear previous calls to verify the callback triggers a new call
    vi.clearAllMocks();

    // Find and click a callback test button in any of the columns
    const callbackTestButton = await screen.findByTestId(
      "callback-test-pending"
    );
    await userEvent.click(callbackTestButton);

    // Verify getTasks is called when the callback is triggered
    expect(getTasks).toHaveBeenCalledTimes(1);
  });
});
