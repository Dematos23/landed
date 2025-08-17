import type { Timestamp } from "firebase/firestore";

/**
 * Defines the properties of a single component in the landing page.
 */
export interface LandingPageComponent {
  /** A unique identifier for this instance of the component on the page. */
  id: string; // e.g., '1702413345109'

  /** The name of the component type (e.g., 'Hero Section', 'Features'). */
  name: string;

  /** An object containing all props specific to this component. */
  props: { [key: string]: any }; // e.g., { headline: 'Your Product', cta1: 'Get Started' }
}

/**
 * Defines the color palette and typography for the page's theme.
 */
export interface LandingPageTheme {
  primary: string;         // Primary color (buttons, accents)
  primaryForeground: string; // Color for text on primary elements (like buttons)
  secondary: string;       // Secondary color
  accent: string;          // Accent color
  foreground: string;      // Color for headings and primary text
  mutedForeground: string; // Color for paragraphs and descriptive text
  background1: string;     // Main page background color
  background2: string;     // Background color for sections or cards
  fontFamily: 'Inter' | 'Roboto' | 'Lato' | 'Montserrat'; // Supported fonts
}

/**
 * Represents the complete structure of a landing page,
 * suitable for storage as a document in Firestore.
 */
export interface LandingPageData {
  /** The document ID, which is a UUID and matches the page ID. */
  id: string;

  /** The ID of the user who owns the page. */
  userId: string;

  /** The name of the page displayed in the user's dashboard. */
  name: string;

  /** The subdomain where the page will be published (e.g., 'my-launch'). */
  subdomain: string;

  /** The list of components that make up the page, in display order. */
  components: LandingPageComponent[];

  /** The theme configuration for the page. */
  theme: LandingPageTheme;
  
  /** Indicates if the page is currently published and live. */
  isPublished: boolean;

  /** The creation timestamp of the page. */
  createdAt: Timestamp;

  /** The last updated timestamp of the page. */
  updatedAt: Timestamp;
}
