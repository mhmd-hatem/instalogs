import { Button, Input } from "@nextui-org/react";
// import { LuListFilter } from "react-icons/lu";
import { IoDownload } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { RefObject } from "react";
import CSVHelper from "../utils/CSVHelper";

type TopBarProps = {
  socket: RefObject<Socket | null>;
  eventsRef: React.RefObject<TEvent[]>;
  isLive: boolean;
  where: {
    [key: string]: { [key: string]: string };
  };
  setWhere: React.Dispatch<
    React.SetStateAction<{ [key: string]: { [key: string]: string } }>
  >;
  setFilter: React.Dispatch<
    React.SetStateAction<{
      [key: string]: { [key: string]: string | number | boolean };
    }>
  >;
};

export default function TopBar({
  socket,
  eventsRef,
  isLive,
  where,
  setWhere,
}: TopBarProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full min-h-[8vh] flex gap-0 rounded-lg p-5">
        <div className="flex-1">
          <Input
            placeholder="Search"
            variant="bordered"
            value={where?.actor?.email ?? ""}
            classNames={{
              inputWrapper: "ltr:rounded-r-none rtl:rounded-l-none",
            }}
            onChange={(e) => {
              setWhere({
                action: {
                  // slug: e.target.value,
                  name: e.target.value,
                },
                actor: {
                  // slug: e.target.value,
                  email: e.target.value,
                  first_name: e.target.value,
                  last_name: e.target.value,
                },
                target: {
                  // slug: e.target.value,
                  email: e.target.value,
                  first_name: e.target.value,
                  last_name: e.target.value,
                },

                team: {
                  // slug: e.target.value,
                  name: e.target.value,
                },
                incident: {
                  // slug: e.target.value,
                  description: e.target.value,
                },
              });
            }}
          />
        </div>

        {/* <Button className="border border-solid border-default-200 rounded-none items-center font-semibold flex text-neutral-500 bg-transparent shadow-sm p-4">
          <LuListFilter /> FILTER
        </Button> */}
        <Button
          onPress={() => {
            const csvHelper = new CSVHelper();
            const csvData = csvHelper.generateCSVData(eventsRef.current ?? []);
            csvHelper.downloadCSVFile(
              csvData,
              `instalogs-${new Date().toISOString()}.csv`
            );
          }}
          className="rounded-none border-x-0 bg-transparent border-default-200 border items-center flex border-solid font-semibold text-neutral-500 shadow-sm p-4"
        >
          <IoDownload /> EXPORT
        </Button>
        <Button
          onPress={() => {
            if (isLive) socket.current?.disconnect();
            else socket.current?.connect();
          }}
          className="bg-transparent border border-solid border-default-200 rounded-l-none items-center flex font-semibold text-neutral-500 shadow-sm p-4"
        >
          <div
            className={`w-3 h-3 rounded-full transition-all z-20 !duration-500 ${
              isLive
                ? "bg-rose-700 shadow-inner shadow-rose-600 animate-spin"
                : "bg-rose-900"
            }`}
          ></div>
          LIVE
        </Button>
      </div>
      <div className="grid grid-cols-3 w-full px-8 pb-2 h-[3.5%] mb-2">
        <span className="font-semibold text-neutral-500">ACTOR</span>
        <span className="font-semibold text-neutral-500">ACTION</span>
        <span className="font-semibold text-neutral-500">DATE</span>
      </div>
    </div>
  );
}
