import { Button } from "@my/ui";
import { capitalize } from "@my/utils";

export default function App() {
  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold text-purple-600">
        web app using @my/ui and @my/utils
      </h1>
      <Button>Click Me from UI Package</Button>
      <p>{capitalize("hello")}</p>
    </main>
  );
}
