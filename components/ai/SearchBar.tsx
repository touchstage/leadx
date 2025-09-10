"use client";

import { useState } from "react";

type Result = {
	id: string;
	type: "intel" | "demand";
	title: string;
	snippet: string;
	sellerOrBuyerReputation: number;
	createdAt: string;
	score: number;
};

export default function SearchBar() {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState<Result[]>([]);
	const [answer, setAnswer] = useState("");

	async function onSearch(e: React.FormEvent) {
		e.preventDefault();
		if (!query) return;
		setLoading(true);
		setAnswer("");
		setResults([]);
		try {
			const res = await fetch("/api/search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query }),
			});
			const data = await res.json();
			setResults(data.results ?? []);
			setAnswer(data.answer ?? "");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="mt-4">
			<form onSubmit={onSearch} className="flex gap-2">
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Ask for intel..."
					className="flex-1 border rounded-md px-3 py-2"
				/>
				<button disabled={loading} className="border rounded-md px-3 py-2">
					{loading ? "Searching..." : "Search"}
				</button>
			</form>

			{answer && (
				<div className="mt-4 p-3 border rounded-md whitespace-pre-wrap text-sm">{answer}</div>
			)}

			{results.length > 0 && (
				<ul className="mt-4 space-y-2">
					{results.map((r) => (
						<li key={r.id} className="border rounded-md p-3">
							<div className="text-xs text-muted-foreground">{r.type.toUpperCase()}</div>
							<div className="font-medium">{r.title}</div>
							<div className="text-sm text-muted-foreground">{r.snippet}</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


