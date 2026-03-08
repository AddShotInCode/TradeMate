/**
 * Input 컴포넌트 테스트
 *
 * GWT 형식으로 테스트 구조화:
 * - Given (사전 조건): 컴포넌트 렌더링 상태 또는 사전 설정
 * - When (동작): 사용자 인터랙션 또는 props 변경
 * - Then (결과): 기대하는 DOM 상태 또는 동작
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input Component", () => {
  /**
   * 렌더링 테스트
   * Input의 기본 렌더링 동작 검증
   */
  describe("렌더링", () => {
    it("기본 input이 올바르게 렌더링되어야 한다", () => {
      // Given: Input 컴포넌트가 주어졌을 때
      // When: 기본 props로 렌더링하면
      render(<Input />);

      // Then: textbox role을 가진 input이 DOM에 존재해야 함
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("placeholder가 올바르게 표시되어야 한다", () => {
      // Given: placeholder가 설정된 Input
      // When: 렌더링하면
      render(<Input placeholder="이메일을 입력하세요" />);

      // Then: placeholder 텍스트가 표시되어야 함
      expect(screen.getByPlaceholderText("이메일을 입력하세요")).toBeInTheDocument();
    });
  });

  /**
   * 타입 테스트
   * 다양한 input type 속성 검증
   */
  describe("타입", () => {
    it("type 속성이 없으면 기본적으로 text로 동작해야 한다", () => {
      // Given: type 속성이 없는 Input
      // When: 렌더링하면
      render(<Input />);
      const input = screen.getByRole("textbox");

      // Then: HTML input은 기본적으로 text 타입으로 동작함
      expect(input.tagName).toBe("INPUT");
    });

    it("type 속성이 올바르게 적용되어야 한다", () => {
      // Given: type="email"인 Input
      // When: 렌더링하면
      render(<Input type="email" data-testid="email-input" />);
      const input = screen.getByTestId("email-input");

      // Then: type 속성이 "email"이어야 함
      expect(input).toHaveAttribute("type", "email");
    });

    it("password 타입이 올바르게 적용되어야 한다", () => {
      // Given: type="password"인 Input
      // When: 렌더링하면
      render(<Input type="password" data-testid="password-input" />);
      const input = screen.getByTestId("password-input");

      // Then: type 속성이 "password"여야 함
      expect(input).toHaveAttribute("type", "password");
    });

    it("number 타입이 올바르게 적용되어야 한다", () => {
      // Given: type="number"인 Input
      // When: 렌더링하면
      render(<Input type="number" data-testid="number-input" />);
      const input = screen.getByTestId("number-input");

      // Then: type 속성이 "number"여야 함
      expect(input).toHaveAttribute("type", "number");
    });
  });

  /**
   * 상태 테스트
   * disabled, readOnly, required 속성 검증
   */
  describe("상태", () => {
    it("disabled 상태가 올바르게 적용되어야 한다", () => {
      // Given: disabled 속성이 true인 Input
      // When: 렌더링하면
      render(<Input disabled />);

      // Then: input이 비활성화 상태여야 함
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("readOnly 상태가 올바르게 적용되어야 한다", () => {
      // Given: readOnly 속성이 true인 Input
      // When: 렌더링하면
      render(<Input readOnly />);

      // Then: readonly 속성이 적용되어야 함
      expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    });

    it("required 속성이 올바르게 적용되어야 한다", () => {
      // Given: required 속성이 true인 Input
      // When: 렌더링하면
      render(<Input required />);

      // Then: 필수 입력 필드로 설정되어야 함
      expect(screen.getByRole("textbox")).toBeRequired();
    });
  });

  /**
   * 값 입력 테스트
   * 사용자 입력 및 onChange 이벤트 검증
   */
  describe("값 입력", () => {
    it("값이 올바르게 입력되어야 한다", async () => {
      // Given: 빈 Input이 렌더링되었을 때
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole("textbox");

      // When: 사용자가 텍스트를 입력하면
      await user.type(input, "테스트 입력");

      // Then: 입력한 값이 input에 반영되어야 함
      expect(input).toHaveValue("테스트 입력");
    });

    it("onChange 이벤트가 발생해야 한다", () => {
      // Given: onChange 핸들러가 연결된 Input
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole("textbox");

      // When: input 값이 변경되면
      fireEvent.change(input, { target: { value: "새 값" } });

      // Then: onChange 핸들러가 호출되어야 함
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("제어 컴포넌트로 동작해야 한다", () => {
      // Given: value와 onChange로 제어되는 Input
      const ControlledInput = () => {
        const [value, setValue] = React.useState("초기값");
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };
      render(<ControlledInput />);
      const input = screen.getByRole("textbox");

      // When: 초기 렌더링 후 값을 변경하면
      expect(input).toHaveValue("초기값");
      fireEvent.change(input, { target: { value: "변경된 값" } });

      // Then: 상태 변경이 input에 반영되어야 함
      expect(input).toHaveValue("변경된 값");
    });
  });

  /**
   * 스타일 테스트
   * CSS 클래스 적용 검증
   */
  describe("스타일", () => {
    it("기본 클래스가 적용되어야 한다", () => {
      // Given: Input 컴포넌트가 주어졌을 때
      // When: 렌더링하면
      render(<Input />);
      const input = screen.getByRole("textbox");

      // Then: 기본 스타일 클래스들이 적용되어야 함
      expect(input).toHaveClass("flex");
      expect(input).toHaveClass("h-10");
      expect(input).toHaveClass("w-full");
      expect(input).toHaveClass("rounded-md");
    });

    it("커스텀 className이 적용되어야 한다", () => {
      // Given: 커스텀 className이 전달된 Input
      // When: 렌더링하면
      render(<Input className="custom-input-class" />);

      // Then: 커스텀 클래스가 적용되어야 함
      expect(screen.getByRole("textbox")).toHaveClass("custom-input-class");
    });
  });

  /**
   * 접근성 테스트
   * id, name, aria-* 속성 검증
   */
  describe("접근성", () => {
    it("id 속성이 올바르게 적용되어야 한다", () => {
      // Given: id가 설정된 Input
      // When: 렌더링하면
      render(<Input id="email-field" />);

      // Then: id 속성이 적용되어야 함
      expect(screen.getByRole("textbox")).toHaveAttribute("id", "email-field");
    });

    it("name 속성이 올바르게 적용되어야 한다", () => {
      // Given: name이 설정된 Input
      // When: 렌더링하면
      render(<Input name="email" />);

      // Then: name 속성이 적용되어야 함
      expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
    });

    it("aria-label이 올바르게 적용되어야 한다", () => {
      // Given: aria-label이 설정된 Input
      // When: 렌더링하면
      render(<Input aria-label="이메일 입력" />);

      // Then: aria-label로 요소를 찾을 수 있어야 함
      expect(screen.getByLabelText("이메일 입력")).toBeInTheDocument();
    });

    it("aria-describedby가 올바르게 적용되어야 한다", () => {
      // Given: aria-describedby가 설정된 Input
      // When: 렌더링하면
      render(<Input aria-describedby="email-hint" />);

      // Then: aria-describedby 속성이 적용되어야 함
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "email-hint");
    });
  });

  /**
   * 포커스 테스트
   * autoFocus, onFocus, onBlur 이벤트 검증
   */
  describe("포커스", () => {
    it("autoFocus가 올바르게 동작해야 한다", () => {
      // Given: autoFocus가 설정된 Input
      // When: 렌더링하면
      render(<Input autoFocus />);

      // Then: input이 자동으로 포커스되어야 함
      expect(screen.getByRole("textbox")).toHaveFocus();
    });

    it("onFocus 이벤트가 발생해야 한다", () => {
      // Given: onFocus 핸들러가 연결된 Input
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      // When: input에 포커스하면
      fireEvent.focus(screen.getByRole("textbox"));

      // Then: onFocus 핸들러가 호출되어야 함
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("onBlur 이벤트가 발생해야 한다", () => {
      // Given: onBlur 핸들러가 연결된 Input
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole("textbox");

      // When: 포커스 후 블러하면
      fireEvent.focus(input);
      fireEvent.blur(input);

      // Then: onBlur 핸들러가 호출되어야 함
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });
});
