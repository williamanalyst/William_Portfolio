import { readContent } from "../content/store";
import Portfolio from "./portfolio";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { published } = await readContent();
  return <Portfolio site={published} />;
}
