import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import {
  setAllUserData,
  setMessages,
  setUserMessageLoading,
  
} from "../slices/chatSlice";
import { getChatData, get_all_users } from "../services";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import { PiChatsFill } from "react-icons/pi";
import { socket } from "../App";
import { ChatCard, ConversationCard, Loading, DummyChatCard } from "../components";


export default function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showName, setShowName] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
  const chatSelected = useSelector(
    (state: RootState) => state.Chat.chatSelected
  );
  const token = useSelector((state: RootState) => state.User.token);
  const userData = useSelector((state: RootState) => state.User.user);
  const receiver = useSelector(
    (state: RootState) => state.Chat.receiverSelected
  );
  const allUsers = useSelector((state: RootState) => state.Chat.allUsers);
  const loading = useSelector(
    (state: RootState) => state.Chat.userMessageLoading
  );

  useEffect(() => {
    if (!token || !userData) {
      socket.emit("userOffline", userData?._id);
      navigate("/");
    }
  }, [token, userData]);

  useEffect(() => {
    getDataOfAllUsers();
  }, []);

  useEffect(() => {
    if (receiver && Object.keys(receiver).length > 0) {
      getChat();
    }
  }, [receiver, userData]);

  const getChat = async () => {
    dispatch(setUserMessageLoading(true));
    if (!userData || !receiver) return dispatch(setUserMessageLoading(false));
    const getMessages = {
      senderId: userData?._id,
      receiverId: receiver?._id,
    } as unknown as string;
    const res = await getChatData(getMessages, token);
    if (res?.success) {
      dispatch(setUserMessageLoading(false));
      dispatch(setMessages(res?.data));
    } else {
      dispatch(setUserMessageLoading(false));
    }
  };

  const getDataOfAllUsers = async () => {
    if (!userData?._id) return;
    const res = await get_all_users(userData?._id, token);
    if (res?.success) {
      dispatch(setAllUserData(res?.data));
    } else {
      toast.error(res?.message);
    }
  };

  const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };

      document.addEventListener("click", handleClick, true);

      return () => {
        document.removeEventListener("click", handleClick, true);
      };
    }, [ref]);

    return ref;
  };

  const handleClickOutside = () => {
    setShowName(false);
  };

  const showNameRef = useOutsideClick(handleClickOutside);

//   const throttle = <T extends any[]>(
//     func: (...args: T) => void,
//     delay: number
//   ) => {
//     let timeoutId: ReturnType<typeof setTimeout>;

//     return function (this: any, ...args: T) {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }

//       timeoutId = setTimeout(() => {
//         func.apply(this, args);
//       }, delay);
//     };
//   };

  const filterItems = (searchTerm: string) => {
    return allUsers?.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

//   const selectUsers = allUsers.map((user) => ({
//     value: user._id,
//     label: user.name,
//   }));

  return (
    <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
      {loading && <Loading />}
      <div className="lg:w-11/12 mx-2 w-full h-[600px] shadow bg-slate-700 rounded-xl flex relative">
        {/* Side bar container starts */}


        <div className="w-20 h-full bg-slate-800 flex flex-col items-center justify-start py-4 text-white gap-4">
          <div
            onClick={() => setShowName(true)}
            className="avatar placeholder tooltip tooltip-open tooltip-top"
          >
            <div className="bg-neutral-focus text-neutral-content rounded-full font-bold w-12 text-3xl">
              <span>{userData?.name.substring(0, 1)}</span>
            </div>
          </div>
          {showName && (
            <div
              ref={showNameRef}
              className="absolute z-50 left-16 top-10 text-center min-w-max chat-bubble bg-slate-900 text-white px-3 py-4"
            >
              <p className="text-xl">{userData?.name}</p>
            </div>
          )}
          <div className="flex flex-col gap-2 justify-between">
            <PiChatsFill
              onClick={() => navigate("/chat")} // Keep the navigation to the personal chat view
              data-tip="chat"
              className="cursor-pointer my-3 text-xl tooltip tooltip-open tooltip-top"
            />
            <div className="my-96">
              <BiLogOut
                onClick={() => window.location.reload()}
                data-tip="log out"
                className="cursor-pointer my-3 text-2xl"
              />
            </div>
          </div>
        </div>


        {/* Side bar container ends */}

        {/* Container to start chat */}
        <div
          className={`lg:flex ${
            chatSelected ? "hidden" : "flex"
          } w-full py-1 lg:w-4/12 h-full flex-col`}
        >
          <div className="w-full h-[4.4rem] flex items-center justify-center bg-slate-700 text-center">
            <div className="w-full flex items-center justify-center bg-slate-800">
              <BiSearch className="text-xl text-white mx-4" />
              <input
                onChange={handleSearchInputChange}
                type="text"
                placeholder="Search..."
                className="px-2 py-3 outline-none bg-transparent border-0 text-white w-full max-w-full"
              />
            </div>
          </div>
          <div className="w-full h-full bg-slate-700 overflow-y-auto overflow-x-hidden py-2">
            {filterItems(searchTerm)?.map((user, index) => (
              <ConversationCard key={user?._id + index} user={user} />
            ))}
          </div>
        </div>
      

        <div
          className={`${
            chatSelected ? "flex w-full" : "hidden"
          } w-10/12 rounded-xl h-full  lg:flex  flex-col`}
        >
          {chatSelected === "basic" ? <ChatCard /> : <DummyChatCard />}
        </div>

        {/* Container to show chats */}
      </div>
      <ToastContainer />
    </div>
  );
}
