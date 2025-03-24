import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient";
import { useChatStore } from "../store/chatStore";
import { useNavigate } from "react-router";

interface RoomFormData {
  name: string;
}

function CreateRoom() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormData>();

  const navigate = useNavigate();

  const onCreateRoom = async (data: RoomFormData) => {
    const { error, data: newRoom } = await supabase
      .from("rooms")
      .insert([
        {
          name: data.name,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating room: ", error.message);
    } else {
      const room = newRoom[0];
      useChatStore.getState().setCurrentRoom({ id: room.id, name: room.name });
      navigate("/");
    }
  };

  return (
    <div className="create-room-container">
      {" "}
      <div className="create-room">
        <h2> Create a New Room</h2>
        <form onSubmit={handleSubmit(onCreateRoom)}>
          <div>
            <input
              type="text"
              placeholder="Enter room name..."
              {...register("name", { required: "Please enter a name." })}
            />
            {errors.name && (
              <p className="error-text"> {errors.name.message}</p>
            )}
          </div>
          <button type="submit"> Create Room</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
