import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronRight, Check, Loader2, X } from "lucide-react";

const FunctionDisplay = ({ toolCall }) => {
  const [expanded, setExpanded] = useState(false);

  let parsedArgs = toolCall.arguments_string;
  try {
    parsedArgs = JSON.parse(toolCall.arguments_string);
  } catch {
    /* keep raw */
  }

  let parsedResults = toolCall.results;
  if (typeof parsedResults === "string") {
    try {
      parsedResults = JSON.parse(parsedResults);
    } catch {
      /* keep raw */
    }
  }

  const status = toolCall.status;
  const isFailed = status === "failed" || status === "error";
  const isActive = status === "pending" || status === "running" || status === "in_progress";
  const proj = toolCall.display_projection || {};
  const hideDetails = proj.hide_details && proj.details_redacted;

  const statusIcon = isFailed ? (
    <X className="w-3 h-3 text-red-500" />
  ) : isActive ? (
    <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
  ) : (
    <Check className="w-3 h-3 text-green-500" />
  );

  const statusText = isFailed
    ? proj.error_label || "Failed"
    : isActive
    ? proj.active_label || "Working…"
    : proj.label || "Done";

  if (hideDetails) {
    return (
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {statusIcon}
        <span>{statusText}</span>
      </div>
    );
  }

  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {statusIcon}
        <span>{toolCall.name} — {statusText}</span>
      </button>
      {expanded && (
        <div className="mt-1.5 ml-5 space-y-1 text-muted-foreground">
          <div>
            <span className="font-semibold">Parameters:</span>
            <pre className="mt-0.5 p-2 rounded bg-muted text-xs overflow-x-auto">
              {JSON.stringify(parsedArgs, null, 2)}
            </pre>
          </div>
          {parsedResults != null && (
            <div>
              <span className="font-semibold">Result:</span>
              <pre className="mt-0.5 p-2 rounded bg-muted text-xs overflow-x-auto">
                {JSON.stringify(parsedResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-card-foreground"
        }`}
      >
        {message.content &&
          (isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown className="text-sm space-y-2 leading-relaxed">
              {message.content}
            </ReactMarkdown>
          ))}
        {message.tool_calls?.map((tc, i) => (
          <FunctionDisplay key={i} toolCall={tc} />
        ))}
      </div>
    </div>
  );
}