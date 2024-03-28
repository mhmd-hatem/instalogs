import { Avatar } from "@nextui-org/react";
import useModal from "../hooks/useModalStore";

interface EventEntryProps {
  event: TEvent;
}

export default function EventEntry({ event }: EventEntryProps) {
  const { setEvent, setIsOpen } = useModal();

  return (
    <div
      onClick={() => {
        setEvent(event);
        setIsOpen(true);
      }}
      className="grid grid-cols-3 col-span-3 group w-full min-h-24 h-24 transition-all rounded-md !duration-300 cursor-pointer hover:bg-neutral-300 items-center px-2 no-scrollbar"
    >
      <div className="flex gap-3">
        <div className="flex gap-3 items-center h-7 ">
          <Avatar
            name={event.actor.fName[0]}
            classNames={{
              name: "font-semibold text-lg text-neutral-200 group-hover:-rotate-180 transition-all !duration-500",
              base: "bg-gradient-to-br group-hover:rotate-180 transition-all !duration-500 from-[#f97794] via-[#6200ff] to-[#3498db]",
            }}
          />
        </div>
        <div className="flex items-center h-7">
          <p>{event.actor.email}</p>
        </div>
      </div>
      <div className="flex items-center h-7">
        <span>{event.action.name}</span>
      </div>
      <div className="flex items-center h-7">
        <p>{event.createdAt.toString()}</p>
      </div>
    </div>
  );
}
