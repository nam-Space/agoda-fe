import { callFetchChatbotMessages } from "config/api";
import { callCreateNewChat } from "config/api";

export async function createNewChat(data) {
    const res = await callCreateNewChat(data)
    return res.chatid;
}

export async function getChatMessages(chatid, debug = true, timestamp) {
    const params = new URLSearchParams({
        chatid,
        debug: debug.toString(),
    });

    if (timestamp) {
        params.append('timestamp', timestamp);
    }

    const res = await callFetchChatbotMessages(params.toString());
    return res
}

export async function sendMessage(
    question,
    chatid,
    callbacks
) {
    console.log('process.env.REACT_APP_CHAT_API_URL', process.env.REACT_APP_CHAT_API_URL)
    const response = await fetch(process.env.REACT_APP_CHAT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_AYD_API_KEY}`,
        },
        body: JSON.stringify({
            question,
            botid: process.env.REACT_APP_AYD_CHATBOT_ID,
            chatid,
            debug: true,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        callbacks.onError?.(error);
        return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
        callbacks.onError?.('No response body');
        return;
    }

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));

                        if (data.isText) {
                            callbacks.onText?.(data.content);
                        } else if (data.isSQL) {
                            callbacks.onSQL?.(data);
                        } else if (data.isImage) {
                            callbacks.onImage?.(data);
                        } else if (data.isExecutionStatus) {
                            callbacks.onExecutionStatus?.(data);
                        }
                    } catch (e) {
                        console.error('Failed to parse SSE data:', e);
                    }
                }
            }
        }

        callbacks.onEnd?.();
    } catch (error) {
        callbacks.onError?.(`Stream error: ${error}`);
    } finally {
        reader.releaseLock();
    }
}