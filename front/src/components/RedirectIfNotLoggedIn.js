import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RedirectIfNotLoggedIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // user가 null이면 "/"로 리다이렉트
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // null인 경우 리다이렉트를 위해 빈 화면 반환
  return null;
};

export default RedirectIfNotLoggedIn;
