import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyPageForm = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [newInfo, setNewInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users/info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUserInfo(res.data);
        setNewInfo(res.data);
      } catch (err) {
        console.error("❌ 사용자 정보 가져오기 실패:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleDelete = async () => {
    const confirm = window.confirm("정말 탈퇴하시겠어요?");
    if (confirm) {
      try {
        await axios.delete("http://localhost:4000/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.removeItem("accessToken");
        navigate("/signup");
      } catch (err) {
        console.error("회원 탈퇴 실패:", err);
        alert("탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch("http://localhost:4000/users/update", newInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUserInfo(newInfo);
      setIsEditing(false);
      alert("정보가 수정되었습니다.");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff0f6",
        height: "940px",
        paddingTop: "80px",
      }}
    >
      <div>
        <div style={styles.container}>
          <h2 style={styles.title}>마이페이지</h2>

          <div style={styles.infoBox}>
            <label style={{ color: "#9d174d" }}> 이름</label>
            {isEditing ? (
              <input
                type="text"
                value={newInfo.name}
                onChange={(e) =>
                  setNewInfo({ ...newInfo, name: e.target.value })
                }
                style={styles.input}
              />
            ) : (
              <p>{userInfo.name}</p>
            )}
          </div>

          <div style={styles.infoBox}>
            <label style={{ color: "#9d174d" }}>이메일</label>
            {isEditing ? (
              <input
                type="email"
                value={newInfo.email}
                onChange={(e) =>
                  setNewInfo({ ...newInfo, email: e.target.value })
                }
                style={styles.input}
              />
            ) : (
              <p>{userInfo.email}</p>
            )}
          </div>

          {isEditing ? (
            <>
              <button style={styles.button} onClick={handleUpdate}>
                저장
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "#9ca3af" }}
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>
            </>
          ) : (
            <button style={styles.button} onClick={() => setIsEditing(true)}>
              정보 수정
            </button>
          )}

          <button style={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
          <button style={styles.deleteButton} onClick={handleDelete}>
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "80px auto",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    color: "#9d174d",
    marginBottom: "24px",
  },
  infoBox: {
    marginBottom: "16px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "8px",
    backgroundColor: "#f472b6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  logoutButton: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    backgroundColor: "#f472b6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  deleteButton: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    backgroundColor: "#9d174d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
};

export default MyPageForm;
