import React from "react";
import dayjs from "../utils/dayjsConfig";
import { motion } from "framer-motion";
import { X, History } from "lucide-react";

export default function ViewLogsModal({ event, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            <span>Event Update History</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="close-logs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
          {event.logs.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No logs available</p>
          ) : (
            event.logs.map((log, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50"
              >
                <p className="text-xs text-slate-500 mb-1">
                  {dayjs(log.timestamp).format("MMM DD, YYYY [at] hh:mm A")}
                </p>
                <p className="text-sm text-slate-700">{log.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 mt-auto border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
