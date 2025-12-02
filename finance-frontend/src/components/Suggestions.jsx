import React from "react";
import axios from "axios";


const Suggestions = ({suggestions, error}) => {

    return(
                <div className="h-1/2">
      {/* Card fills the available height inside the gray parent */}
      <div className="h-full w-full flex flex-col bg-[#121212] border border-[#ffffff2d] shadow-md rounded-xl px-4 py-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3">
          Spending Suggestions
        </h2>

        {error && (
          <p className="text-sm text-red-500 mb-2">
            {error}
          </p>
        )}

        {/* Content area expands and scrolls if needed */}
        <div className="flex-1 overflow-y-auto">
          {!suggestions ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No Suggestions yet. Please wait while FinAgent loads...
            </p>
          ) : (
            <div className="text-sm sm:text-base text-left text-gray-800 dark:text-gray-100 space-y-1">
              {suggestions
                .split("\n")
                .filter((line) => line.trim().length > 0)
                .map((line, idx) => {
                  const trimmed = line.trim();
                  const headingMatch = trimmed.match(/^\*\*(.+)\*\*:?$/);

                  if (headingMatch) {
                    return (
                      <h3
                        key={idx}
                        className="mt-3 font-semibold text-gray-900 dark:text-gray-50"
                      >
                        {headingMatch[1]}
                      </h3>
                    );
                  }

                  if (trimmed.startsWith("- ")) {
                      const content = trimmed.slice(2);

                      return (
                        <p
                          key={idx}
                          className="flex items-start gap-2 pl-1"
                        >
                          <span className="mt-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                            Tip
                          </span>

                          {/* Fancy text */}
                          <span className="text-[0.9rem] leading-relaxed text-gray-100">
                            {/* Emphasize numbers with gradient text */}
                            <span className="bg-linear-to-r from-[#41db04] to-[#08a7a7] bg-clip-text text-transparent font-semibold">
                              {content.replace(/(\d+(\.\d+)?%?|\₹\s?\d[\d,]*)/, "$1")}
                            </span>{" "}
                            
                          </span>
                        </p>
                      );
                          }



                  return <p key={idx}>{trimmed}</p>;
                })}
            </div>
          )}
        </div>
      </div>
    </div>
    )

}

export default Suggestions;