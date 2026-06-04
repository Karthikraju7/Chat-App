import { createContext , useState, useContext, useEffect} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})
    const [userOrder, setUserOrder] = useState([]);

    const {socket, axios} = useContext(AuthContext);

    const getUsers = async () => {
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                console.log("Setting users:", data.users);
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages || {});
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getMessages = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const subscribeToMessages = () => {
        if (!socket) return;
        const handleNewMessage = (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prev) => [...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }));
                reorderUser(newMessage.senderId);
            }
        };
        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    };

    const reorderUser = (senderId) => {
        setUsers(prev => {
            const idx = prev.findIndex(u => u._id === senderId);
            if (idx <= 0) return prev;
            const updated = [...prev];
            const [user] = updated.splice(idx, 1);
            return [user, ...updated];
        });
    };

    const deleteMessage = async (messageId) => {
        try {
            const { data } = await axios.delete(`/api/messages/${messageId}`);
            if (data.success) {
                setMessages(prev => prev.filter(m => m._id !== messageId));
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const unsubscribeToMessages = async ()=> {
        if(socket) socket.off("newMessage");
    }

    useEffect(() => {
        const unsub = subscribeToMessages();
        return () => { if (unsub) unsub(); };
    }, [socket, selectedUser]);

    
    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser,
        unseenMessages, setUnseenMessages, deleteMessage
    }

    return(
        <ChatContext.Provider value={value} >
                {children}
        </ChatContext.Provider>
    )
}