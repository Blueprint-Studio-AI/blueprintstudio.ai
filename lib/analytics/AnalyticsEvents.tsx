import PageEvents from "./PageEvents";
import { internalTrafficScript } from "./track";

/**
 * The site's own analytics events, mounted once in the root layout: the
 * internal-traffic flag for Google Analytics, written into the HTML so it runs
 * before GA does, and the events every page records (PageEvents).
 */
export function AnalyticsEvents() {
    return (
        <>
            <script dangerouslySetInnerHTML={{ __html: internalTrafficScript }} />
            <PageEvents />
        </>
    );
}
