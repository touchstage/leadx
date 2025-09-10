export const siteConfig = {
	project: {
		name: "LeadX",
		tagline: "A platform for sales intel and introductions",
		brand: {
			primary: "#111827",
			accent: "#0EA5E9",
			bg: "#FAFAF9",
			muted: "#6B7280",
			radius: 14,
			font_heading: "Inter",
			font_body: "Inter",
			logo_text: "LeadX",
		},
	},
	layout: {
		container_max_width: 1200,
		section_spacing: 96,
		header_elevation: true,
		sticky_nav_on_scroll: true,
	},
	nav: {
		left_logo: true,
		items: [
			{ label: "Platform", href: "#platform" },
			{ label: "Use cases", href: "#use-cases" },
			{ label: "How it works", href: "#how" },
			{ label: "Trust", href: "#trust" },
			{ label: "Pricing", href: "#pricing" },
		],
		actions: [
			{ label: "Log in", style: "ghost", href: "/login" },
			{ label: "Sign up free", style: "primary", href: "/signup" },
		],
	},
	hero: {
		style: "center",
		headline: "From question to warm lead in seconds",
		subheadline:
			"Buy and sell real sales intel and introductions—pay per piece with escrow. Ask the AI what you need and unlock verified intel right away.",
		bg_pattern: { type: "subtle-dots", opacity: 0.2 },
		cta_primary: { label: "Search with AI", href: "/ask?ai=1" },
		cta_secondary: { label: "Post a demand", href: "/post-demand" },
		trust_badge: "No subscriptions. 20% platform fee. Escrow-protected.",
		ai_prompt_card: {
			elevation: true,
			shadow: "lg",
			width: 720,
			placeholder:
				"Ask anything… e.g., “Fintechs in UAE replacing their CRM this quarter”",
			button: { label: "Find it now", icon: "sparkle" },
			dice_button: { label: "New suggestion", icon: "shuffle" },
			suggestions: [
				"Intro to VP Engineering at a mid-market Indian SaaS (₹4–6 Cr ARR)",
				"Companies hiring Head of Finance in Europe (signals new tooling)",
				"Banks evaluating cyber vendors after recent audit findings",
				"Who’s migrating from Salesforce to HubSpot in GCC?",
				"Warm intros to procurement heads in logistics (APAC)",
			],
			microcopy: "AI answers backed by real posts. Access free intel or unlock premium details.",
			terms_hint: "No personal data trading. Business-intel only.",
		},
	},
};


