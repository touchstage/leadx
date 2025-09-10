import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function Nav() {
	return (
		<header className="sticky top-0 z-50 w-full">
			<div className="flex h-20 w-full items-center justify-between px-8">
				<div className="flex items-center gap-10">
					<Link href="/" className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gray-900 rounded-sm flex items-center justify-center">
							<div className="w-5 h-5 bg-white rounded-sm"></div>
						</div>
						<span className="text-2xl font-bold text-gray-900">LeadX</span>
					</Link>
					<nav className="hidden lg:flex items-center gap-8">
						<Link href="#platform" className="text-lg text-gray-700 hover:text-gray-900 font-semibold flex items-center gap-1">
							Platform <ChevronDown className="w-5 h-5" />
						</Link>
						<Link href="#solutions" className="text-lg text-gray-700 hover:text-gray-900 font-semibold flex items-center gap-1">
							Solutions <ChevronDown className="w-5 h-5" />
						</Link>
						<Link href="#resources" className="text-lg text-gray-700 hover:text-gray-900 font-semibold flex items-center gap-1">
							Resources <ChevronDown className="w-5 h-5" />
						</Link>
						<Link href="#enterprise" className="text-lg text-gray-700 hover:text-gray-900 font-semibold">
							Enterprise
						</Link>
						<Link href="#pricing" className="text-lg text-gray-700 hover:text-gray-900 font-semibold">
							Pricing
						</Link>
					</nav>
				</div>
				<div className="flex items-center gap-6">
					<Button asChild className="h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg">
						<Link href="/sign-up">Sign up free</Link>
					</Button>
					<Link href="/sign-in" className="text-lg text-gray-700 hover:text-gray-900 font-semibold">Log in</Link>
				</div>
			</div>
		</header>
	);
}


