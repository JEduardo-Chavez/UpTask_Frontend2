import { useDroppable } from "@dnd-kit/core"

type DropTaskProps = {
    status: string
}

export default function DropTask({status}: DropTaskProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: status
    })

    const style = {
        opacity : isOver ? 0.4 : undefined,
        backgroundColor: isOver ? 'black' : undefined
    }
    
    return (
        <div
            style={style}
            ref={setNodeRef}
            className="text-sm text-slate-400 font-semibold uppercase border border-dashed border-slate-400 p-2 mt-5 grid place-content-center"
        >
            Arrastrar aquí - {status}
        </div>
    )
}
