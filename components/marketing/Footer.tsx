import Link from "next/link";

export function Footer() {
	return (
		<footer className="bg-stone-50 border-t border-stone-200 py-12 mt-16">
			<div className="mx-auto max-w-6xl px-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 bg-stone-900 rounded-sm flex items-center justify-center">
								<div className="w-4 h-4 bg-white rounded-sm"></div>
							</div>
							<span className="text-xl font-bold text-stone-900">LeadX</span>
						</div>
						<p className="text-stone-600 max-w-md">
							The platform for sales intelligence and warm introductions. 
							Get verified intel, pay per piece, no subscriptions.
						</p>
					</div>
					
					<div>
						<h3 className="font-semibold text-stone-900 mb-4">Product</h3>
						<ul className="space-y-2 text-stone-600">
							<li><Link href="/ask" className="hover:text-stone-900">Find Intel</Link></li>
							<li><Link href="/post-demand" className="hover:text-stone-900">Request Intel</Link></li>
							<li><Link href="/wallet" className="hover:text-stone-900">Wallet</Link></li>
						</ul>
					</div>
					
					<div>
						<h3 className="font-semibold text-stone-900 mb-4">Support</h3>
						<ul className="space-y-2 text-stone-600">
							<li><Link href="/help" className="hover:text-stone-900">Help Center</Link></li>
							<li><Link href="/guidelines" className="hover:text-stone-900">Guidelines</Link></li>
							<li><Link href="/contact" className="hover:text-stone-900">Contact</Link></li>
						</ul>
					</div>
				</div>
				
				<div className="border-t border-stone-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-stone-500 text-sm">
						© 2024 LeadX. All rights reserved.
					</p>
					<div className="flex gap-6 mt-4 md:mt-0">
						<Link href="/terms" className="text-stone-500 text-sm hover:text-stone-900">Terms</Link>
						<Link href="/privacy" className="text-stone-500 text-sm hover:text-stone-900">Privacy</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
