import { Message } from "./message.model";

export interface Contact{
    _id: string,
    user: string,
    chat: string,
    lastMessage: Message
}