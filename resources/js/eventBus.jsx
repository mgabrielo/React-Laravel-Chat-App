import { useContext } from "react";
import { useState, createContext } from "react";

export const EventBusContext = createContext()

export const EventBusProvider = ({ children }) => {
    const [events, setEvents] = useState({})
    const emit = (name, data) => {
        if (events[name]) {
            for (let callbck of events[name]) {
                callbck(data)
            }
        }
    }

    const on = (name, callbck) => {
        if (!events[name]) {
            events[name] = []
        }
        events[name].push(callbck)

        return () => {
            events[name] = events[name].filter((callback) => callback !== callbck)
        }
    }

    return (
        <EventBusContext.Provider value={{ on, emit }}>
            {children}
        </EventBusContext.Provider>
    )
}


export const useEventBus = () => {
    return useContext(EventBusContext)
}