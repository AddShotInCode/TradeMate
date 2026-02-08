import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button Component", () => {
  describe("렌더링", () => {
    it("기본 버튼이 올바르게 렌더링되어야 한다", () => {
      render(<Button>클릭</Button>);
      expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
    });

    it("children이 올바르게 렌더링되어야 한다", () => {
      render(<Button>테스트 버튼</Button>);
      expect(screen.getByText("테스트 버튼")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("default variant가 적용되어야 한다", () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
    });

    it("destructive variant가 적용되어야 한다", () => {
      render(<Button variant="destructive">Destructive</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-destructive");
    });

    it("outline variant가 적용되어야 한다", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border");
    });

    it("secondary variant가 적용되어야 한다", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary");
    });

    it("ghost variant가 적용되어야 한다", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("link variant가 적용되어야 한다", () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-primary");
      expect(button).toHaveClass("underline-offset-4");
    });
  });

  describe("Sizes", () => {
    it("default size가 적용되어야 한다", () => {
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("px-4");
    });

    it("sm size가 적용되어야 한다", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-9");
      expect(button).toHaveClass("px-3");
    });

    it("lg size가 적용되어야 한다", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11");
      expect(button).toHaveClass("px-8");
    });

    it("icon size가 적용되어야 한다", () => {
      render(<Button size="icon">🔍</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("w-10");
    });
  });

  describe("상태", () => {
    it("disabled 상태가 올바르게 적용되어야 한다", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:pointer-events-none");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("이벤트", () => {
    it("클릭 이벤트가 발생해야 한다", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disabled 상태에서는 클릭 이벤트가 발생하지 않아야 한다", () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Click Me
        </Button>
      );
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("asChild", () => {
    it("asChild가 true일 때 Slot으로 렌더링되어야 한다", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("접근성", () => {
    it("type 속성을 지정할 수 있어야 한다", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("aria-label을 지정할 수 있어야 한다", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByLabelText("Close dialog")).toBeInTheDocument();
    });
  });
});
