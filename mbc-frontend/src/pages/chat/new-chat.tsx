import { useEffect, useState } from "react";
import ChatSection from "./chat-section";

const NewChat = () => {
  const [color, setColor] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const user = sessionStorage.getItem("user_details")
    ? JSON.parse(sessionStorage.getItem("user_details")!)
    : null;

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    document.title = "Chats";
  }, []);

  useEffect(() => {
    const updateColor = () => {
      const theme = localStorage.getItem("theme");
      setColor(theme === "dark" ? "#fff" : "#000");
    };

    updateColor();

    const intervalId = setInterval(updateColor, 100);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ChatSection
      color={color}
      toggleSidebar={toggleSidebar}
      selected={selected}
      setSelected={setSelected}
      user={user}
    />
  );
};

export default NewChat;
