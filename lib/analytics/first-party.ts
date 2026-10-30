// Our own collector: batches events and sends them to the site's own endpoint.
// A no-op until the first-party analytics work fills it in.

import type { EventProps } from "./track";

export function sendFirstParty(_name: string, _props: EventProps) {}
