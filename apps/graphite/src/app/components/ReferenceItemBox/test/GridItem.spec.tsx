import { render, screen, act } from "@testing-library/react";
import GridItemText from "../GridItem";
 
describe("GridItemText", () => {
  const defaultProps = {
    text: "Sample Text",
    isFavourite: false,
    isEditable: false,
    key: "test-key",
  };
 
  it("renders with text and without favorite", () => {
    act(() => {
      render(<GridItemText {...defaultProps} />);
    });
 
    expect(screen.getByText("Sample Text")).toBeTruthy();
    expect(screen.queryByTestId("favorite-solid-icon")).toBeNull();
    // expect(screen.queryByTestId("favorite-icon")).toBeTruthy();
    expect(screen.queryByTestId("edit-icon")).toBeNull();
  });
 
//   it("renders with text and favorite icon when isFavourite is true", () => {
//     act(() => {
//       render(<GridItemText {...defaultProps} isFavourite={true} />);
//     });
 
//     expect(screen.getByText("Sample Text")).toBeTruthy();
//     expect(screen.queryByTestId("favorite-solid-icon")).toBeTruthy();
//     expect(screen.queryByTestId("favorite-icon")).toBeNull();
//   });
 
//   it("renders with edit icon when isEditable is true", () => {
//     act(() => {
//       render(<GridItemText {...defaultProps} isEditable={true} />);
//     });
 
//     expect(screen.getByText("Sample Text")).toBeTruthy();
//     expect(screen.queryByTestId("edit-icon")).toBeTruthy();
//   });
 
//   it("renders with both edit and favorite icons when both flags are true", () => {
//     act(() => {
//       render(
//         <GridItemText {...defaultProps} isFavourite={true} isEditable={true} />
//       );
//     });
 
//     expect(screen.getByText("Sample Text")).toBeTruthy();
//     expect(screen.queryByTestId("edit-icon")).toBeTruthy();
//     expect(screen.queryByTestId("favorite-solid-icon")).toBeTruthy();
//   });
 
//   it("renders with divider", () => {
//     act(() => {
//       render(<GridItemText {...defaultProps} />);
//     });
//     expect(screen.getByTestId("grid-item-divider")).toBeTruthy();
//   });
 
//   it("applies correct CSS classes", () => {
//     act(() => {
//       render(<GridItemText {...defaultProps} />);
//     });
 
//     expect(screen.getByTestId("grid-item-container")).toBeTruthy();
//     expect(screen.getByTestId("grid-item-text")).toBeTruthy();
//   });

  it("renders without crashing", () => {
    act(() => {
      render(<GridItemText {...defaultProps} />);
    });

    expect(screen.getByText("Sample Text")).toBeTruthy();
  });
});