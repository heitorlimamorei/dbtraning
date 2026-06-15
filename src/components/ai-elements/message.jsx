"use client";

import { code } from "@streamdown/code";
import { memo } from "react";
import { Streamdown } from "streamdown";

const streamdownPlugins = { code };

export const MessageResponse = memo(
  ({ className, ...props }) => (
    <Streamdown
      className={[
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      plugins={streamdownPlugins}
      {...props}
    />
  ),
  (previousProps, nextProps) =>
    previousProps.children === nextProps.children &&
    nextProps.isAnimating === previousProps.isAnimating,
);

MessageResponse.displayName = "MessageResponse";
