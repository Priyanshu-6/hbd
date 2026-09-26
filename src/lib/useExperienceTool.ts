import { useEffect, useRef } from "react";

type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};

/** Progressive enhancement for browsers supporting the WebMCP proposal. */
export function useExperienceTool(scene: number, title: string) {
  const current = useRef({ scene: scene + 1, title });
  current.current = { scene: scene + 1, title };
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: "read_birthday_experience",
            description:
              "Read the current birthday scene and its available visible controls without advancing or revealing surprises.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute(input: unknown) {
              if (
                input === null ||
                typeof input !== "object" ||
                Array.isArray(input) ||
                Object.keys(input).length
              ) {
                throw new Error("Expected an empty object.");
              }
              return {
                ...current.current,
                totalScenes: 9,
                controls: Array.from(
                  document.querySelectorAll<HTMLButtonElement>(
                    "main button:not(:disabled)",
                  ),
                ).map(
                  (button) =>
                    button.getAttribute("aria-label") ||
                    button.textContent?.trim(),
                ),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {
        /* Browser support is optional. */
      });
    } catch {
      /* Unsupported implementations must not interrupt the gift. */
    }
    return () => lifecycle.abort();
  }, []);
}
