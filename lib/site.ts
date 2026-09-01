export const site = {
  name: "Fresh Paws Dog Wash",
  shortName: "Fresh Paws",
  address: "43-46 44th St, Sunnyside, NY 11104",
  phoneDisplay: "(929) 792-1337",
  phoneHref: "tel:+19297921337",
  directionsHref:
    "https://www.google.com/maps/search/?api=1&query=Fresh%20Paws%20Dog%20Wash%20self%20serve%2C%2043-46%2044th%20St%2C%20Sunnyside%2C%20NY%2011104",
  googleListingHref:
    "https://www.google.com/maps/place/Fresh+Paws+Dog+Wash+self+serve/@40.7438368,-73.9205749,17z/data=!4m6!3m5!1s0x89c25f69eae2aaaf:0xfa11cc741c390f45!8m2!3d40.7438368!4d-73.9205749!16s%2Fg%2F11ntd8_40f",
} as const;

export const googleReviews = [
  {
    author: "Evelyn Moreno",
    quote: "Excellent service, great price and a friendly environment :)",
  },
  {
    author: "Félix caro",
    quote: "The best thing that can happen in Sunnyside",
  },
  {
    author: "Sheena Marie",
    quote:
      "We’re so grateful to have this new place in the neighborhood! The facilities are clean, the staff are so helpful and kind…",
  },
] as const;

export const googlePhotos = [
  {
    src: "/images/photo-1-storefront.png",
    alt: "Fresh Paws storefront on 44th Street in Sunnyside",
    width: 1195,
    height: 900,
  },
  {
    src: "/images/photo-2-tubs.png",
    alt: "Two stainless steel self-service dog wash tubs with towels and dryers",
    width: 1200,
    height: 900,
  },
  {
    src: "/images/photo-3-stations.png",
    alt: "Fresh Paws wash stations with raised tubs, steps, and wall-mounted dryers",
    width: 900,
    height: 1200,
  },
] as const;

export const washSteps = [
  {
    number: "01",
    title: "Pick your wash",
    body: "Settle your pup into an easy-entry tub and choose the products that fit their coat.",
  },
  {
    number: "02",
    title: "Scrub + rinse",
    body: "Use pro tools at a comfortable height. No bathtub crouch, clogged drain, or soaked bathroom.",
  },
  {
    number: "03",
    title: "Dry + strut",
    body: "Towel off, finish with the dryer, and head home with a fresher dog and zero cleanup.",
  },
] as const;

export const included = [
  "Raised wash station",
  "Coat-friendly shampoo",
  "Conditioner",
  "Fresh towels",
  "Professional dryer",
  "Apron + cleanup",
] as const;

export const faqs = [
  {
    question: "Do I need to bring anything?",
    answer:
      "Just your dog and their leash. Shampoo, conditioner, towels, and the dryer are all provided on site.",
  },
  {
    question: "Do I need a reservation?",
    answer:
      "Reservations are recommended on weekends, but walk-ins are always welcome. You can book a time right on this site.",
  },
  {
    question: "Can I wash a large dog?",
    answer:
      "Yes. Our raised tubs fit dogs of all sizes, and the adjustable stations keep you comfortable while you wash.",
  },
  {
    question: "How long does a wash take?",
    answer:
      "Most self-serve washes take about 30–45 minutes, including drying. You can take your time on the tub.",
  },
] as const;
