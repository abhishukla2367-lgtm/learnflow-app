import { useEffect } from "react";

export default function usePdfExport(exportPdfRef, targetRef, filename, title) {
  useEffect(() => {
    if (!exportPdfRef) return;

    exportPdfRef.current = async () => {
      const el = targetRef?.current;
      if (!el) return;

      const toast   = (await import("react-hot-toast")).default;
      const toastId = toast.loading("Generating PDF…");

      try {
        const html2canvas = (await import("html2canvas")).default;
        const { jsPDF }   = await import("jspdf");

        /* ── Step 1: Deep-clone off-screen ────────────────────────── */
        const clone = el.cloneNode(true);
        clone.style.cssText = [
          `position:fixed`,
          `top:-99999px`,
          `left:0`,
          `width:${el.offsetWidth}px`,
          `background:#f8fafc`,
          `z-index:-9999`,
        ].join(";");
        document.body.appendChild(clone);

        /* ── Step 2: Walk every element ───────────────────────────── */
        clone.querySelectorAll("*").forEach((node) => {
          const cs  = window.getComputedStyle(node);
          const tag = node.tagName;
          const cls = node.getAttribute("class") || "";

          /* A. Kill animations */
          node.style.animation         = "none";
          node.style.transition        = "none";
          node.style.animationDuration = "0s";

          /* B. Hide pdf-hide elements */
          if (cls.includes("pdf-hide")) {
            node.style.display = "none";
            return;
          }

          /* C. Hide invisible hover buttons */
          if (tag === "BUTTON" && cs.opacity === "0") {
            node.style.display = "none";
            return;
          }

          /* D. Strip backdrop-filter */
          if (cs.backdropFilter && cs.backdropFilter !== "none") {
            node.style.backdropFilter       = "none";
            node.style.webkitBackdropFilter = "none";
            if (!cs.backgroundColor || cs.backgroundColor === "rgba(0, 0, 0, 0)") {
              node.style.backgroundColor = "rgba(0,0,0,0.55)";
            }
          }

          /* ── E. UNIVERSAL BADGE/PILL FIX (computed-style based) ────
           *
           *  Detects ANY pill by computed style — NOT class names.
           *  Works on every page, every colour, every future badge.
           *
           *  Criteria:  border-radius ≥ 6px
           *           + font-size ≤ 13px
           *           + horizontal padding ≥ 4px
           * ──────────────────────────────────────────────────────── */
          const borderRadius  = parseFloat(cs.borderRadius)  || 0;
          const fontSize      = parseFloat(cs.fontSize)      || 16;
          const paddingLeft   = parseFloat(cs.paddingLeft)   || 0;
          const paddingTop    = parseFloat(cs.paddingTop)    || 0;
          const paddingBottom = parseFloat(cs.paddingBottom) || 0;
          const isPill        = borderRadius >= 6 && fontSize <= 13 && paddingLeft >= 4;

          if (isPill) {
            node.style.display        = "inline-flex";
            node.style.alignItems     = "center";
            node.style.justifyContent = "center";
            node.style.lineHeight     = "1";
            node.style.verticalAlign  = "middle";
            node.style.whiteSpace     = "nowrap";
            node.style.boxSizing      = "border-box";

            /* Minimum vertical padding so text has breathing room */
            if (paddingTop    < 4) node.style.paddingTop    = "4px";
            if (paddingBottom < 4) node.style.paddingBottom = "4px";

            /* Resolve opacity-bg shorthand colours for overlay pills */
            if (cs.backdropFilter && cs.backdropFilter !== "none") {
              node.style.backdropFilter       = "none";
              node.style.webkitBackdropFilter = "none";
              if (cls.includes("bg-emerald-500")) {
                node.style.backgroundColor = "#10b981";
                node.style.borderColor     = "#6ee7b7";
              } else if (cls.includes("bg-slate-800")) {
                node.style.backgroundColor = "#1e293b";
                node.style.borderColor     = "#475569";
              } else if (cls.includes("bg-black")) {
                node.style.backgroundColor = "rgba(0,0,0,0.65)";
              }
              if (borderRadius >= 999 || cls.includes("rounded-full")) {
                node.style.paddingLeft  = "10px";
                node.style.paddingRight = "10px";
              }
            }
          }

          /* ── F. UNIVERSAL STATUS DOT FIX ──────────────────────────
           *  Any tiny square span with full border-radius = status dot.
           * ─────────────────────────────────────────────────────── */
          const w    = parseFloat(cs.width)  || 0;
          const h    = parseFloat(cs.height) || 0;
          const isDot = (
            tag === "SPAN" &&
            Math.abs(w - h) < 1 &&
            w > 0 && w <= 12 &&
            borderRadius >= w / 2
          );

          if (isDot) {
            node.style.display       = "inline-block";
            node.style.flexShrink    = "0";
            node.style.borderRadius  = "50%";
            node.style.width         = `${w}px`;
            node.style.height        = `${h}px`;
            node.style.minWidth      = `${w}px`;
            node.style.minHeight     = `${h}px`;
            node.style.verticalAlign = "middle";
          }

          /* G. Fix line-clamp */
          if (cs.webkitLineClamp && cs.webkitLineClamp !== "none") {
            node.style.webkitLineClamp = "unset";
            node.style.overflow        = "visible";
            node.style.display         = "block";
          }

          /* H. Fix text-overflow ellipsis */
          if (cs.textOverflow === "ellipsis") {
            node.style.textOverflow = "clip";
            node.style.overflow     = "visible";
            node.style.whiteSpace   = "normal";
          }
        });

        /* ── Step 3: Reflow + measure ─────────────────────────────── */
        clone.getBoundingClientRect();
        const captureHeight = clone.scrollHeight;

        /* ── Step 4: Capture ──────────────────────────────────────── */
        const canvas = await html2canvas(clone, {
          scale:           2,
          useCORS:         true,
          allowTaint:      false,
          backgroundColor: "#f8fafc",
          logging:         false,
          windowWidth:     window.innerWidth,
          windowHeight:    captureHeight,
          width:           el.offsetWidth,
          height:          captureHeight,
          scrollX:         0,
          scrollY:         -clone.getBoundingClientRect().top,
        });

        /* ── Step 5: Remove clone ─────────────────────────────────── */
        clone.remove();

        /* ── PDF layout ───────────────────────────────────────────── */
        const pdf      = new jsPDF("p", "mm", "a4");
        const pageW    = pdf.internal.pageSize.getWidth();
        const pageH    = pdf.internal.pageSize.getHeight();
        const MARGIN   = 10;
        const HEADER_H = 14;
        const FOOTER_H =  6;
        const usableW  = pageW - MARGIN * 2;

        const totalImgH  = (canvas.height * usableW) / canvas.width;
        const startY     = HEADER_H + 4;
        const availableH = pageH - startY - FOOTER_H;
        const totalPages = Math.max(1, Math.ceil(totalImgH / availableH));

        const drawHeader = () => {
          pdf.setFillColor(99, 102, 241);
          pdf.rect(0, 0, pageW, HEADER_H, "F");
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text(`LearnFlow — ${title}`, MARGIN, 9.5);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          pdf.text(
            new Date().toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            }),
            pageW - MARGIN, 9.5, { align: "right" }
          );
        };

        const drawFooter = (pageNum) => {
          pdf.setFontSize(7);
          pdf.setTextColor(148, 163, 184);
          pdf.text(
            "Generated by LearnFlow Admin · Confidential",
            pageW / 2, pageH - 3, { align: "center" }
          );
          pdf.text(
            `Page ${pageNum} of ${totalPages}`,
            pageW - MARGIN, pageH - 3, { align: "right" }
          );
        };

        /* ── Paginate ─────────────────────────────────────────────── */
        let srcYpx    = 0;
        let remaining = totalImgH;
        let pageNum   = 1;

        while (remaining > 0) {
          if (pageNum > 1) pdf.addPage();
          drawHeader();

          const sliceMm = Math.min(remaining, availableH);
          const slicePx = Math.round((sliceMm / totalImgH) * canvas.height);

          const slice  = document.createElement("canvas");
          slice.width  = canvas.width;
          slice.height = Math.max(1, slicePx);
          slice.getContext("2d").drawImage(
            canvas,
            0, srcYpx,  canvas.width, slice.height,
            0, 0,       canvas.width, slice.height
          );

          pdf.addImage(
            slice.toDataURL("image/png"),
            "PNG",
            MARGIN, startY,
            usableW, sliceMm
          );

          drawFooter(pageNum);
          srcYpx    += slicePx;
          remaining -= sliceMm;
          pageNum   += 1;
        }

        pdf.save(
          `learnflow_${filename}_${new Date().toISOString().slice(0, 10)}.pdf`
        );
        toast.success("PDF exported successfully!", { id: toastId });

      } catch (err) {
        document.querySelectorAll("[style*='-99999px']").forEach(n => n.remove());
        console.error("[usePdfExport] error:", err);
        toast.error("Failed to export PDF. Please try again.", { id: toastId });
      }
    };

    return () => {
      if (exportPdfRef) exportPdfRef.current = null;
    };

  }, [exportPdfRef, targetRef, filename, title]);
}
