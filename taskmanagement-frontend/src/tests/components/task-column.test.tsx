import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import TaskColumn from "@/components/task-column";
import { Task, TaskStatus } from "@/lib/types";

// Mock child components
vi.mock("@/components/add-task-button", () => ({
  default: vi.fn(({ status, onTaskSaved }) => (
    <button
      data-testid="add-task-button"
      data-status={status}
      onClick={onTaskSaved}
    >
      + New Task
    </button>
  )),
}));

vi.mock("@/components/task-card", () => ({
  default: vi.fn((props) => (
    <div
      data-testid={`task-card-${props.id}`}
      data-title={props.title}
      data-description={props.description}
      data-status={props.status}
    >
      <span>{props.title}</span>
      <button onClick={props.onTaskSaved}>Save</button>
    </div>
  )),
}));

// Test data
const mockTasks: Task[] = [
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
    status: "pending",
    userId: "user1",
  },
];

describe("TaskColumn Component", () => {
  const defaultProps = {
    title: "Pending Tasks",
    status: "pending" as TaskStatus,
    tasks: mockTasks,
    bgColor: "bg-gray-200",
    dotColor: "bg-gray-600",
    onTaskSaved: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Rendering Tests
  it("renders without crashing", () => {
    render(<TaskColumn {...defaultProps} />);
    // If this passes, the component renders without error
  });

  it("renders the column title correctly", () => {
    render(<TaskColumn {...defaultProps} />);
    expect(screen.getByText("Pending Tasks")).toBeInTheDocument();
  });

  it("applies the correct background color", () => {
    render(<TaskColumn {...defaultProps} />);
    const headerElement = screen.getByText("Pending Tasks").closest("div");
    expect(headerElement).toHaveClass("bg-gray-200");
  });

  it("renders the status dot with correct color", () => {
    render(<TaskColumn {...defaultProps} />);
    const statusDot = screen.getByText("Pending Tasks").previousSibling;
    expect(statusDot).toHaveClass("bg-gray-600");
  });

  it("renders AddTaskButton component", () => {
    render(<TaskColumn {...defaultProps} />);
    expect(screen.getByTestId("add-task-button")).toBeInTheDocument();
  });

  // 2. Task Rendering Tests
  it("renders no TaskCard when no tasks are provided", () => {
    render(<TaskColumn {...defaultProps} tasks={[]} />);
    expect(screen.queryByTestId(/task-card-/)).not.toBeInTheDocument();
  });

  it("renders correct number of TaskCard components", () => {
    render(<TaskColumn {...defaultProps} />);
    const taskCards = screen.getAllByTestId(/task-card-/);
    expect(taskCards.length).toBe(2);
  });

  it("renders TaskCards with correct props", () => {
    render(<TaskColumn {...defaultProps} />);

    // Check first task
    const taskCard1 = screen.getByTestId("task-card-1");
    expect(taskCard1).toHaveAttribute("data-title", "Task 1");
    expect(taskCard1).toHaveAttribute("data-description", "Description 1");
    expect(taskCard1).toHaveAttribute("data-status", "pending");

    // Check second task
    const taskCard2 = screen.getByTestId("task-card-2");
    expect(taskCard2).toHaveAttribute("data-title", "Task 2");
    expect(taskCard2).toHaveAttribute("data-description", "Description 2");
    expect(taskCard2).toHaveAttribute("data-status", "pending");
  });

  // 3. Props Tests
  it("passes correct status to AddTaskButton", () => {
    const inProgressProps = {
      ...defaultProps,
      status: "in_progress" as TaskStatus,
    };

    render(<TaskColumn {...inProgressProps} />);
    expect(screen.getByTestId("add-task-button")).toHaveAttribute(
      "data-status",
      "in_progress"
    );
  });

  // 4. Layout Tests
  it("uses flex column layout with center alignment", () => {
    const { container } = render(<TaskColumn {...defaultProps} />);
    const columnContainer = container.firstChild;
    expect(columnContainer).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "gap-4"
    );
  });

  // 5. Callback Tests
  it("passes onTaskSaved callback to AddTaskButton", async () => {
    const user = userEvent.setup();
    render(<TaskColumn {...defaultProps} />);

    const addTaskButton = screen.getByTestId("add-task-button");
    await user.click(addTaskButton);

    expect(defaultProps.onTaskSaved).toHaveBeenCalledTimes(1);
  });

  it("passes onTaskSaved callback to each TaskCard", async () => {
    const user = userEvent.setup();
    render(<TaskColumn {...defaultProps} />);

    // Find and click save button in first task card
    const saveButton = screen.getAllByText("Save")[0];
    await user.click(saveButton);

    expect(defaultProps.onTaskSaved).toHaveBeenCalledTimes(1);
  });

  // 6. Integration Tests
  it("triggers parent callback when child components call onTaskSaved", async () => {
    const mockCallback = vi.fn();
    const user = userEvent.setup();

    render(<TaskColumn {...defaultProps} onTaskSaved={mockCallback} />);

    // Click the add task button
    await user.click(screen.getByTestId("add-task-button"));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Click save on first task card
    await user.click(screen.getAllByText("Save")[0]);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
