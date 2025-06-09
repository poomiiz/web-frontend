import React, { useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";

export default function AdminDashboard() {
  const [active, setActive] = useState<"dashboard"|"decks">("dashboard");

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActive("dashboard")}
            className={`px-4 py-2 rounded ${active==="dashboard"?"bg-blue-500 text-white":"border"}`}
          >
            Overview
          </button>
          <Link href="/admin/decks">
            <button
              className={`px-4 py-2 rounded ${active==="decks"?"bg-blue-500 text-white":"border"}`}
            >
              Decks
            </button>
          </Link>
        </div>
        {active === "dashboard" && (
          <p>สรุปภาพรวมระบบ, Logs, Config ฯลฯ</p>
        )}
      </div>
    </Layout>
);
}
