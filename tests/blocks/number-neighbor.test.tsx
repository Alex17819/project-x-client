import React from "react";
import { NumberNeighbor } from "@/components/blocks";
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";

describe("NumberNeighbor", () => {
  const mockOnDataChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders with initial state", () => {
    render(<NumberNeighbor />);
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
  });
});
