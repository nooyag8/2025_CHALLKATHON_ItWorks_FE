import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Find = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // ✅ 받은 친구 요청 불러오기
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:4000/users/friends/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📥 받은 요청:", res.data);
        setFriendRequests(res.data);
      } catch (err) {
        console.error("❌ 친구 요청 목록 가져오기 실패:", err);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const res = await axios.get(
        `http://localhost:4000/users/search?keyword=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("검색 결과: ", res.data);
      setSearchResults(res.data);
      if (res.data.length === 0) {
        alert("존재하지 않는 친구입니다.");
      }
    } catch (err) {
      console.error("❌ 검색 실패:", err);
      alert("검색 중 오류 발생!");
    }
  };

  const handleAddFriend = async (user) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      await axios.post(
        "http://localhost:4000/users/friends/request",
        { targetId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`${user.name} 님에게 친구 신청을 보냈습니다!`);
    } catch (err) {
      console.error("❌ 친구 신청 실패:", err);
      alert("이미 친구 신청을 보냈습니다!");
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      await axios.post(
        "http://localhost:4000/users/friends/accept",
        { requesterId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("친구 요청 수락!");
      setFriendRequests((prev) =>
        prev.filter((req) => req.requesterId !== requesterId)
      );
    } catch (err) {
      console.error("❌ 친구 수락 실패:", err);
      alert("친구 요청 수락에 실패했습니다.");
    }
  };

  const handleReject = async (requesterId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      await axios.post(
        "http://localhost:4000/users/friends/reject",
        { requesterId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("친구 요청 거절!");
      setFriendRequests((prev) =>
        prev.filter((req) => req.requesterId !== requesterId)
      );
    } catch (err) {
      console.error("❌ 친구 거절 실패:", err);
      alert("친구 요청 거절에 실패했습니다.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>🔍 친구 찾기</h2>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSearch} style={styles.button}>
            검색
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subtitle}>🔎 검색 결과</h3>
          {searchResults.length === 0 ? (
            <p style={styles.emptyText}>검색 결과가 없습니다.</p>
          ) : (
            searchResults.map((user) => (
              <div key={user._id} style={styles.resultItem}>
                <div>
                  <span>{user.name}</span>{" "}
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>
                    ({user.email})
                  </span>
                </div>
                <button
                  onClick={() => handleAddFriend(user)}
                  style={styles.subButton}
                >
                  친구 신청
                </button>
              </div>
            ))
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.subtitle}>📬 받은 친구 요청</h3>
          {friendRequests.length === 0 ? (
            <p style={styles.emptyText}>받은 요청이 없습니다.</p>
          ) : (
            friendRequests.map((req) => (
              <div key={req.id} style={styles.resultItem}>
                <div>
                  <span>{req.name}</span>{" "}
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>
                    ({req.email})
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => handleAccept(req.requesterId)}
                    style={styles.acceptButton}
                  >
                    수락
                  </button>
                  <button
                    onClick={() => handleReject(req.requesterId)}
                    style={styles.rejectButton}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const baseButton = {
  padding: "6px 10px",
  fontSize: "14px",
  backgroundColor: "#f472b6",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff0f6",
    minHeight: "100vh",
  },
  container: {
    width: "720px",
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    color: "#9d174d",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#ec4899",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  section: {
    marginBottom: "32px",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "12px",
    color: "#d94673",
  },
  resultItem: {
    backgroundColor: "#fff0f6",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
  },
  subButton: baseButton,
  acceptButton: {
    ...baseButton,
    marginRight: "6px",
  },
  rejectButton: baseButton,
  emptyText: {
    color: "#6b7280",
    fontSize: "14px",
  },
};

export default Find;
