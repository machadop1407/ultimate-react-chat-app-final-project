import { useForm } from "react-hook-form";
import { useChatStore } from "../store/chatStore";
import { supabase } from "../supabaseClient";

interface MessageFormData {
  message: string;
}

function ChatMessageForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageFormData>();

  const { currentRoom, user } = useChatStore();

  const onSubmit = async (data: MessageFormData) => {
    if (!currentRoom) return;
    const { error } = await supabase.from("messages").insert([
      {
        content: data.message,
        user_id: user?.id,
        email: user?.email,
        room_id: currentRoom.id,
      },
    ]);

    if (error) {
      console.error("Error sending message: ", error.message);
    } else {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        className="conv-input"
        placeholder={
          errors.message ? errors.message.message : "Type your message..."
        }
        {...register("message", { required: "Please type your message!" })}
      />
      <button className="conv-button">Send</button>
    </form>
  );
}

export default ChatMessageForm;
