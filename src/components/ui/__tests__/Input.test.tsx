import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input Component", () => {
  describe("렌더링", () => {
    it("기본 input이 올바르게 렌더링되어야 한다", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("placeholder가 올바르게 표시되어야 한다", () => {
      render(<Input placeholder="이메일을 입력하세요" />);
      expect(screen.getByPlaceholderText("이메일을 입력하세요")).toBeInTheDocument();
    });
  });

  describe("타입", () => {
    it("type 속성이 없으면 기본적으로 text로 동작해야 한다", () => {
      render(<Input />);
      // HTML input elements default to type="text" even without the attribute
      const input = screen.getByRole("textbox");
      expect(input.tagName).toBe("INPUT");
    });

    it("type 속성이 올바르게 적용되어야 한다", () => {
      render(<Input type="email" data-testid="email-input" />);
      const input = screen.getByTestId("email-input");
      expect(input).toHaveAttribute("type", "email");
    });

    it("password 타입이 올바르게 적용되어야 한다", () => {
      render(<Input type="password" data-testid="password-input" />);
      const input = screen.getByTestId("password-input");
      expect(input).toHaveAttribute("type", "password");
    });

    it("number 타입이 올바르게 적용되어야 한다", () => {
      render(<Input type="number" data-testid="number-input" />);
      const input = screen.getByTestId("number-input");
      expect(input).toHaveAttribute("type", "number");
    });
  });

  describe("상태", () => {
    it("disabled 상태가 올바르게 적용되어야 한다", () => {
      render(<Input disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("readOnly 상태가 올바르게 적용되어야 한다", () => {
      render(<Input readOnly />);
      expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    });

    it("required 속성이 올바르게 적용되어야 한다", () => {
      render(<Input required />);
      expect(screen.getByRole("textbox")).toBeRequired();
    });
  });

  describe("값 입력", () => {
    it("값이 올바르게 입력되어야 한다", async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole("textbox");

      await user.type(input, "테스트 입력");
      expect(input).toHaveValue("테스트 입력");
    });

    it("onChange 이벤트가 발생해야 한다", () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "새 값" } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("제어 컴포넌트로 동작해야 한다", () => {
      const ControlledInput = () => {
        const [value, setValue] = React.useState("초기값");
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };
      render(<ControlledInput />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("초기값");
      fireEvent.change(input, { target: { value: "변경된 값" } });
      expect(input).toHaveValue("변경된 값");
    });
  });

  describe("스타일", () => {
    it("기본 클래스가 적용되어야 한다", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("flex");
      expect(input).toHaveClass("h-10");
      expect(input).toHaveClass("w-full");
      expect(input).toHaveClass("rounded-md");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      render(<Input className="custom-input-class" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-input-class");
    });
  });

  describe("접근성", () => {
    it("id 속성이 올바르게 적용되어야 한다", () => {
      render(<Input id="email-field" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("id", "email-field");
    });

    it("name 속성이 올바르게 적용되어야 한다", () => {
      render(<Input name="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
    });

    it("aria-label이 올바르게 적용되어야 한다", () => {
      render(<Input aria-label="이메일 입력" />);
      expect(screen.getByLabelText("이메일 입력")).toBeInTheDocument();
    });

    it("aria-describedby가 올바르게 적용되어야 한다", () => {
      render(<Input aria-describedby="email-hint" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "email-hint");
    });
  });

  describe("포커스", () => {
    it("autoFocus가 올바르게 동작해야 한다", () => {
      render(<Input autoFocus />);
      expect(screen.getByRole("textbox")).toHaveFocus();
    });

    it("onFocus 이벤트가 발생해야 한다", () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);
      fireEvent.focus(screen.getByRole("textbox"));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("onBlur 이벤트가 발생해야 한다", () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole("textbox");
      fireEvent.focus(input);
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });
});
