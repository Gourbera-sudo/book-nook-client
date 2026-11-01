// import Link from "next/link";
// import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

// const CONTACT_EMAIL = "hello@booknook.com";
// const CONTACT_PHONE = "+91 555-123-4567";

// const SOCIAL_LINKS = [
//   { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
//   { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
//   { label: "X", href: "https://x.com", Icon: XIcon },
// ];

// function FacebookIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
//     </svg>
//   );
// }

// function InstagramIcon(props) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       aria-hidden="true"
//       {...props}
//     >
//       <rect x="3" y="3" width="18" height="18" rx="5" />
//       <circle cx="12" cy="12" r="4" />
//       <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
//     </svg>
//   );
// }

// function XIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       <path d="M18.9 2H22l-6.8 7.78L23 22h-6.3l-4.93-6.44L6.1 22H3l7.3-8.35L2.6 2h6.45l4.46 5.9L18.9 2Zm-1.1 17.8h1.73L8.02 4.1H6.16L17.8 19.8Z" />
//     </svg>
//   );
// }

// export default function Footer() {
//   return (
//     <footer className="border-t border-sky-200 bg-sky-50">
//       <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
//           <div>
//             <Link href="/" className="inline-flex items-center gap-2.5">
//               <span className="grid size-9 place-items-center rounded-lg bg-sky-600 text-white">
//                 <BookOpen aria-hidden="true" className="size-5" />
//               </span>
//               <span className="text-2xl font-extrabold tracking-tight text-sky-950">
//                 BookNook
//               </span>
//             </Link>
//             <p className="mt-4 max-w-sm text-md leading-6 text-sky-800/80">
//               A cozy corner to discover, share, and borrow books from readers
//               near you.
//             </p>
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold text-sky-950">Contact</h2>
//             <address className="mt-4 space-y-3 not-italic">
//               <a
//                 href={`mailto:${CONTACT_EMAIL}`}
//                 className="flex items-center gap-2 text-md text-sky-800/80 transition-colors hover:text-sky-950"
//               >
//                 <Mail aria-hidden="true" className="size-4 shrink-0 text-sky-600" />
//                 {CONTACT_EMAIL}
//               </a>
//               <a
//                 href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`}
//                 className="flex items-center gap-2 text-md text-sky-800/80 transition-colors hover:text-sky-950"
//               >
//                 <Phone aria-hidden="true" className="size-4 shrink-0 text-sky-600" />
//                 {CONTACT_PHONE}
//               </a>
//               <p className="flex items-start gap-2 text-md text-sky-800/80">
//                 <MapPin
//                   aria-hidden="true"
//                   className="mt-0.5 size-4 shrink-0 text-xl text-sky-600"
//                 />
//                 123 Reading Lane, Kolkata, India 
//               </p>
//             </address>
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold text-sky-950">Follow us</h2>
//             <div className="mt-4 flex items-center gap-2">
//               {SOCIAL_LINKS.map(({ label, href, Icon }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   target="_blank"
//                   rel="noreferrer"
//                   aria-label={`BookNook on ${label}`}
//                   className="inline-flex size-9 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-600 transition-colors hover:bg-sky-100 hover:text-sky-800 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
//                 >
//                   <Icon className="size-5" />
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="mt-10 flex flex-col gap-3 border-t border-sky-200 pt-6 text-md text-sky-800/70 sm:flex-row sm:items-center sm:justify-between">
//           <p>© 2026 BookNook. All rights reserved.</p>
//           <p>Made for book lovers.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }
