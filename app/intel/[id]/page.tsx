import Link from "next/link";
import { headers } from "next/headers";

type Props = { params: Promise<{ id: string }> };

async function getIntel(id: string) {
	const h = await headers();
	const host = h.get("host");
	const proto = h.get("x-forwarded-proto") ?? "http";
	const base = host ? `${proto}://${host}` : (process.env.NEXTAUTH_URL ?? "http://localhost:3000");
	const res = await fetch(`${base}/api/intel/get?id=${id}`, { cache: "no-store" });
	if (!res.ok) return { intel: null } as any;
	return res.json();
}

export default async function Page({ params }: Props) {
	const { id } = await params;
	const { intel } = await getIntel(id);
	return (
		<div className="p-6 max-w-2xl">
			<h2 className="text-2xl font-semibold">{intel.title}</h2>
			<p className="text-sm text-muted-foreground">Category: {intel.category}</p>
			<div className="mt-4 p-3 border rounded-md bg-muted/30">
				<p className="text-sm">Preview (locked). Purchase to unlock full details.</p>
			</div>
			<div className="mt-4 flex items-center gap-2">
				<form action="/api/intel/purchase" method="post">
					<input type="hidden" name="intelId" value={intel.id} />
					<button className="border rounded-md px-3 py-2">
						{intel.priceCredits === 0 ? 'Get Free Intel' : `Buy for $${intel.priceCredits}`}
					</button>
				</form>
				<Link className="underline text-sm" href="/ask">Back</Link>
			</div>
		</div>
	);
}


