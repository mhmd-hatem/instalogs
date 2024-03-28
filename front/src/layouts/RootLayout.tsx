import { EventsPage } from "../components";
import SocketWrapper from "./hoc/SocketWrapper";

export default function RootLayout() {
  return (
    <SocketWrapper>
      {(socketRef, setIsConnectedRef) => (
        <EventsPage socketRef={socketRef} ref={setIsConnectedRef} />
      )}
    </SocketWrapper>
  );
}
