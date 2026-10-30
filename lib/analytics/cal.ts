import { useEffect } from "react";
import { track } from "./track";

/**
 * Records bookings made in a Cal.com embed: booking_made when the booking goes
 * through (Cal's bookingSuccessfulV2 action), booking_error if the calendar
 * fails to load. `namespace` is the embed's own, which also names which page's
 * calendar it was. Nothing about the booking itself (names, times) is sent.
 */
export function useCalBookings(namespace: string) {
    useEffect(() => {
        let cancelled = false;
        let stop: (() => void) | undefined;
        // The embed's own module, loaded as the calendar loads it, so it stays out of the page's first bundle.
        import("@calcom/embed-react")
            .then(({ getCalApi }) => getCalApi({ namespace }))
            .then((cal) => {
                if (cancelled) return;
                const booked = () => track("booking_made", { calendar: namespace });
                const failed = (e: CustomEvent<{ data?: { code?: string } }>) =>
                    track("booking_error", { calendar: namespace, code: e.detail?.data?.code });
                cal("on", { action: "bookingSuccessfulV2", callback: booked });
                cal("on", { action: "linkFailed", callback: failed });
                // The namespace outlives this component (a return visit to the page reuses it), so let go on unmount.
                stop = () => {
                    cal("off", { action: "bookingSuccessfulV2", callback: booked });
                    cal("off", { action: "linkFailed", callback: failed });
                };
            })
            .catch(() => {});
        return () => {
            cancelled = true;
            stop?.();
        };
    }, [namespace]);
}
