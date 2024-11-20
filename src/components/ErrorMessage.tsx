
export default function ErrorMessage({children} : {children: React.ReactNode}) {
    return (
        <div className="text-center text-red-500 bg-red-100 font-bold uppercase text-sm my-4 p-2">
            {children}
        </div>
    )
}
