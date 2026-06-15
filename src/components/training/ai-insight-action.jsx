"use client";

import { lazy, Suspense, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const MessageResponse = lazy(() =>
  import("@/components/ai-elements/message").then((module) => ({
    default: module.MessageResponse,
  })),
);

export function AIInsightAction({
  accent,
  body,
  buttonLabel,
  disabled,
  endpoint,
  id,
  iconAlt = "",
  iconSrc,
  panelTitle,
}) {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: endpoint }),
    [endpoint],
  );
  const {
    clearError,
    error,
    messages,
    sendMessage,
    setMessages,
    status,
    stop,
  } = useChat({ id, transport });
  const isLoading = status === "submitted" || status === "streaming";
  const assistantMessages = messages.filter(
    (message) => message.role === "assistant",
  );

  function requestInsights() {
    if (disabled || isLoading) {
      return;
    }

    clearError();
    setMessages([]);
    sendMessage(
      { text: "Avalie a qualidade da minha solução." },
      { body },
    );
  }

  return (
    <>
      <button
        disabled={disabled}
        onClick={isLoading ? stop : requestInsights}
        style={{
          alignItems: "center",
          background: disabled ? "#E2E4EA" : isLoading ? "#FFF3E0" : accent.soft,
          border: `1px solid ${isLoading ? "#FFB74D" : accent.border}`,
          borderRadius: 10,
          color: disabled ? "#A5A8B3" : isLoading ? "#E65100" : accent.text,
          cursor: disabled ? "default" : "pointer",
          display: "inline-flex",
          fontSize: 12,
          fontWeight: 700,
          gap: 6,
          padding: "8px 15px",
        }}
        type="button"
      >
        {isLoading ? (
          <span aria-hidden="true">■</span>
        ) : iconSrc ? (
          <img
            alt={iconAlt}
            height="24"
            src={iconSrc}
            style={{
              borderRadius: "50%",
              flexShrink: 0,
              height: 24,
              objectFit: "contain",
              width: 24,
            }}
            width="24"
          />
        ) : (
          <span aria-hidden="true">✦</span>
        )}
        {isLoading ? "Parar análise" : buttonLabel}
      </button>

      {(assistantMessages.length > 0 || error || status === "submitted") && (
        <div
          style={{
            background: accent.panel,
            border: `1px solid ${accent.border}`,
            borderLeft: `3px solid ${accent.text}`,
            borderRadius: 10,
            color: "#27243A",
            flexBasis: "100%",
            fontSize: 13,
            lineHeight: 1.65,
            marginTop: 12,
            order: 10,
            overflow: "hidden",
            padding: "14px 16px",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              color: accent.text,
              display: "flex",
              fontSize: 10,
              fontWeight: 800,
              justifyContent: "space-between",
              letterSpacing: 0.8,
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                alignItems: "center",
                display: "inline-flex",
                gap: 7,
              }}
            >
              {iconSrc && (
                <img
                  alt=""
                  aria-hidden="true"
                  height="28"
                  src={iconSrc}
                  style={{
                    borderRadius: "50%",
                    height: 28,
                    objectFit: "contain",
                    width: 28,
                  }}
                  width="28"
                />
              )}
              {panelTitle}
            </span>
            <span style={{ color: "#8B8FA3", fontWeight: 600 }}>
              Gemini 2.5 Flash · Google AI
            </span>
          </div>

          {status === "submitted" && assistantMessages.length === 0 && (
            <div style={{ color: "#8B8FA3" }}>Analisando a solução...</div>
          )}

          {assistantMessages.map((message) =>
            message.parts.map((part, index) =>
              part.type === "text" ? (
                <Suspense
                  fallback={
                    <div style={{ color: "#8B8FA3" }}>
                      Preparando os insights...
                    </div>
                  }
                  key={`${message.id}-${index}`}
                >
                  <MessageResponse isAnimating={status === "streaming"}>
                    {part.text}
                  </MessageResponse>
                </Suspense>
              ) : null,
            ),
          )}

          {error && (
            <div style={{ color: "#B71C1C" }}>
              Não foi possível gerar os insights: {error.message}
            </div>
          )}
        </div>
      )}
    </>
  );
}
