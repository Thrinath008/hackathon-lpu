import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  senderUid: string;
  receiverUid: string;
  content: string;
  timestamp: string;
}

interface ChatModalProps {
  friend: { uid: string; name: string };
  onClose: () => void;
}

export default function ChatModal({ friend, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      console.log("No user, skip fetch");
      return;
    }

    console.log(`Listen messages: ${currentUser.uid} ↔ ${friend.uid}`);
    const q1 = query(
      collection(db, "messages"),
      where("senderUid", "==", currentUser.uid),
      where("receiverUid", "==", friend.uid),
      orderBy("timestamp", "asc")
    );
    const q2 = query(
      collection(db, "messages"),
      where("senderUid", "==", friend.uid),
      where("receiverUid", "==", currentUser.uid),
      orderBy("timestamp", "asc")
    );

    let allMessages: Message[] = [];

    const updateMessages = () => {
      setMessages([...allMessages.sort((a, b) => a.timestamp.localeCompare(b.timestamp))]);
    };

    const unsub1 = onSnapshot(q1, (snap) => {
      snap.docChanges().forEach((change) => {
        const msg = { id: change.doc.id, ...change.doc.data() } as Message;
        if (change.type === "added") {
          allMessages.push(msg);
        } else if (change.type === "modified") {
          const idx = allMessages.findIndex(m => m.id === msg.id);
          if (idx !== -1) allMessages[idx] = msg;
        } else if (change.type === "removed") {
          allMessages = allMessages.filter(m => m.id !== msg.id);
        }
      });
      updateMessages();
      console.log("Messages updated from q1:", allMessages);
    }, (e) => {
      console.error("q1 error:", e.message);
      alert(`Load failed: ${e.message}`);
    });

    const unsub2 = onSnapshot(q2, (snap) => {
      snap.docChanges().forEach((change) => {
        const msg = { id: change.doc.id, ...change.doc.data() } as Message;
        if (change.type === "added") {
          allMessages.push(msg);
        } else if (change.type === "modified") {
          const idx = allMessages.findIndex(m => m.id === msg.id);
          if (idx !== -1) allMessages[idx] = msg;
        } else if (change.type === "removed") {
          allMessages = allMessages.filter(m => m.id !== msg.id);
        }
      });
      updateMessages();
      console.log("Messages updated from q2:", allMessages);
    }, (e) => {
      console.error("q2 error:", e.message);
      alert(`Load failed: ${e.message}`);
    });

    return () => {
      unsub1();
      unsub2();
      console.log("Unsubscribed listeners");
    };
  }, [currentUser, friend.uid]);

  const sendMessage = async () => {
    if (!currentUser) return alert("Log in to send");
    if (!newMessage.trim()) return alert("Empty message");

    try {
      console.log(`Send from ${currentUser.uid} to ${friend.uid}`);
      await addDoc(collection(db, "messages"), {
        senderUid: currentUser.uid,
        receiverUid: friend.uid,
        content: newMessage,
        timestamp: new Date().toISOString()
      });
      setNewMessage("");
      console.log("Message sent");
    } catch (e: any) {
      console.error("Send error:", e.message);
      alert(`Send failed: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm glass border-brand-purple/20 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-brand-purple truncate">Chat with {friend.name}</h2>
            <Button variant="ghost" onClick={onClose} className="text-brand-pink p-1">
              Close
            </Button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto mb-3 p-3 bg-white/80 rounded-lg">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center text-sm">No messages</p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                    msg.senderUid === currentUser?.uid
                      ? "bg-brand-purple/20 ml-auto"
                      : "bg-brand-lightPurple/20 mr-auto"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="bg-white/80 border-brand-lightPurple text-base py-2"
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} className="bg-brand-pink hover:bg-brand-purple/80 text-base py-2">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}