// Client quotes the industry and service pages can cite by id. Each one is
// verbatim from the site (the source is noted), so a page never paraphrases a
// client. The home page and /brand still keep their own lists; they can move
// here when those files are next touched.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  image?: string;
}

export const testimonials = {
  // components/Home/TestimonialSection.tsx
  "shina-foo": {
    quote:
      "What sets Blueprint apart is the quality of their end-to-end design and engineering work. They quickly understood what we needed and made collaboration with our internal team feel effortless. Blueprint is absolutely the perfect fit for a lean, design-forward business that values both aesthetics and function!",
    name: "Shina Foo",
    role: "Head of Growth",
    company: "Perena",
    image: "/testimonials/shina-foo-perena.jpg",
  },
  // components/LaunchVideos/TestimonialTicker.tsx
  "daniel-greene": {
    quote:
      "Anyone who sees the video buys the product. Working with you guys is like eating chocolate. We can't go back.",
    name: "Daniel Greene",
    role: "COO",
    company: "TokenWorks",
    image: "/testimonials/daniel-greene.jpg",
  },
} satisfies Record<string, Testimonial>;

export type TestimonialId = keyof typeof testimonials;
