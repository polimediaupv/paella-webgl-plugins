import React, { useState, useRef, useEffect } from 'react';
import { useChat } from "./react-chat";
import "./Chat.css";

//model: 'Phi-3-mini-4k-instruct-q4f16_1-MLC',
//model: 'Llama-3.2-3B-Instruct-q4f32_1-MLC',
// baseUrl: "http://localhost:11434"
export default function Chat({ promptMessage: initialPromptMessage, model = 'Llama-3.1-8B-Instruct-q4f32_1-MLC', baseUrl = "webllm" }) {
    const [promptMessage, setPromptMessage] = useState(initialPromptMessage);
    // const [inputText, setInputText] = useState(initialPromptMessage);
    const {
        input, setInput,
        messages,
        submitMessage,
        ready,
        processing,
        progressMessage
    } = useChat({
        promptMessage,
        model,
        baseUrl
    });
    const inputRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        if (ready && !processing) {
            inputRef.current?.focus();
        }
    }, [ready, processing]);

    useEffect(() => {
        listRef.current?.scrollTo(0, listRef.current?.scrollHeight);
    }, [messages]);

    const handleSubmitPrompt = (e) => {
        e.preventDefault();
        setPromptMessage(e.currentTarget.promptMessage?.value);
    }

    return (
        <section className="llm-chat">
            { /*
            <header>
                <form onSubmit={handleSubmitPrompt}>
                    <textarea id="promptMessage" value={inputText} onChange={e => setInputText(e.target.value)} />
                    <button>Cambiar Personaje</button>
                </form>
            </header>
            */ }
            {ready ? <article>
                    <ul ref={listRef}>
                        {messages.map((msg, i) => <li key={i} className={`msg-role-${msg.role}`}>{msg.text}</li>)}
                    </ul>
                </article> : <article></article>
            }
            {
                ready ? <footer>
                    <form onSubmit={submitMessage}>
                        <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={processing} />
                    </form>
                </footer>
                : 
                <div>{progressMessage}</div>
            }
        </section>
    )
}
