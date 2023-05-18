import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "react-use";

const initialNotesData = [
    {
        id: 1,
        title: "Welcome to the Note Taker!",
        description: "Make your notes here!",
        isCompleted: false,
        dueDate: new Date().setDate(new Date().getDate() +1),// Current time but one day in the future
        createdAtData: Date.now()
    }
]

/**
 * 
 * Runs automatically when a dispatch function is called.
 * instruction.type determines _how_ we edit the state
 * The reducer must return something, otherwise state is set to null
 * What is returned, is the new state
 * @param instructions Object containing a "type" to be used by the switch, and whatever other property is expected as per the switch statement that matches tye type. 
 * @returns New state, edited based on instructions provided
 */

const notesReducer = (previousState, instructions) => {
    let stateEditable = [...previousState]

    switch (instructions.type){
        case "setup":
            console.log("Apply persistent data to state now.")

            // instructions.data is provided when the dispatch function is called
            stateEditable = instructions.data

            //Whatever is returned is now the newest version of state
            return stateEditable


        case "create":
            console.log("TODO: Create note and add to state")

            let newNote = instructions.newNote
            stateEditable.push(newNote)
            
            return stateEditable

        case "update":
            console.log('TODO: Update specific note and overwrite it in state')
            break
        case "delete":
            console.log ("TODO: Delete note from state")
            break
        case "sortByDueDate":
            console.log ("Sorted state data by due date")
            break
        case "sortByCreatedDate":
            console.log ("Sorted state by created at date")
            break
        case "sortById":
            console.log("Sort by ID, this is the default order")
            break
        default:
            console.log("Invalid instruction type provided, it was: " + instructions.type)
            return previousState
    }
}

//This is how we make our reducer state and reducer dispatch global
export const NoteDataContext = createContext(null)
export const NoteDispatchContext = createContext(null)

//Custom hooks, that just provide direct access to one part of the reducer
// eg. read-only data:
export function useNoteData() {
    return useContext(NoteDataContext)
}

// function to modify the data:
export function useNoteDispatch(){
    return useContext(NoteDispatchContext)
}

/**
 * NotesProvider wraps around the component tree. Any child component has access to this note data via useNoteDispatch
 * @param {*} props props.children should be a JSX element. This NotesProvider wraps around that element. 
 */
export default function NotesProvider(props){
    const [notesData, notesDispatch] = useReducer(notesReducer, initialNotesData)

    const [persistentData, setPersistentData] = useLocalStorage('notes', initialNotesData)

    useEffect(()=> {
        // On app start, overwrite notesData with persistentData
        notesDispatch({type:"setup", data: persistentData})
    }, [])

    useEffect(() => {
        console.log("Local storage: " + persistentData)
    }, [persistentData])

    useEffect(() => {
        setPersistentData(notesData)
    }, [notesData])

    return (
        <NoteDataContext.Provider value={notesData}>
            <NoteDispatchContext.Provider value={notesDispatch}>
                {props.children}
            </NoteDispatchContext.Provider>
        </NoteDataContext.Provider>
    )
}