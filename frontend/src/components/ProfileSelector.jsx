import React, { useEffect, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { components as RSComponents } from "react-select";
import API from "../api";
import { Users, Check, Plus } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export default function ProfileSelector() {
  const { profiles, activeProfile, setActiveProfile, fetchProfiles } =
    useAppStore();
  const [loading, setLoading] = useState(false);
  const [menuInput, setMenuInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const options = useMemo(
    () => profiles.map((p) => ({ label: p.name, value: p._id })),
    [profiles]
  );

  const createProfile = async (name) => {
    if (!name || !name.trim()) return;
    setLoading(true);
    try {
      // POST to /api/profiles to match fetchProfiles() which GETs /api/profiles
      const res = await API.post("/profiles", {
        name: name.trim(),
      });
      await fetchProfiles();
      setActiveProfile(res.data._id);
      setMenuInput("");
      // close the add UI after successful creation
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

  // We intentionally render no custom menu additions here.
  // The Add UI is rendered outside the dropdown to avoid react-select
  // intercepting keyboard events or closing the menu unexpectedly.

  // Custom single value renderer to show a tick icon before the active profile
  const SingleValue = (props) => (
    <RSComponents.SingleValue {...props}>
      <div className="flex items-center gap-2 bg-purple-600 text-white px-2 py-0.5 rounded-md">
        <Check className="h-4 w-4 text-white" />
        <span className="text-sm text-white font-medium">
          {props.data.label}
        </span>
      </div>
    </RSComponents.SingleValue>
  );

  return (
    <div className="min-w-[11rem] w-auto">
      <label className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-1">
        <Users className="h-4 w-4 text-slate-400" /> Current Profile
      </label>

      <CreatableSelect
        isClearable
        isSearchable
        isDisabled={loading}
        options={options}
        value={options.find((o) => o.value === activeProfile) || null}
        onChange={(s) => setActiveProfile(s ? s.value : "")}
        placeholder="Select profile..."
        // Prevent the built-in "create new" suggestion. We only allow creating
        // profiles via our custom input + Add button in the menu.
        isValidNewOption={() => false}
        components={{ SingleValue }}
        formatOptionLabel={formatOptionLabel}
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: 10,
            borderColor: state.isFocused ? "#c4b5fd" : "#e2e8f0",
            minHeight: "36px",
            boxShadow: state.isFocused
              ? "0 6px 18px rgba(124,58,237,0.12)"
              : "0 4px 12px rgba(0,0,0,0.04)",
            backgroundColor: state.hasValue ? "#7c3aed" : "#fff",
            paddingLeft: state.hasValue ? 6 : undefined,
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
            fontSize: "0.95rem",
          }),
        }}
      />

      {/* External Add UI (separate from react-select menu) */}
      <div className="mt-2">
        {!showAdd ? (
          <button
            type="button"
            onClick={() => {
              setShowAdd(true);
              requestAnimationFrame(() => {
                const el = document.querySelector("#profile-add-input");
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
              id="profile-add-input"
              value={menuInput}
              onChange={(e) => setMenuInput(e.target.value)}
              placeholder="Add profile..."
              className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => createProfile(menuInput)}
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
  );
}
