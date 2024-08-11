import { useParams } from "react-router-dom";
import { Message } from "./message";
import { getRoomMessages } from "../http/get-room-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMessagesWebsockets } from "../hooks/use-messages-websocket";

export function Messages() {
    const { roomId } = useParams()

    if(!roomId){
        throw new Error('Messages components must be used within room page')
    }

    //React 19
    // const { messages } = use(getRoomMessages({roomId}))
    // console.log(messages)

    // O React Query faz um cache automático das requisições que possuem queryKey
    const { data } = useSuspenseQuery({
        queryKey: ['messages', roomId], 
        queryFn: () => getRoomMessages({roomId}),
    })
    // Na queryKey temos que incluir todas as variavéis que estamos usando na queryFn
    // Caso tenhamos requisições acontecendo pra roomId diferentes, se eu não diferencio a sala no queryKey, eu acabo aproveitando o cache de uma sala dentro de outra sala
    // useSuspenseQuery porque eu envolvi esse componente com useSuspenseQuery

    useMessagesWebsockets({roomId})

    return (
        <ol className="list-decimal list-outside px-3 space-y-8">
            {data.messages.map(message => {
                return (
                    <Message key={message.id} id={message.id} text={message.text} amountOfReactions={message.amountOfReactions} answered={message.answered} />
                )
            })}
        </ol>
    )
}