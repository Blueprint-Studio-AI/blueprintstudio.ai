import { defineComponent } from "@blueprint-studio/galley";
import { YouTube } from "@blueprint-studio/galley/contracts";
import { YouTubePlayer } from "./youtube-player";

// Shows the video's thumbnail and loads YouTube's player only when the reader presses
// play: fast pages, and no YouTube cookies until then.

export const youtube = defineComponent({
  ...YouTube,
  examples: [{ title: "A video", props: { id: "aqz-KE-bpKQ", title: "Big Buck Bunny" } }],
  Component: (props) => (
    <figure className="relative my-10 aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900">
      <YouTubePlayer {...props} />
    </figure>
  ),
});
