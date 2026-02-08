/**
 * Card 컴포넌트 테스트
 *
 * GWT 형식으로 테스트 구조화:
 * - Given (사전 조건): 컴포넌트 렌더링 상태
 * - When (동작): props 전달 또는 조합
 * - Then (결과): 기대하는 DOM 상태
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../card";

describe("Card Components", () => {
  /**
   * Card 기본 컴포넌트 테스트
   */
  describe("Card", () => {
    it("Card가 올바르게 렌더링되어야 한다", () => {
      // Given: Card 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<Card data-testid="card">Card Content</Card>);

      // Then: Card와 내용이 DOM에 존재해야 함
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      // Given: Card 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");

      // Then: 기본 스타일 클래스들이 적용되어야 함
      expect(card).toHaveClass("rounded-xl");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("bg-card");
      expect(card).toHaveClass("shadow-sm");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      // Given: 커스텀 className이 전달된 Card
      // When: 렌더링하면
      render(
        <Card data-testid="card" className="custom-card">
          Content
        </Card>
      );

      // Then: 커스텀 클래스가 적용되어야 함
      expect(screen.getByTestId("card")).toHaveClass("custom-card");
    });
  });

  /**
   * CardHeader 컴포넌트 테스트
   */
  describe("CardHeader", () => {
    it("CardHeader가 올바르게 렌더링되어야 한다", () => {
      // Given: CardHeader 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardHeader data-testid="header">Header Content</CardHeader>);

      // Then: CardHeader와 내용이 DOM에 존재해야 함
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      // Given: CardHeader 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardHeader data-testid="header">Header</CardHeader>);
      const header = screen.getByTestId("header");

      // Then: flex 레이아웃과 패딩 스타일이 적용되어야 함
      expect(header).toHaveClass("flex");
      expect(header).toHaveClass("flex-col");
      expect(header).toHaveClass("space-y-1.5");
      expect(header).toHaveClass("p-6");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      // Given: 커스텀 className이 전달된 CardHeader
      // When: 렌더링하면
      render(
        <CardHeader data-testid="header" className="custom-header">
          Header
        </CardHeader>
      );

      // Then: 커스텀 클래스가 적용되어야 함
      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });
  });

  /**
   * CardTitle 컴포넌트 테스트
   */
  describe("CardTitle", () => {
    it("CardTitle이 올바르게 렌더링되어야 한다", () => {
      // Given: CardTitle 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardTitle>제목</CardTitle>);

      // Then: h3 제목으로 렌더링되어야 함
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByText("제목")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      // Given: CardTitle 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardTitle data-testid="title">Title</CardTitle>);
      const title = screen.getByTestId("title");

      // Then: 제목 스타일 클래스가 적용되어야 함
      expect(title).toHaveClass("text-2xl");
      expect(title).toHaveClass("font-semibold");
      expect(title).toHaveClass("leading-none");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      // Given: 커스텀 className이 전달된 CardTitle
      // When: 렌더링하면
      render(
        <CardTitle data-testid="title" className="custom-title">
          Title
        </CardTitle>
      );

      // Then: 커스텀 클래스가 적용되어야 함
      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  /**
   * CardDescription 컴포넌트 테스트
   */
  describe("CardDescription", () => {
    it("CardDescription이 올바르게 렌더링되어야 한다", () => {
      // Given: CardDescription 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardDescription data-testid="desc">설명 텍스트</CardDescription>);

      // Then: 설명 텍스트가 DOM에 존재해야 함
      expect(screen.getByTestId("desc")).toBeInTheDocument();
      expect(screen.getByText("설명 텍스트")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      // Given: CardDescription 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardDescription data-testid="desc">Description</CardDescription>);
      const desc = screen.getByTestId("desc");

      // Then: 설명 스타일 클래스가 적용되어야 함
      expect(desc).toHaveClass("text-sm");
      expect(desc).toHaveClass("text-muted-foreground");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      // Given: 커스텀 className이 전달된 CardDescription
      // When: 렌더링하면
      render(
        <CardDescription data-testid="desc" className="custom-desc">
          Description
        </CardDescription>
      );

      // Then: 커스텀 클래스가 적용되어야 함
      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });
  });

  /**
   * CardContent 컴포넌트 테스트
   */
  describe("CardContent", () => {
    it("CardContent가 올바르게 렌더링되어야 한다", () => {
      // Given: CardContent 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardContent data-testid="content">본문 내용</CardContent>);

      // Then: 본문 내용이 DOM에 존재해야 함
      expect(screen.getByTestId("content")).toBeInTheDocument();
      expect(screen.getByText("본문 내용")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      // Given: CardContent 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId("content");

      // Then: 본문 패딩 스타일이 적용되어야 함
      expect(content).toHaveClass("p-6");
      expect(content).toHaveClass("pt-0");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      // Given: 커스텀 className이 전달된 CardContent
      // When: 렌더링하면
      render(
        <CardContent data-testid="content" className="custom-content">
          Content
        </CardContent>
      );

      // Then: 커스텀 클래스가 적용되어야 함
      expect(screen.getByTestId("content")).toHaveClass("custom-content");
    });
  });

  /**
   * CardFooter 컴포넌트 테스트
   */
  describe("CardFooter", () => {
    it("CardFooter가 올바르게 렌더링되어야 한다", () => {
      // Given: CardFooter 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardFooter data-testid="footer">Footer 내용</CardFooter>);

      // Then: Footer 내용이 DOM에 존재해야 함
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByText("Footer 내용")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      // Given: CardFooter 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId("footer");

      // Then: Footer 레이아웃 스타일이 적용되어야 함
      expect(footer).toHaveClass("flex");
      expect(footer).toHaveClass("items-center");
      expect(footer).toHaveClass("p-6");
      expect(footer).toHaveClass("pt-0");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      // Given: 커스텀 className이 전달된 CardFooter
      // When: 렌더링하면
      render(
        <CardFooter data-testid="footer" className="custom-footer">
          Footer
        </CardFooter>
      );

      // Then: 커스텀 클래스가 적용되어야 함
      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });
  });

  /**
   * Card 컴포넌트 조합 테스트
   * 모든 서브 컴포넌트가 함께 동작하는지 검증
   */
  describe("조합 테스트", () => {
    it("모든 Card 컴포넌트가 함께 올바르게 렌더링되어야 한다", () => {
      // Given: 모든 Card 서브 컴포넌트가 조합된 완전한 Card
      // When: 렌더링하면
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>카드 제목</CardTitle>
            <CardDescription>카드 설명입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>카드 본문 내용입니다.</p>
          </CardContent>
          <CardFooter>
            <button>확인</button>
          </CardFooter>
        </Card>
      );

      // Then: 모든 서브 컴포넌트 내용이 올바르게 렌더링되어야 함
      expect(screen.getByTestId("full-card")).toBeInTheDocument();
      expect(screen.getByText("카드 제목")).toBeInTheDocument();
      expect(screen.getByText("카드 설명입니다.")).toBeInTheDocument();
      expect(screen.getByText("카드 본문 내용입니다.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
    });

    it("Card 내부에 여러 콘텐츠를 포함할 수 있어야 한다", () => {
      // Given: 다중 콘텐츠(input, 여러 버튼)가 포함된 Card
      // When: 렌더링하면
      render(
        <Card data-testid="multi-content-card">
          <CardHeader>
            <CardTitle>다중 콘텐츠</CardTitle>
          </CardHeader>
          <CardContent>
            <input type="text" placeholder="입력" />
            <button>버튼 1</button>
            <button>버튼 2</button>
          </CardContent>
        </Card>
      );

      // Then: 모든 콘텐츠가 올바르게 렌더링되어야 함
      expect(screen.getByPlaceholderText("입력")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "버튼 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "버튼 2" })).toBeInTheDocument();
    });
  });
});
