import { Link } from "react-router-dom";

import PageContainer from "../components/layout/PageContainer";

function NotFound() {
    return (
        <PageContainer size="lg" className="py-24 text-center">
            <p className="eyebrow">404</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                That page does not exist
            </h1>
            <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
                The link may be out of date. Everything lives on three pages.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                    to="/"
                    className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                    Home
                </Link>
                <Link
                    to="/predict"
                    className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-300 dark:hover:text-slate-100"
                >
                    Score a profile
                </Link>
            </div>
        </PageContainer>
    );
}

export default NotFound;
