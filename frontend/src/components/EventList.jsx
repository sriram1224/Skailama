import React, { useEffect, useState } from "react";
import dayjs from "../utils/dayjsConfig";
import tzEntries from "../utils/timezones";
import { useAppStore } from "../store/useAppStore";
import ViewLogsModal from "./ViewLogsModal";
import EditEventModal from "./EditEventModal";
import {
  Calendar,
  Clock,
  Globe,
  Pencil,
  ScrollText,
  Users,
} from "lucide-react";

export default function EventList() {
  const { events, activeProfile, timezone, fetchEvents, setTimezone } =
    useAppStore();
  const [viewLogs, setViewLogs] = useState(null);
  const [editEvent, setEditEvent] = useState(null);

  useEffect(() => {
    if (activeProfile) fetchEvents(activeProfile);
  }, [activeProfile, fetchEvents]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
          <div className="p-2 rounded bg-indigo-50">
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <span>Events</span>
        </h3>

        <div className="relative w-72">
          <select
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pl-10 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {tzEntries.map((entry) => (
              <optgroup
                key={entry.label}
                label={`${entry.label} — ${entry.abbr}`}
              >
                {entry.zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone.replace(/_/g, " ")}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Globe className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500">
            Please select a profile to view their events.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((e) => (
            <div
              key={e._id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <p className="font-semibold text-indigo-600 flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <span>{e.profiles.map((p) => p.name).join(", ")}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">Start:</span>
                  <span>
                    {dayjs
                      .utc(e.startDate)
                      .tz(timezone)
                      .format("MMM DD, YYYY hh:mm A")}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">End:</span>
                  <span>
                    {dayjs
                      .utc(e.endDate)
                      .tz(timezone)
                      .format("MMM DD, YYYY hh:mm A")}
                  </span>
                </p>
              </div>

              <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 mt-3">
                <p>
                  Created: {dayjs(e.createdAt).format("MMM DD, YYYY hh:mm A")}
                </p>
                <p>
                  Updated: {dayjs(e.updatedAt).format("MMM DD, YYYY hh:mm A")}
                </p>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-200"
                  onClick={() => setEditEvent(e)}
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                </button>

                <button
                  className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-all duration-300 hover:bg-indigo-100"
                  onClick={() => setViewLogs(e)}
                >
                  <ScrollText className="h-4 w-4" />
                  <span>View Logs</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewLogs && (
        <ViewLogsModal event={viewLogs} onClose={() => setViewLogs(null)} />
      )}
      {editEvent && (
        <EditEventModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onUpdated={() => fetchEvents(activeProfile)}
        />
      )}
    </div>
  );
}
