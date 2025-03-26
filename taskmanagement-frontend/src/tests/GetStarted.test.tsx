import GetStarted from "@/pages/GetStarted";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';


describe("GetStarted Component", () => {
  // Setup and cleanup location mock
  const originalLocation = window.location;
  let locationMock: { href: string };

  beforeEach(() => {
    // Create a mockable location object
    locationMock = { href: window.location.href };
    
    // Define a custom getter/setter for window.location.href
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: locationMock,
      writable: true
    });
  });

  // Restore original location after tests
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
      writable: true
    });
  });

  it('renders "Get Started" button', () => {
    render(<GetStarted />);
    
    // Find the "Get Started" button using a more reliable query
    const button = screen.getByText('Get Started');
    
    // Verify it appears in the document
    expect(button).toBeInTheDocument();
  });

  it('navigates to /login when "Get Started" button is clicked', () => {
    render(<GetStarted />);
    
    // Find and click the "Get Started" button using text content
    const button = screen.getByText('Get Started');
    fireEvent.click(button);

    // Check if the navigation to login page occurred
    expect(window.location.href).toBe('/login');
  });
});

