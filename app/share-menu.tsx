"use client";

/* Native images keep the supplied challenge icons at their intrinsic sizes. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useRef, useState } from "react";

const networks = [
  { name: "Facebook", icon: "/images/icon-facebook.svg", width: 20, height: 20, href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}` },
  { name: "Twitter", icon: "/images/icon-twitter.svg", width: 20, height: 17, href: (url: string) => `https://twitter.com/intent/tweet?url=${url}` },
  { name: "Pinterest", icon: "/images/icon-pinterest.svg", width: 20, height: 20, href: (url: string) => `https://pinterest.com/pin/create/button/?url=${url}` },
];

export function ShareMenu() {
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    if (!open) setPageUrl(encodeURIComponent(window.location.href));
    setOpen(value => !value);
  };

  return (
    <div
      className="share"
      ref={rootRef}
      onBlur={event => { if (open && !rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false); }}
    >
      <button ref={buttonRef} type="button" className="share-button" aria-expanded={open} aria-controls={menuId} onClick={toggle}>
        <span className="share-icon" aria-hidden="true" />
        <span className="sr-only">Share this article</span>
      </button>
      <div id={menuId} className="share-menu" hidden={!open}>
        <p className="share-label" aria-hidden="true">Share</p>
        <ul aria-label="Share on">
          {networks.map(network => (
            <li key={network.name}>
              <a href={network.href(pageUrl)} target="_blank" rel="noopener noreferrer">
                <img src={network.icon} width={network.width} height={network.height} alt="" />
                <span className="sr-only">{network.name} (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
