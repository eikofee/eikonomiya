export default function smallField({content}: {content: React.ReactNode}) {
    return <div className="flex flex-row text-sm h-full text-ellipsis bg-slate-100/70 rounded-md justify-between px-1 items-center text-center w-1/3 relative">
        {content}
    </div>
}