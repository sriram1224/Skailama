import React, { useEffect, useMemo, useState } from "react";
import dayjs from "../utils/dayjsConfig";
import tzEntries from "../utils/timezones";
import { useAppStore } from "../store/useAppStore";
import { motion } from "framer-motion";
import { X, Save, Users, Globe, Clock, Check, Plus } from "lucide-react";
import { updateEvent } from "../api";
import CreatableSelect, { components } from "react-select/creatable";
import axios from "axios";

const MenuList = ({ children, onAddRow }) => (
  <div>
    <div className="px-1 py-1">{children}</div>
    <div className="border-t pt-2 px-2">
      {/* This MenuList will be overridden inside component to wire create input */}
    </div>
  </div>
);

const formatOptionLabel = (option, { isSelected }) => (
  <div className="flex items-center justify-between px-2">
    <div className="flex items-center gap-2">
      {isSelected ? (
        <Check className="h-4 w-4 text-indigo-600" />
      ) : (
        <div style={{ width: 16 }} />
      )}
      <span>{option.label}</span>
    </div>
  </div>
);

export default function EditEventModal({ event, onClose, onUpdated }) {
  const { profiles, fetchProfiles } = useAppStore();
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState(event.timezone);
  const [startDate, setStartDate] = useState(
    dayjs.tz(event.startDate, event.timezone).format("YYYY-MM-DD")
  );
  const [startTime, setStartTime] = useState(
    dayjs.tz(event.startDate, event.timezone).format("HH:mm")
  );
  const [endDate, setEndDate] = useState(
    dayjs.tz(event.endDate, event.timezone).format("YYYY-MM-DD")
  );
  const [endTime, setEndTime] = useState(
    dayjs.tz(event.endDate, event.timezone).format("HH:mm")
  );
  const [menuInput, setMenuInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
    setSelectedProfiles(
      event.profiles.map((p) => ({ label: p.name, value: p._id }))
    );
  }, [event, fetchProfiles]);

  const options = useMemo(
    () => profiles.map((p) => ({ label: p.name, value: p._id })),
    [profiles]
  );

  const handleCreateProfile = async (name) => {
    if (!name || !name.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users", {
        name: name.trim(),
      });
      await fetchProfiles();
      setSelectedProfiles((prev) => [
        ...prev,
        { label: res.data.name, value: res.data._id },
      ]);
      setMenuInput("");
    } catch (err) {
      console.error(err);
      alert("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const CustomMenuList = (props) => {
    return (
      <div>
        <div className="px-1 py-1">{props.children}</div>
        <div className="mt-2 border-t pt-2 px-2">
          <div className="flex items-center gap-2">
            <input
              value={menuInput}
              onChange={(e) => setMenuInput(e.target.value)}
              placeholder="Add profile..."
              className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              disabled={loading || !menuInput.trim()}
              onClick={() => handleCreateProfile(menuInput)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleUpdate = async () => {
    try {
      const startISO = dayjs
        .tz(`${startDate} ${startTime}`, "YYYY-MM-DD HH:mm", timezone)
        .utc()
        .toISOString();
      const endISO = dayjs
        .tz(`${endDate} ${endTime}`, "YYYY-MM-DD HH:mm", timezone)
        .utc()
        .toISOString();
      await updateEvent(event._id, {
        profiles: selectedProfiles.map((p) => p.value),
        timezone,
        startDate: startISO,
        endDate: endISO,
      });
      onUpdated();
      onClose();
    } catch (error) {
      alert("Failed to update event: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Edit Event</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="h-4 w-4" />
              <span>Profiles</span>
            </label>

            <CreatableSelect
              isMulti
              options={options}
              value={selectedProfiles}
              onChange={(val) => setSelectedProfiles(val || [])}
              formatOptionLabel={formatOptionLabel}
              components={{ MenuList: CustomMenuList }}
              placeholder="Select or add profiles..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: 10,
                  borderColor: "#e6e6f0",
                  minHeight: 40,
                }),
                option: (base) => ({ ...base, padding: 8 }),
                menu: (base) => ({ ...base, borderRadius: 10 }),
              }}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Globe className="h-4 w-4" />
              <span>Timezone</span>
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-date"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="start-time"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Start Time
              </label>
              <input
                id="start-time"
                type="time"
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="end-date"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="end-time"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                End Time
              </label>
              <input
                id="end-time"
                type="time"
                className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-auto border-t border-gray-200">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" />
            Update Event
          </button>
        </div>
      </motion.div>
    </div>
  );
}
