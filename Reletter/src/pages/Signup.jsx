import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const styles = {
  Background: {
    backgroundColor: "#fff0f6",
    height: "980px",
    marginBottom: "0px",
    paddingBottom: "35px",
  },
  SignLogTitle: {
    textAlign: "center",
    color: "#9d174d",
    fontSize: "30px",
    width: "100%",
    fontWeight: "700",
    paddingTop: "100px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "300px",
    height: "600px",
    margin: "40px auto 0 auto",
  },
  inputField: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  errorMessage: {
    color: "#e11d48",
    fontSize: "0.875rem",
  },
  submitButton: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#ec4899",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  returnButton: {
    justifyContent: "center",
    width: "150px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#ec4899",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "70px",
  },
};

const schema = yup.object().shape({
  name: yup.string().required("이름은 필수 항목입니다."),
  email: yup
    .string()
    .email("유효한 이메일 형식이 아닙니다.")
    .required("이메일은 필수 항목입니다."),
  password: yup
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .max(16, "비밀번호는 최대 16자 이하이어야 합니다.")
    .required("비밀번호는 필수 항목입니다."),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인은 필수 항목입니다."),
});

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const agree1 = watch("agree1");
  const agree2 = watch("agree2");
  const [showTerms1, setShowTerms1] = useState(false);
  const [showTerms2, setShowTerms2] = useState(false);

  const toggleTerms1 = () => setShowTerms1(!showTerms1);
  const toggleTerms2 = () => setShowTerms2(!showTerms2);

  const onSubmit = async (data) => {
    console.log("💡 fetch 요청 데이터:", data);
    try {
      const response = await fetch("http://localhost:4000/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          password: data.password,
        }),
      });

      console.log("💡 fetch 응답 상태:", response.status);

      const result = await response.json();

      if (response.status === 409) {
        alert("이미 존재하는 이메일입니다.");
        return;
      }

      if (response.status === 201) {
        alert("회원가입 성공!");
        navigate("/login");
        return;
      }

      alert(`회원가입 실패: ${result.message}`);
    } catch (error) {
      console.error("❌ 에러 발생:", error);
      alert("서버 오류로 회원가입 실패");
    }
  };

  const handleReturnClick = () => {
    navigate("/home");
  };

  return (
    <div style={styles.Background}>
      <div style={styles.SignLogTitle}>회원가입</div>

      <form style={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="이름을 입력해주세요!"
          {...register("name")}
          style={styles.inputField}
        />
        {errors.name && (
          <div style={styles.errorMessage}>{errors.name.message}</div>
        )}

        <input
          type="email"
          placeholder="이메일을 입력해주세요!"
          {...register("email")}
          style={styles.inputField}
        />
        {errors.email && (
          <div style={styles.errorMessage}>{errors.email.message}</div>
        )}

        <input
          type="password"
          placeholder="비밀번호를 입력해주세요!"
          {...register("password")}
          style={styles.inputField}
        />
        {errors.password && (
          <div style={styles.errorMessage}>{errors.password.message}</div>
        )}

        <input
          type="password"
          placeholder="비밀번호를 다시 입력해주세요!"
          {...register("passwordCheck")}
          style={styles.inputField}
        />
        {errors.passwordCheck && (
          <div style={styles.errorMessage}>{errors.passwordCheck.message}</div>
        )}

        <div>
          <label>
            <input
              type="checkbox"
              {...register("agree1", { required: true })}
            />
            <span
              style={{
                marginLeft: "8px",
                fontWeight: "bold",
                textDecoration: "underline",
                width: "200px",
                color: "#9d174d",
              }}
            >
              1. 서비스 이용약관 (필수)
            </span>
          </label>
          <button
            type="button"
            onClick={toggleTerms1}
            style={{
              marginLeft: "12px",
              borderRadius: "20px",
              padding: "4px 12px",
              border: "1px solid #ec4899",
              backgroundColor: "#fff",
              color: "#ec4899",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            {showTerms1 ? "닫기" : "자세히 보기"}
          </button>
          {showTerms1 && (
            <p style={{ fontSize: "0.875rem", marginTop: "8px" }}>
              - 본인은 본 서비스의 이용약관에 동의합니다. <br />- 서비스 제공
              범위, 회원의 의무, 금지 행위 등 포함
            </p>
          )}
          {!agree1 && (
            <div style={styles.errorMessage}>이용약관에 동의해주세요.</div>
          )}
        </div>

        <div style={{ width: "500px" }}>
          <label>
            <input
              type="checkbox"
              {...register("agree2", { required: true })}
            />
            <span
              style={{
                marginLeft: "8px",
                fontWeight: "bold",
                textDecoration: "underline",
                width: "200px",
                color: "#9d174d",
              }}
            >
              2. 개인정보 수집 및 이용 동의 (필수)
            </span>
          </label>
          <button
            type="button"
            onClick={toggleTerms2}
            style={{
              marginLeft: "12px",
              borderRadius: "20px",
              padding: "4px 12px",
              border: "1px solid #ec4899",
              backgroundColor: "#fff",
              color: "#ec4899",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            {showTerms2 ? "닫기" : "자세히 보기"}
          </button>
          {showTerms2 && (
            <p style={{ fontSize: "0.875rem", marginTop: "8px" }}>
              - 수집 항목: 이름, 이메일, 비밀번호 등 <br />
              - 이용 목적: 회원 식별, 서비스 제공, 고객 응대 <br />
              - 보유 및 이용 기간: 회원 탈퇴 시까지 <br />
            </p>
          )}
          {!agree2 && (
            <div style={styles.errorMessage}>
              개인정보 수집 및 이용에 동의해주세요.
            </div>
          )}
        </div>

        <button type="submit" style={styles.submitButton} disabled={!isValid}>
          회원가입
        </button>

        <button
          type="button"
          style={styles.returnButton}
          onClick={handleReturnClick}
        >
          이전 화면으로
        </button>
      </form>
    </div>
  );
};

export default Signup;
