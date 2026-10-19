/** A ribbon in the heading's whitespace; no text or controls depend on it. */
export function C4DirectoryEntrance() {
  return (
    <svg
      className="c4-directory-entrance"
      viewBox="0 0 1240 280"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-motion-decoration
    >
      <path
        className="c4-ribbon c4-ribbon--desktop"
        pathLength="1"
        d="M180 21C135 2 72 8 63 38C53 71 110 80 132 49H100C54 49 22 57 12 96C3 137 8 210 16 246C20 270 48 276 110 276H1110"
      />
      <path
        className="c4-ribbon c4-ribbon--tablet"
        pathLength="1"
        d="M126 18C98 5 53 12 49 34C44 56 82 64 100 43H73C36 43 15 65 11 103L11 227C11 263 36 276 100 276H850"
      />
      <path
        className="c4-ribbon c4-ribbon--mobile"
        pathLength="1"
        d="M94 12C71 2 39 8 36 24C32 41 59 46 73 30H53C25 30 8 43 7 68L7 240C7 267 24 276 54 276H252"
      />
      <path className="c4-ribbon-rule" pathLength="1" d="M40 276H1110" />
    </svg>
  );
}
