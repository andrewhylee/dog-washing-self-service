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
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkgrkF2HXjqe8PfzFztcSoRZ__cj4zU_4Zir7-6Wc_I5Ye7DY4DhvZvb-5CsbzdWRkZovG4JphgV-myfd2JZYBQTAwSTzOKQbKjpaX1nGvmYp8eckj5H-krnHkt_OqY1DVULQtVCT9wK9jd=w1200-h900-k-no",
    alt: "Fresh Paws storefront on 44th Street in Sunnyside",
    width: 1195,
    height: 900,
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnWxinmax_4nE3HXoMAiTVU9KbJDRKqf9BsVV0m1VspNAbayYnhoNwC-iRQMs9Cv4S98-ZClvrVbKjkVE1ze-RdkKEsSvzumbIC7PtP-0XF7gP6VbfC7pRi4G8WmkQBSx7vp_eo6z1-z3o=w1200-h900-k-no",
    alt: "Two stainless steel self-service dog wash tubs with towels and dryers",
    width: 1200,
    height: 900,
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkIQ3bMpObW9ROhSkWo51vO7WZSYJhkNNHx4PfH5fRK4z6P9nvWUA45SraqxGvKixr9htSm-oY3lfP5D4RdtAyChZn37XtdMIDRP6dss6OsjkjRBW_Be3gzFfEZ1CLMDumxvogBk5-amD6c=w900-h1200-k-no",
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
      "Just your dog and their leash. The final product list will be confirmed with the owner before launch.",
  },
  {
    question: "Do I need a reservation?",
    answer:
      "This concept includes a reservation preview, but the shop’s walk-in and booking policy still needs owner confirmation.",
  },
  {
    question: "Can I wash a large dog?",
    answer:
      "The final site will publish tub dimensions, weight guidance, and accessibility details after an in-store walkthrough.",
  },
  {
    question: "How long does a wash take?",
    answer:
      "Most self-serve washes are designed to be quick and comfortable, but Fresh Paws’ session length will be confirmed before launch.",
  },
] as const;
