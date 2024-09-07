import About from "./_home/About";
import CurrentResearch from "./_home/CurrentResearch";
import Features from "./_home/Features";
import Hero from "./_home/Hero";
import Team from "./_home/Team";

export default async function Index() {
  return (
    <>
      {/* <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}
      <>
        <Hero />
        <Features />
        <About />
        <Team />
        <CurrentResearch />
      </>
    </>
  );
}
