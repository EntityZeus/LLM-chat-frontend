import type { Message } from '../Components/chat-content/chat-content';

export const getResponseForMessage = async (message: string, history: Message[] = []) => {
    try{
        const apiRes = await fetch('http://localhost:3000/api/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({message: message, history: history})
        });

        if (!apiRes.ok) {
            throw new Error(`HTTP error! Status: ${apiRes.status}`);
        }

        const data = await apiRes.json();
        return data;
    }catch(err) {
        console.log(err);
    }
}