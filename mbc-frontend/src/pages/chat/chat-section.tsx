import { BeatLoader } from "react-spinners";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../../utils/cn";
import { BsRobot } from "react-icons/bs";
import { RiSendPlane2Fill } from "react-icons/ri";
import { CgAdd } from "react-icons/cg";
import Input from "../../components/input";
import Card from "../../components/card";
import useChatSocket from "../../services/use-chat-socket";
import SuggestionCard from "../../components/suggestion-card";

const suggestions = [
  { title: "Trending smart watches 2024" },
  { title: "Portable vacuum cleaner" },
  { title: "Kurti set under 600" },
];

const ChatSection = ({
  color,
  user,
}: {
  color: string;
  toggleSidebar: () => void;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  user: any;
}) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const uuid = uuidv4();

  const { messages, setMessages, sendMessage, error } = useChatSocket({
    topicId: "",
    userId: "",
  });

  const handleSendMessage = async (): Promise<void> => {
    if (inputMessage.trim() === "" && filePreviews.length === 0 && !user)
      return;

    const newUserMessage: ChatMessage = {
      id: uuid,
      query: inputMessage,
      files: filePreviews,
    };

    if (filePreviews.length > 0) {
      const fileNames = filePreviews.map((fp) => fp.file.name).join(", ");
      newUserMessage.query += `<br><span class="text-xs">[Attached files: ${fileNames}]</span>`;
    }
    sendMessage(newUserMessage);
    setInputMessage("");
    setFilePreviews([]);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      const newFilePreviews: FilePreview[] = Array.from(uploadedFiles).map(
        (file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        })
      );
      setFilePreviews((prevPreviews) => [...prevPreviews, ...newFilePreviews]);
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-purple-900 pb-4 rounded-2xl">
      <div className="flex-grow w-full min-h-0 mx-auto overflow-y-auto hide-scrollbar">
        {/* ..................... when no message in new chat ............................. */}
        {messages.length < 1 && (
          <div className="flex flex-col w-full mx-auto h-[500px] px-4 pt-10 md:pt-4 items-start">
            <h3 className="text-5xl font-normal text-background">Hi John,</h3>
            <span className="block text-2xl font-normal text-gray-500 mb-4">
              How can i help you today?
            </span>
            <div className="grid grid-cols-10 gap-8 w-full">
              {suggestions.map((suggestion: any, index: number) => (
                <div key={index} className="col-span-2 cursor-pointer">
                  <SuggestionCard {...suggestion} />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ..................... messages ............................. */}
        <ul className="py-5 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* ..................... my messages ............................. */}
              <li
                className={cn(
                  "flex items-start gap-2 px-3 md:gap-3 md:px-6 justify-start flex-row-reverse"
                )}
              >
                <img
                  src={""}
                  alt={""}
                  className="rounded-full w-7 h-7 profile-img min-w-7"
                />
                <div
                  className={cn(
                    "rounded-2xl p-3 text-xs md:text-base font-medium max-w-[calc(100%-4.5rem)]",
                    "bg-primary dark:bg-dark-primary text-white rounded-tr-none"
                  )}
                >
                  {message.query && (
                    <p
                      className="m-0 text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: message.query }}
                    ></p>
                  )}
                </div>
              </li>

              {/* ..................... loading and response from server ............................. */}
              <li
                className={cn(
                  "flex items-start gap-2 px-3 md:gap-3 md:px-6 justify-start"
                )}
              >
                {/* <img
                    src={AI}
                    alt={AI}
                    className="rounded-full w-7 h-7 profile-img min-w-7"
                  /> */}
                <BsRobot className="rounded-full w-7 h-7 profile-img min-w-7" />
                <div
                  className={cn(
                    "rounded-2xl p-3 text-xs md:text-base font-medium max-w-[calc(100%-4.5rem)]",
                    "bg-transparent py-0.5 px-0 border-0 text-secondary rounded-tl-none"
                  )}
                >
                  {message.isLoading ? (
                    <div
                      className={cn(
                        "border rounded-2xl rounded-tl-none p-3 pb-2 text-base font-medium",
                        "bg-transparent border-0 py-1 px-0"
                      )}
                    >
                      <BeatLoader size={12} color={color} />
                    </div>
                  ) : message.response ? (
                    <p
                      className="m-0 text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: message.response,
                      }}
                    ></p>
                  ) : null}
                </div>
              </li>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="flex flex-col w-full gap-4 max-w-[45rem] mt-auto mx-auto rounded-3xl text-gray-200 bg-background">
        {filePreviews.length > 0 && (
          <div className="w-full px-2 pt-4 pb-2 md:p-6 md:pb-0 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {filePreviews.map((fp, index) => (
                <img
                  key={index}
                  src={fp.previewUrl}
                  alt={`file-${index}`}
                  className="object-cover w-16 h-16 rounded-md"
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex items-end w-full">
          <div
            className="p-3 pr-0 rounded-lg cursor-pointer"
            onClick={triggerFileInput}
          >
            <CgAdd className="w-6 h-6 text-gray-400" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
          </div>
          <Input
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputMessage(e.target.value)
            }
            containerClass="w-full"
            className={cn(
              "outline-none text-sm rounded-lg border-none p-2.5 w-full h-12 max-h-24 bg-background"
            )}
            placeholder="Type a message"
          />

          <button
            className="p-3 rounded-lg cursor-pointer"
            onClick={handleSendMessage}
            disabled={!inputMessage && filePreviews.length === 0}
          >
            <RiSendPlane2Fill
              className={cn(
                "w-6 h-6 text-gray-500",
                !inputMessage && filePreviews.length === 0
                  ? "dark:disabled:text-[#7A7A7A]"
                  : "text-gray-200"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
