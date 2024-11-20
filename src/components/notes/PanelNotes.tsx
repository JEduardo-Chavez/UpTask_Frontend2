import { Task } from "@/types/index"
import AddNotesForm from "./AddNotesForm"
import NoteDetails from "./NoteDetails"

type PanelNotesProps = {
  note: Task['note']
}

export default function PanelNotes({note}: PanelNotesProps) {
  return (
    <>
      <AddNotesForm/>
      <div className=" divide-y divide-gray-300 mt-10">
        {note.length ? (
          <>
            <p className="font-bold text-slate-600 text-2xl my-5">Notas:</p>
            {note.map(note => <NoteDetails key={note._id} note={note}/>)}
          </>
        ) : <p className="text-center font-light italic text-slate-500">No hay notas aun</p> }
      </div>
    </>
  )
}
