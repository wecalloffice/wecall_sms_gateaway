"use client";

import { useState } from "react";
import SmsListView from "./SmsListView";
import SmsGridView from "./SmsGridView";
import SmsKanbanView from "./SmsKanbanView";
import { SmsMessage } from "../types";

export default function SmsViewSwitcher({ data }: { data: SmsMessage[] }) {
  const [view, setView] = useState<"list" | "grid" | "kanban">("list");

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          className={`btn ${view === "list" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setView("list")}
        >
          List
        </button>

        <button
          className={`btn ${view === "grid" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setView("grid")}
        >
          Grid
        </button>

        <button
          className={`btn ${view === "kanban" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setView("kanban")}
        >
          Kanban
        </button>
      </div>

      {/* Render Views */}
      {view === "list" && <SmsListView data={data} />}
      {view === "grid" && <SmsGridView data={data} />}
      {view === "kanban" && <SmsKanbanView data={data} />}
    </div>
  );
}
