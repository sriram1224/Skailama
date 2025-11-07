/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useAppStore } from "./store/useAppStore.js";
import CreateEventForm from "./components/CreateEventForm.jsx";
import EventList from "./components/EventList.jsx";
import ProfileSelector from "./components/ProfileSelector.jsx";

function App() {
  const { activeProfile, fetchProfiles } = useAppStore();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">🧭 Event Management</h1>
          <ProfileSelector />
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <CreateEventForm />
            </div>
          </div>
          <div className="lg:col-span-8">
            {activeProfile ? (
              <EventList />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-md p-8">
                <p className="text-lg text-gray-500">
                  Please select a profile to view their events.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
