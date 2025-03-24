import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../store/chatStore";
import { supabase } from "../supabaseClient";
import { useEffect } from "react";

interface Message {
  id: number;
  content: string;
  user_id: string;
  email: string;
  created_at: string;
  room_id: number;
}

async function fetchMessages(roomId: number): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) throw Error(error.message);
  return data as Message[];
}

function ChatMessages() {
  const { currentRoom, user } = useChatStore();
  const queryClient = useQueryClient();
  const {
    data: messages,
    error,
    isLoading,
  } = useQuery<Message[], Error>({
    queryKey: ["messages", currentRoom?.id],
    queryFn: () =>
      currentRoom?.id === null
        ? Promise.resolve([])
        : fetchMessages(currentRoom!.id),
    enabled: currentRoom?.id !== null,
  });

  useEffect(() => {
    if (!currentRoom?.id) return;

    const channel = supabase.channel("messages-channel");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.room_id === currentRoom.id) {
            queryClient.setQueryData<Message[]>(
              ["messages", currentRoom?.id],
              (oldMessages) =>
                oldMessages ? [...oldMessages, newMessage] : [newMessage]
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Sub status: ", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom?.id]);

  if (isLoading) return <p className="loader-text"> Loading messages...</p>;
  if (error)
    return (
      <p className="loader-text"> Error loading messages: {error.message} </p>
    );

  return (
    <>
      {" "}
      {messages?.map((msg: Message, key) => {
        const isOwnMessage = msg.user_id === user?.id;
        const itemClass = isOwnMessage ? "right" : "left";

        const date = new Date(msg.created_at);
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hour}:${minute}`;
        return (
          <div
            key={key}
            className={`conv-message-item conv-message-item--${itemClass}`}
          >
            <div className="conv-message-value"> {msg.content} </div>
            <div className="conv-message-details"> {formattedTime} </div>
            <div className="conv-message-details"> {msg.email} </div>
          </div>
        );
      })}
    </>
  );
}

export default ChatMessages;
