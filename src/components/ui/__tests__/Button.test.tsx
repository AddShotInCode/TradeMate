/**
 * Button 컴포넌트 테스트
 *
 * GWT 형식으로 테스트 구조화:
 * - Given (사전 조건): 컴포넌트 렌더링 상태
 * - When (동작): 사용자 인터랙션 또는 props 변경
 * - Then (결과): 기대하는 DOM 상태 또는 동작
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button Component", () => {
  /**
   * 렌더링 테스트
   * 버튼의 기본 렌더링 동작을 검증
   */
  describe("렌더링", () => {
    it("기본 버튼이 올바르게 렌더링되어야 한다", () => {
      // Given: 버튼 컴포넌트가 주어졌을 때
      // When: 기본 props로 렌더링하면
      render(<Button>클릭</Button>);

      // Then: 버튼이 DOM에 존재해야 함
      expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
    });

    it("children이 올바르게 렌더링되어야 한다", () => {
      // Given: 텍스트 children이 있는 버튼
      // When: 렌더링하면
      render(<Button>테스트 버튼</Button>);

      // Then: children 텍스트가 표시되어야 함
      expect(screen.getByText("테스트 버튼")).toBeInTheDocument();
    });
  });

  /**
   * Variant(스타일 변형) 테스트
   * 각 variant에 따른 CSS 클래스 적용 검증
   */
  describe("Variants", () => {
    it("default variant가 적용되어야 한다", () => {
      // Given: variant="default"인 버튼
      // When: 렌더링하면
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole("button");

      // Then: bg-primary 클래스가 적용되어야 함
      expect(button).toHaveClass("bg-primary");
    });

    it("destructive variant가 적용되어야 한다", () => {
      // Given: variant="destructive"인 버튼
      // When: 렌더링하면
      render(<Button variant="destructive">Destructive</Button>);
      const button = screen.getByRole("button");

      // Then: bg-destructive 클래스가 적용되어야 함
      expect(button).toHaveClass("bg-destructive");
    });

    it("outline variant가 적용되어야 한다", () => {
      // Given: variant="outline"인 버튼
      // When: 렌더링하면
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");

      // Then: border 클래스가 적용되어야 함
      expect(button).toHaveClass("border");
    });

    it("secondary variant가 적용되어야 한다", () => {
      // Given: variant="secondary"인 버튼
      // When: 렌더링하면
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");

      // Then: bg-secondary 클래스가 적용되어야 함
      expect(button).toHaveClass("bg-secondary");
    });

    it("ghost variant가 적용되어야 한다", () => {
      // Given: variant="ghost"인 버튼
      // When: 렌더링하면
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");

      // Then: hover:bg-accent 클래스가 적용되어야 함
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("link variant가 적용되어야 한다", () => {
      // Given: variant="link"인 버튼
      // When: 렌더링하면
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole("button");

      // Then: 링크 스타일 클래스가 적용되어야 함
      expect(button).toHaveClass("text-primary");
      expect(button).toHaveClass("underline-offset-4");
    });
  });

  /**
   * Size(크기) 테스트
   * 각 size에 따른 높이/패딩 클래스 적용 검증
   */
  describe("Sizes", () => {
    it("default size가 적용되어야 한다", () => {
      // Given: size="default"인 버튼
      // When: 렌더링하면
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole("button");

      // Then: 기본 크기 클래스(h-10, px-4)가 적용되어야 함
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("px-4");
    });

    it("sm size가 적용되어야 한다", () => {
      // Given: size="sm"인 버튼
      // When: 렌더링하면
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");

      // Then: 작은 크기 클래스(h-9, px-3)가 적용되어야 함
      expect(button).toHaveClass("h-9");
      expect(button).toHaveClass("px-3");
    });

    it("lg size가 적용되어야 한다", () => {
      // Given: size="lg"인 버튼
      // When: 렌더링하면
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");

      // Then: 큰 크기 클래스(h-11, px-8)가 적용되어야 함
      expect(button).toHaveClass("h-11");
      expect(button).toHaveClass("px-8");
    });

    it("icon size가 적용되어야 한다", () => {
      // Given: size="icon"인 버튼 (아이콘 전용)
      // When: 렌더링하면
      render(<Button size="icon">🔍</Button>);
      const button = screen.getByRole("button");

      // Then: 정사각형 크기 클래스(h-10, w-10)가 적용되어야 함
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("w-10");
    });
  });

  /**
   * 상태 테스트
   * disabled 상태 및 커스텀 클래스 적용 검증
   */
  describe("상태", () => {
    it("disabled 상태가 올바르게 적용되어야 한다", () => {
      // Given: disabled 속성이 true인 버튼
      // When: 렌더링하면
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");

      // Then: 비활성화 상태여야 하고 관련 클래스가 적용되어야 함
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:pointer-events-none");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      // Given: 커스텀 className이 전달된 버튼
      // When: 렌더링하면
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");

      // Then: 전달된 커스텀 클래스가 적용되어야 함
      expect(button).toHaveClass("custom-class");
    });
  });

  /**
   * 이벤트 테스트
   * 클릭 이벤트 핸들링 검증
   */
  describe("이벤트", () => {
    it("클릭 이벤트가 발생해야 한다", () => {
      // Given: onClick 핸들러가 연결된 버튼
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      // When: 버튼을 클릭하면
      fireEvent.click(screen.getByRole("button"));

      // Then: onClick 핸들러가 1회 호출되어야 함
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disabled 상태에서는 클릭 이벤트가 발생하지 않아야 한다", () => {
      // Given: disabled 상태이고 onClick 핸들러가 연결된 버튼
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Click Me
        </Button>
      );
      const button = screen.getByRole("button");

      // When: 버튼을 클릭하면
      fireEvent.click(button);

      // Then: onClick 핸들러가 호출되지 않아야 함
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  /**
   * asChild 테스트
   * Radix Slot을 통한 자식 요소 렌더링 검증
   */
  describe("asChild", () => {
    it("asChild가 true일 때 Slot으로 렌더링되어야 한다", () => {
      // Given: asChild 속성이 true이고 <a> 태그가 자식으로 전달된 버튼
      // When: 렌더링하면
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByRole("link", { name: "Link Button" });

      // Then: <a> 태그가 버튼 스타일과 함께 렌더링되어야 함
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  /**
   * 접근성 테스트
   * type, aria-label 등 접근성 속성 검증
   */
  describe("접근성", () => {
    it("type 속성을 지정할 수 있어야 한다", () => {
      // Given: type="submit"인 버튼
      // When: 렌더링하면
      render(<Button type="submit">Submit</Button>);

      // Then: type 속성이 "submit"이어야 함
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("aria-label을 지정할 수 있어야 한다", () => {
      // Given: aria-label이 설정된 버튼
      // When: 렌더링하면
      render(<Button aria-label="Close dialog">X</Button>);

      // Then: aria-label로 요소를 찾을 수 있어야 함
      expect(screen.getByLabelText("Close dialog")).toBeInTheDocument();
    });
  });
});
