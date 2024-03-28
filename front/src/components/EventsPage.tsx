import React, {
  forwardRef,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import TopBar from "./TopBar";
import Content from "./Content";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import useModal from "../hooks/useModalStore";

type EventsPageProps = {
  socketRef: React.RefObject<Socket | null>;
};

const EventsPage = forwardRef(({ socketRef }: EventsPageProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { event, isOpen: isOpenModal, setIsOpen } = useModal();

  const eventsRef = useRef<TEvent[]>([]);
  const setEventsRef = (events: TEvent[]) => {
    eventsRef.current = events;
  };
  useEffect(() => {
    if (isOpenModal) {
      onOpen();
    }
  }, [isOpenModal, onOpen]);

  const [isLive, setIsLive] = useState(false);
  const [where, setWhere] = useState<{
    [key: string]: { [key: string]: string };
  }>({
    action: {
      // slug: "",
      name: "",
    },
    actor: {
      // slug: "",
      email: "",
      first_name: "",
      last_name: "",
    },
    target: {
      // slug: "",
      email: "",
      first_name: "",
      last_name: "",
    },

    team: {
      // slug: "",
      name: "",
    },
    incident: {
      // slug: "",
      description: "",
    },
  });
  const [filter, setFilter] = useState<{
    [key: string]: { [key: string]: string | number | boolean };
  }>({});
  const deferredWhere = useDeferredValue(where);

  useImperativeHandle(ref, () => setIsLive, [setIsLive]);

  return (
    <>
      <div
        dir="ltr"
        className="flex flex-col w-full max-h-screen overflow-hidden rounded-[15px] bg-neutral-100"
      >
        <TopBar
          socket={socketRef}
          eventsRef={eventsRef}
          isLive={isLive}
          where={where}
          setWhere={setWhere}
          setFilter={setFilter}
        />
        <Content
          socket={socketRef}
          setEventsRef={setEventsRef}
          where={deferredWhere}
          filter={filter}
        />
      </div>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          onClose();
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader></ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-3 gap-8">
                  <div className="flex flex-col w-full">
                    <span className="font-bold mb-1 text-neutral-400">
                      ACTOR
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Name</span>
                      <span className="col-span-2">
                        {event?.actor.fName} {event?.actor.lName}
                      </span>
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Email</span>
                      <span className="col-span-2">{event?.actor.email}</span>
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Slug</span>
                      <span className="col-span-2">{event?.actor.slug}</span>
                    </span>
                  </div>
                  <div className="flex flex-col w-full">
                    <span className="font-bold mb-1 text-neutral-400">
                      ACTION
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Name</span>
                      <span className="col-span-2"> {event?.action.name}</span>
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Slug</span>
                      <span className="col-span-2">{event?.action.slug}</span>
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Description</span>
                      <span className="col-span-2">
                        {event?.action.description}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col w-full">
                    <span className="font-bold mb-1 text-neutral-400">
                      DATE
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Timestamp</span>
                      <span className="col-span-2">
                        {event?.createdAt.getTime()}
                      </span>
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">ISOS</span>
                      <span className="col-span-2">
                        {event?.createdAt.toISOString()}
                      </span>
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Readable</span>
                      <span className="col-span-2">
                        {event?.createdAt.toLocaleString()}
                      </span>
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Full</span>
                      <span className="col-span-2">
                        {event?.createdAt.toString()}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col w-full">
                    <span className="font-bold mb-1 text-neutral-400">
                      METADATA
                    </span>
                    <span className="w-full grid grid-cols-3">
                      <span className="text-neutral-400">Location</span>
                      <span className="col-span-2">
                        {event?.location ?? "No location"}
                      </span>
                    </span>
                  </div>
                  {event?.targetUser && (
                    <div className="flex flex-col w-full">
                      <span className="font-bold mb-1 text-neutral-400">
                        TARGET
                      </span>
                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Type</span>
                        <span className="col-span-2">user</span>
                      </span>
                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Name</span>
                        <span className="col-span-2">
                          {event?.targetUser.fName} {event?.targetUser.lName}
                        </span>
                      </span>
                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Email</span>
                        <span className="col-span-2">
                          {event?.targetUser.email}
                        </span>
                      </span>
                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Slug</span>
                        <span className="col-span-2">
                          {event?.targetUser.slug}
                        </span>
                      </span>
                    </div>
                  )}
                  {event?.team && (
                    <div className="flex flex-col w-full">
                      <span className="font-bold mb-1 text-neutral-400">
                        TARGET
                      </span>
                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Type</span>
                        <span className="col-span-2">team</span>
                      </span>
                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Name</span>
                        <span className="col-span-2">{event?.team.name}</span>
                      </span>

                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Slug</span>
                        <span className="col-span-2">{event?.team.slug}</span>
                      </span>
                    </div>
                  )}
                  {event?.incident && (
                    <div className="flex flex-col w-full">
                      <span className="font-bold mb-1 text-neutral-400">
                        TARGET
                      </span>
                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Type</span>
                        <span className="col-span-2">incident</span>
                      </span>
                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Name</span>
                        <span className="col-span-2">
                          {event?.incident?.name}
                        </span>
                      </span>

                      <span className="w-full grid grid-cols-3">
                        <span className="text-neutral-400">Slug</span>
                        <span className="col-span-2">
                          {event?.incident.slug}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});

export default EventsPage;
