import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const styles = {
  Background: {
    backgroundColor: "#fff0f6",
    height: "980px",
    marginBottom: "0px",
  },
  SignLogTitle: {
    textAlign: "center",
    color: "#9d174d",
    fontSize: "30px",
    width: "100%",
    fontWeight: "700",
    paddingTop: "200px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "300px",
    height: "535px",
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
    textAlign: "center",
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
  email: yup
    .string()
    .email("유효한 이메일 형식이 아닙니다.")
    .required("이메일은 필수 항목입니다."),
  password: yup.string().required("비밀번호는 필수 항목입니다."),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "로그인 실패");
        return;
      }

      // 정상 로그인 처리
      alert("로그인 성공!");
      localStorage.setItem("accessToken", result.token);
      navigate("/main");
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 오류로 로그인 실패");
    }
  };

  const handleReturnClick = () => {
    navigate("/home");
  };
  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div style={styles.Background}>
      <div style={styles.SignLogTitle}>로그인</div>

      <form style={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
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

        <button type="submit" style={styles.submitButton} disabled={!isValid}>
          로그인
        </button>

        <button
          type="button"
          style={styles.returnButton}
          onClick={handleReturnClick}
        >
          이전 화면으로
        </button>
        <div
          style={{
            color: "#ec4899",
            textAlign: "center",
            textDecoration: "underline",
          }}
          onClick={handleSignupClick}
        >
          회원가입
        </div>
      </form>
    </div>
  );
};

export default Login;
