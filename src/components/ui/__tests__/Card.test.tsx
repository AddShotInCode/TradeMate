import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../card";

describe("Card Components", () => {
  describe("Card", () => {
    it("Card가 올바르게 렌더링되어야 한다", () => {
      render(<Card data-testid="card">Card Content</Card>);
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("rounded-xl");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("bg-card");
      expect(card).toHaveClass("shadow-sm");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      render(
        <Card data-testid="card" className="custom-card">
          Content
        </Card>
      );
      expect(screen.getByTestId("card")).toHaveClass("custom-card");
    });
  });

  describe("CardHeader", () => {
    it("CardHeader가 올바르게 렌더링되어야 한다", () => {
      render(<CardHeader data-testid="header">Header Content</CardHeader>);
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      const header = screen.getByTestId("header");
      expect(header).toHaveClass("flex");
      expect(header).toHaveClass("flex-col");
      expect(header).toHaveClass("space-y-1.5");
      expect(header).toHaveClass("p-6");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      render(
        <CardHeader data-testid="header" className="custom-header">
          Header
        </CardHeader>
      );
      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });
  });

  describe("CardTitle", () => {
    it("CardTitle이 올바르게 렌더링되어야 한다", () => {
      render(<CardTitle>제목</CardTitle>);
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByText("제목")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      render(<CardTitle data-testid="title">Title</CardTitle>);
      const title = screen.getByTestId("title");
      expect(title).toHaveClass("text-2xl");
      expect(title).toHaveClass("font-semibold");
      expect(title).toHaveClass("leading-none");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      render(
        <CardTitle data-testid="title" className="custom-title">
          Title
        </CardTitle>
      );
      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  describe("CardDescription", () => {
    it("CardDescription이 올바르게 렌더링되어야 한다", () => {
      render(
        <CardDescription data-testid="desc">설명 텍스트</CardDescription>
      );
      expect(screen.getByTestId("desc")).toBeInTheDocument();
      expect(screen.getByText("설명 텍스트")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      render(<CardDescription data-testid="desc">Description</CardDescription>);
      const desc = screen.getByTestId("desc");
      expect(desc).toHaveClass("text-sm");
      expect(desc).toHaveClass("text-muted-foreground");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      render(
        <CardDescription data-testid="desc" className="custom-desc">
          Description
        </CardDescription>
      );
      expect(screen.getByTestId("desc")).toHaveClass("custom-desc");
    });
  });

  describe("CardContent", () => {
    it("CardContent가 올바르게 렌더링되어야 한다", () => {
      render(<CardContent data-testid="content">본문 내용</CardContent>);
      expect(screen.getByTestId("content")).toBeInTheDocument();
      expect(screen.getByText("본문 내용")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId("content");
      expect(content).toHaveClass("p-6");
      expect(content).toHaveClass("pt-0");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      render(
        <CardContent data-testid="content" className="custom-content">
          Content
        </CardContent>
      );
      expect(screen.getByTestId("content")).toHaveClass("custom-content");
    });
  });

  describe("CardFooter", () => {
    it("CardFooter가 올바르게 렌더링되어야 한다", () => {
      render(<CardFooter data-testid="footer">Footer 내용</CardFooter>);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByText("Footer 내용")).toBeInTheDocument();
    });

    it("기본 스타일이 적용되어야 한다", () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("flex");
      expect(footer).toHaveClass("items-center");
      expect(footer).toHaveClass("p-6");
      expect(footer).toHaveClass("pt-0");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      render(
        <CardFooter data-testid="footer" className="custom-footer">
          Footer
        </CardFooter>
      );
      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });
  });

  describe("조합 테스트", () => {
    it("모든 Card 컴포넌트가 함께 올바르게 렌더링되어야 한다", () => {
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

      expect(screen.getByTestId("full-card")).toBeInTheDocument();
      expect(screen.getByText("카드 제목")).toBeInTheDocument();
      expect(screen.getByText("카드 설명입니다.")).toBeInTheDocument();
      expect(screen.getByText("카드 본문 내용입니다.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
    });

    it("Card 내부에 여러 콘텐츠를 포함할 수 있어야 한다", () => {
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

      expect(screen.getByPlaceholderText("입력")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "버튼 1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "버튼 2" })).toBeInTheDocument();
    });
  });
});
