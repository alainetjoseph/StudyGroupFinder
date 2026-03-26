import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Sparkles } from "lucide-react"
import Sidebar from "../components/Sidebar"

export default function AiChat() {

    const [messages, setMessages] = useState([])
    const [question, setQuestion] = useState("")
    const [loading, setLoading] = useState(false)

    const bottomRef = useRef(null)

    // Load chat history
    useEffect(() => {
        const saved = localStorage.getItem("aiMessages")

        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setMessages(parsed)
            } catch {
                setMessages([])
            }
        }
    }, [])

    // Save chat history
    useEffect(() => {
        if (messages.length > 0) {
            const limited = messages.slice(-50)
            localStorage.setItem("aiMessages", JSON.stringify(limited))
        }
    }, [messages])

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, loading])

    const sendMessage = async () => {

        if (!question.trim()) return

        const currentQuestion = question
        setQuestion("")

        const userMsg = {
            sender: "user",
            text: currentQuestion
        }

        setMessages(prev => {
            const updated = [...prev, userMsg]
            return updated.slice(-50)
        })

        setLoading(true)

        try {

            const res = await axios.post(
                "http://localhost:3000/ai/ask",
                { question: currentQuestion },
                { withCredentials: true }
            )

            const aiMsg = {
                sender: "ai",
                text: res.data.answer
            }

            setMessages(prev => {
                const updated = [...prev, aiMsg]
                return updated.slice(-50)
            })

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "AI service unavailable"

            setMessages(prev => {
                const updated = [...prev, { sender: "ai", text: message }]
                return updated.slice(-50)
            })

        }

        setLoading(false)
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            sendMessage()
        }
    }

    const clearChat = () => {
        localStorage.removeItem("aiMessages")
        setMessages([])
    }

    return (

        <div className="flex h-screen bg-gray-900">


            {/* Main Section */}
            <div className="flex flex-col flex-1 text-white">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">

                    <h1 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles size={20} />
                        AI Study Assistant
                    </h1>

                    <button
                        onClick={clearChat}
                        className="text-sm bg-red-500/20 px-3 py-1 rounded hover:bg-red-500/40"
                    >
                        Clear Chat
                    </button>

                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">

                            <Sparkles size={42} className="mb-4 opacity-80" />

                            <h2 className="text-xl font-semibold text-white">
                                AI Study Assistant
                            </h2>

                            <p className="text-sm mt-2">
                                Ask questions about coding, subjects, or study topics.
                            </p>

                        </div>
                    )}

                    {messages.map((msg, i) => (

                        <div
                            key={i}
                            className={`max-w-[70%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap
              ${msg.sender === "user"
                                    ? "bg-blue-600 self-end"
                                    : "bg-white/10 self-start"
                                }`}
                        >
                            {msg.text}
                        </div>

                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="bg-white/10 self-start px-4 py-3 rounded-lg flex gap-1 w-fit">
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    )}

                    <div ref={bottomRef}></div>

                </div>

                {/* Input */}
                <div className="border-t border-white/10 p-4 flex gap-3">

                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask something..."
                        className="flex-1 bg-gray-800 rounded-md px-4 py-2 text-sm focus:outline-none"
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 px-5 py-2 rounded-md hover:bg-blue-500 transition font-semibold"
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>
    )
}