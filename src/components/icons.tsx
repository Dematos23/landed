import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      role="img" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path 
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.56 0-6.47-2.92-6.47-6.55s2.91-6.55 6.47-6.55c2.04 0 3.3.83 4.1 1.62l2.56-2.56c-1.62-1.5-3.8-2.62-6.66-2.62-5.45 0-9.84 4.4-9.84 9.85s4.39 9.85 9.84 9.85c5.03 0 8.3-3.56 8.3-8.5v-1.2H12.48z" 
        fill="currentColor"
      />
    </svg>
  )
}
