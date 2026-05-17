"use client";

import { useLenis } from "@/providers/lenis-context";
import { type RefObject, useEffect, useRef } from "react";

const DRAG_THRESHOLD = 20;
const IGNORE_SELECTOR =
  "button, a, input, textarea, select, label, [data-no-drag-scroll]";

type Options = {
  enabled?: boolean;
};

export function useDragScroll(
  rootRef: RefObject<HTMLElement | null>,
  { enabled = true }: Options = {}
) {
  const lenis = useLenis();
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;

    let pointerId: number | null = null;
    let dragging = false;
    let startY = 0;
    let startScroll = 0;

    const shouldIgnore = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return true;
      return Boolean(target.closest(IGNORE_SELECTOR));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || shouldIgnore(e.target)) return;
      pointerId = e.pointerId;
      dragging = false;
      startY = e.clientY;
      startScroll = lenis?.scroll ?? window.scrollY;
      root.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const delta = e.clientY - startY;
      if (!dragging && Math.abs(delta) < DRAG_THRESHOLD) return;

      if (!dragging) {
        dragging = true;
        root.dataset.dragging = "true";
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
      }

      e.preventDefault();
      const next = Math.max(0, startScroll - delta);
      if (lenis) {
        lenis.scrollTo(next, { immediate: true, force: true });
      } else {
        window.scrollTo(0, next);
      }
    };

    const end = (e: PointerEvent) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const id = pointerId;
      if (dragging) suppressClickRef.current = true;
      dragging = false;
      pointerId = null;
      delete root.dataset.dragging;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      try {
        root.releasePointerCapture(id);
      } catch {}
    };

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", end);
    root.addEventListener("pointercancel", end);

    return () => {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", end);
      root.removeEventListener("pointercancel", end);
      delete root.dataset.dragging;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [enabled, lenis, rootRef]);

  const consumeClick = () => {
    if (!suppressClickRef.current) return false;
    suppressClickRef.current = false;
    return true;
  };

  return { consumeClick };
}
