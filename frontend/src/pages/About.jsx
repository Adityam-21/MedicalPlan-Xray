import Hero from "../components/about/Hero";
import StatsCards from "../components/about/StatsCards";
import Workflow from "../components/about/Workflow";
import TechStack from "../components/about/TechStack";
import FeatureGrid from "../components/about/FeatureGrid";
import Architecture from "../components/about/Architecture";
import CTA from "../components/about/CTA";

function About() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-emerald-50/30 py-24">

            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10 overflow-hidden">

                <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-300/15 blur-3xl"></div>

                <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-emerald-300/15 blur-3xl"></div>

                <div className="absolute left-1/3 top-1/2 h-80 w-80 rounded-full bg-cyan-200/10 blur-3xl"></div>

                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#64748b 1px, transparent 1px), linear-gradient(to right,#64748b 1px, transparent 1px)",
                        backgroundSize: "42px 42px",
                    }}
                />

            </div>

            <div className="mx-auto max-w-screen-xl px-6 lg:px-10">

                <section className="mb-28">
                    <StatsCards />
                </section>

                <section className="mb-28">
                    <Workflow />
                </section>

                <section className="mb-28">
                    <TechStack />
                </section>

                <section className="mb-28">
                    <FeatureGrid />
                </section>

                <section className="mb-28">
                    <Architecture />
                </section>

                <CTA />

            </div>

        </main>
    );
}

export default About;