import { NextUIProvider } from "@nextui-org/react";
import RootLayout from "./layouts/RootLayout";

function App() {
  return (
    <NextUIProvider className="h-full">
      <RootLayout />
    </NextUIProvider>
  );
}

export default App;
