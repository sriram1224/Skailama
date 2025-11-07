import React, { useEffect, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";
import dayjs from "../utils/dayjsConfig";
import tzEntries from "../utils/timezones";
import { CalendarPlus, Globe, Users, Check, Plus } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import axios from "axios";

const ValueContainer = ({ children, ...props }) => {
  const { getValue } = props;
  const count = getValue().length;
  return (
    <components.ValueContainer {...props}>
      {count > 1 ? (
        <div className="text-sm text-white bg-indigo-600 rounded-md px-3 py-1">
          {count} profiles selected
        </div>
      ) : (
        children
      )}
    </components.ValueContainer>
  );
};

export default function CreateEventForm() {
  const { profiles, createEvent, fetchProfiles } = useAppStore();
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState(dayjs.tz.guess());
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [menuInput, setMenuInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const options = useMemo(
    () => profiles.map((p) => ({ label: p.name, value: p._id })),
    [profiles]
  );

  const handleCreateProfile = async (name) => {
    if (!name || !name.trim()) return;
    setLoading(true);
    try {
      // post to /api/profiles
      const res = await axios.post("http://localhost:5000/api/profiles", {
        name: name.trim(),
      });
      await fetchProfiles();
      setSelectedProfiles((prev) => [
        ...prev,
        { label: res.data.name, value: res.data._id },
      ]);
      setMenuInput("");
      setShowAdd(false);
    } catch (err) {
      alert("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const formatOptionLabel = (option, { isSelected, isFocused }) => (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isSelected
          ? "bg-purple-600"
          : isFocused
          ? "bg-purple-50"
          : "bg-transparent"
      }`}
    >
      {isSelected ? (
        <Check className="h-4 w-4 text-white" />
      ) : (
        <div className="w-4" />
      )}
      <span
        className={`${isSelected ? "text-white font-medium" : "text-gray-700"}`}
      >
        {option.label}
      </span>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const names = selectedProfiles.map((p) => p.label);
    if (!names.length) {
      alert("Please select at least one profile.");
      return;
    }

    const startISO = dayjs
      .tz(`${startDate} ${startTime}`, "YYYY-MM-DD HH:mm", timezone)
      .utc()
      .toISOString();
    const endISO = dayjs
      .tz(`${endDate} ${endTime}`, "YYYY-MM-DD HH:mm", timezone)
      .utc()
      .toISOString();

    await createEvent({
      // backend expects profile names (it looks up Profiles by name)
      profiles: names,
      timezone,
      startDate: startISO,
      endDate: endISO,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6 max-w-md"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-indigo-50 p-2">
          <CalendarPlus className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Create Event</h3>
      </div>

      {/* Profiles */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Users className="h-4 w-4 text-slate-500" />
          Profiles
        </label>
        <CreatableSelect
          isMulti
          options={options}
          value={selectedProfiles}
          onChange={(val) => setSelectedProfiles(val || [])}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder="Select or add profiles..."
          // disable built-in "create" option; we provide our own Add button
          isValidNewOption={() => false}
          components={{ ValueContainer }}
          formatOptionLabel={formatOptionLabel}
          styles={{
            control: (base, state) => ({
              ...base,
              borderRadius: 10,
              borderColor: state.isFocused ? "#c4b5fd" : "#e2e8f0",
              boxShadow: state.isFocused
                ? "0 6px 18px rgba(124,58,237,0.12)"
                : "0 4px 12px rgba(0,0,0,0.04)",
              backgroundColor: state.isFocused ? "#fff" : "#fff",
            }),
            option: (base) => ({
              ...base,
              backgroundColor: "transparent",
              cursor: "pointer",
              padding: "10px 12px",
            }),
            menu: (base) => ({
              ...base,
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            }),
            singleValue: (base, state) => ({
              ...base,
              color: state.selectProps.value ? "#fff" : base.color,
            }),
          }}
        />

        {/* External Add UI for CreateEventForm (separate from the dropdown) */}
        <div className="mt-2">
          {!showAdd ? (
            <button
              type="button"
              onClick={() => {
                setShowAdd(true);
                requestAnimationFrame(() => {
                  const el = document.querySelector("#event-profile-add-input");
                  el && el.focus();
                });
              }}
              className="flex items-center gap-2 text-sm text-slate-700 px-3 py-2 rounded-md hover:bg-slate-50"
            >
              <Plus className="h-4 w-4 text-slate-500" />
              <span>Add profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                id="event-profile-add-input"
                value={menuInput}
                onChange={(e) => setMenuInput(e.target.value)}
                placeholder="Add profile..."
                className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleCreateProfile(menuInput)}
                disabled={loading || !menuInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setMenuInput("");
                }}
                className="ml-2 text-sm text-slate-500 px-2 py-1 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Globe className="h-4 w-4 text-slate-500" />
          Timezone
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

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Start Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2.5"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Start Time
          </label>
          <input
            type="time"
            className="w-full border border-gray-300 rounded-lg p-2.5"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            End Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2.5"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            End Time
          </label>
          <input
            type="time"
            className="w-full border border-gray-300 rounded-lg p-2.5"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700"
      >
        Create Event
      </button>
    </form>
  );
}
