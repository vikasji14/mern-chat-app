import React, { useRef, useEffect } from "react"
import { AiOutlineSend  , AiOutlineClose } from "react-icons/ai"
import { RxCross2 } from "react-icons/rx"
import { CiFaceSmile } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux"
import {
  setChatSelected,
  setMessages,
  setSomeoneTyping
} from "../../slices/chatSlice"
import { socket } from "../../App"
import { toast } from "react-toastify"
import { send_message } from "../../services"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
export default function ChatCard() {
  const dispatch = useDispatch()
  const typingOn = useSelector(state => state.Chat.typing)
  const TyperID = useSelector(state => state.Chat.typerID)
  const [typing, setTyping] = React.useState(false)
  const messageContainerRef = useRef(null)
  const [sendMessage, setSendMessage] = React.useState("")
  const user = useSelector(state => state.User.user)
  const receiver = useSelector(state => state.Chat.receiverSelected)
  const messages = useSelector(state => state.Chat.messages)
  const token = useSelector(state => state.User.token)

  React.useEffect(() => {
    if (
      TyperID?.receiverId === user?._id &&
      TyperID?.senderId !== user?._id &&
      typingOn &&
      receiver?._id === TyperID?.senderId
    ) {
      setTyping(true)
    } else {
      setTyping(false)
    }
  }, [TyperID, typingOn, user, receiver, sendMessage])

  useEffect(() => {
    if (sendMessage !== "") {
      dispatch(setSomeoneTyping(true))
    } else {
      dispatch(setSomeoneTyping(false))
    }
  }, [sendMessage])

  const handleSendMessage = async e => {
    e.preventDefault()

    if (!sendMessage || !user || !receiver )
      return toast.error("Please type something")
    const messageData = {
      message: sendMessage,
      senderId: user?._id,
      receiverId: receiver?._id
    }

    socket.emit("sendMsg", messageData)

    const res = await send_message(messageData, token)
    if (res?.success) {
      toast.success(res?.message)
    } else {
      toast.error(res?.message)
    }
    setSendMessage("")
  }

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    socket.on("sendMsg", data => {
      dispatch(setMessages(data))
    })

    return () => {
      socket.off("sendMsg")
    }
  }, [])

 
  return (
    <>
    <div className="w-full h-20 flex items-center justify-between bg-slate-600 text-center">
      <div className="flex ">
        <div className="avatar mx-4 placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
            <span className="text-xs">{receiver?.name.substring(0, 2)}</span>
          </div>
        </div>
        <div className="flex flex-col text-left py-2">
          <h1 className="text-white/90 font-semibold tracking-widest text-sm uppercase">
            {receiver?.name}
          </h1>
          {typing && (
            <p className="text-xs text-white/90 tracking-widest font-semibold">
              Typing...
            </p>
          )}
        </div>

      </div>


  
      <button
        onClick={() => dispatch(setChatSelected(false))}
        className="text-white/90 mx-4"
      >
        <RxCross2 className="text-2xl" />
      </button>
    </div>
    <hr className="my-0 border-t-2 border-gray-300" />


  
    <div
      ref={messageContainerRef}
      className="w-full bg-slate-600 h-full px-4 py-2 overflow-y-auto"
    >
      {messages.map((message, i) => {
        const isSender = message.receiver === user?._id;
        const chatClass = isSender ? "chat-start" : "chat-end";
        return (
          <div key={i} className={`chat ${chatClass} md:pl-8 md:pr-8 text-sm `}>
            <div className="chat-bubble">{message.message}</div>
          </div>
        );
      })}
    </div>
  
    <form
      onSubmit={handleSendMessage}
      className="h-20 bg-slate-600 flex items-center justify-start px-4"
    >
      <input
        value={sendMessage}
        onChange={(e) => setSendMessage(e.target.value)}
        type="text"
        placeholder="Type here"
        className="input bg-slate-600 text-white input-bordered w-full max-w-full"
      />
      <button type="submit" className="btn btn-circle btn-primary mx-3">
        <AiOutlineSend className="text-xl" />
      </button>
     
    </form>

    <>

    </>
  </>
  

  )
}






