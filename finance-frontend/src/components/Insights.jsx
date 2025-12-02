import axios from "axios";

const Insights = ({insights, error, fetchInsights}) => {
  



  return (
         <div className="h-1/2">
      {/* Card fills the available height inside the gray parent */}
      <div className="h-full w-full flex flex-col bg-[#121212] border border-[#ffffff2d] shadow-md rounded-xl px-4 py-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3">
          Spending Insights
          <button
      type="button"
      onClick={fetchInsights}
      className="inline-flex items-center ml-2 justify-center rounded-full text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#161515] p-2 text-xlg"
      aria-label="Refresh"
    >
      ⟳
    </button>
        </h2>

         

        {error && (
          <p className="text-sm text-red-500 mb-2">
            {error}
          </p>
        )}

        {/* Content area expands and scrolls if needed */}
        <div className="flex-1 overflow-y-auto">
          {!insights ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No insights yet. Please wait while FinAgent loads...
            </p>
          ) : (
            <div className="text-sm sm:text-base text-left text-gray-800 dark:text-gray-100 space-y-1">
              {insights
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
                      {/* Fancy dot */}
                      <span className="mt-0.5 text-xlg">💸</span>

                      {/* Fancy text */}
                      <span className="text-[0.9rem] leading-relaxed text-gray-100">
                        {/* Emphasize numbers with gradient text */}
                        <span className="bg-gradient-to-r from-emerald-300 to-sky-400 bg-clip-text text-transparent font-semibold">
                          {content.replace(/(\d+(\.\d+)?%?|\₹\s?\d[\d,]*)/, "$1")}
                        </span>{" "}
                        
                      </span>
                    </p>
                  );
                }

                 
                })}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Insights;
