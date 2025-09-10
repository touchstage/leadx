"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { Sparkles, Shuffle, CheckCircle, DollarSign, Shield, Star } from "lucide-react";
import { gsap } from "gsap";

export function Hero() {
	const suggestions = siteConfig.hero.ai_prompt_card.suggestions as string[];
	const [index, setIndex] = useState(0);
	const [query, setQuery] = useState("");
	const [isAnimating, setIsAnimating] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const textRef = useRef<HTMLDivElement>(null);
	const currentSuggestion = useMemo(() => suggestions[index % suggestions.length], [index, suggestions]);

	const animateText = (text: string) => {
		if (!textRef.current || isAnimating) return;
		
		setIsAnimating(true);
		textRef.current.innerHTML = "";
		
		const words = text.split(" ");
		words.forEach((word, i) => {
			const span = document.createElement("span");
			span.textContent = word;
			span.style.opacity = "0";
			span.style.marginRight = "0.25em"; // Add space between words
			textRef.current?.appendChild(span);
			
			gsap.to(span, {
				opacity: 1,
				duration: 0.1,
				delay: i * 0.05,
				ease: "power2.out"
			});
		});
		
		setTimeout(() => setIsAnimating(false), words.length * 50 + 500);
	};

	useEffect(() => {
		animateText(currentSuggestion);
	}, [currentSuggestion]);

	useEffect(() => {
		if (!isFocused) {
			const id = setInterval(() => setIndex((i) => i + 1), 5000);
			return () => clearInterval(id);
		}
	}, [isFocused]);


	const handleNewSuggestion = () => {
		// Add shuffle animation
		if (textRef.current) {
			gsap.to(textRef.current, {
				rotationY: 180,
				duration: 0.3,
				ease: "power2.inOut",
				onComplete: () => {
					setIndex((i) => i + 1);
					gsap.to(textRef.current, {
						rotationY: 0,
						duration: 0.3,
						ease: "power2.inOut"
					});
				}
			});
		} else {
			setIndex((i) => i + 1);
		}
	};

	return (
		<>
			<style jsx>{`
				[contenteditable]:empty:before {
					content: attr(data-placeholder);
					color: #a8a29e;
					pointer-events: none;
				}
			`}</style>
			<section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-stone-50 via-amber-50/30 to-orange-50/20 pt-16 pb-32">
			{/* Dotted background pattern */}
			<div
				className="absolute inset-0 opacity-30"
				style={{
					backgroundImage: "radial-gradient(#d6d3d1 1px, transparent 1px)",
					backgroundSize: "32px 32px",
				}}
			/>
			
			<div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
				<h2 className="text-xl sm:text-2xl text-stone-500 font-medium leading-relaxed">
					From question to warm lead in seconds
				</h2>
				<h1 className="text-6xl sm:text-7xl lg:text-7xl font-medium text-stone-900 leading-[1.1] tracking-tight mt-4">
					Get verified sales intel and warm introductions, instantly
				</h1>
				<p className="text-lg sm:text-xl text-stone-500 mt-6 font-normal leading-relaxed max-w-3xl mx-auto">
					Escrow-protected. Pay only per piece. No subscriptions, just results.
				</p>
				
				<div className="mx-auto mt-16 w-full max-w-3xl">
					<div className="relative rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 min-h-[180px] flex flex-col overflow-hidden">
						{/* Animated gradient background */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 animate-pulse opacity-50"></div>
						<div className="absolute inset-0 bg-gradient-to-br from-cyan-50/20 via-indigo-50/30 to-violet-50/20 animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
						<div className="absolute inset-0 bg-gradient-to-tl from-emerald-50/20 via-teal-50/30 to-blue-50/20 animate-pulse opacity-30" style={{ animationDelay: '2s' }}></div>
						<div className="flex-1 flex items-start relative z-10">
							<div
								ref={textRef}
								contentEditable
								suppressContentEditableWarning
								onInput={(e) => setQuery(e.currentTarget.textContent || "")}
								onFocus={() => {
									setIsFocused(true);
									if (textRef.current && !query) {
										textRef.current.textContent = "";
									}
								}}
								onBlur={() => setIsFocused(false)}
								className="w-full text-lg text-stone-800 font-medium outline-none cursor-text min-h-[60px] rounded-lg px-3 py-2 transition-all duration-200"
								style={{ 
									lineHeight: '1.5',
									display: 'block',
									textAlign: 'left',
									verticalAlign: 'top'
								}}
								data-placeholder={isFocused && !query ? "Ask anything… e.g., 'Fintechs in UAE replacing their CRM this quarter'" : ""}
							>
								{!isFocused && !query && currentSuggestion}
							</div>
						</div>
						
						<div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 relative z-10">
							<Button 
								type="button" 
								variant="ghost" 
								onClick={handleNewSuggestion}
								className="h-12 px-6 text-stone-500 hover:text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-full font-normal"
							>
								<Shuffle className="mr-2 h-5 w-5" />
								New Suggestion
							</Button>
							<div className="flex gap-4">
								<Button 
									onClick={() => {
										window.location.href = `/home`;
									}}
									variant="outline"
									className="h-12 px-8 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full text-lg font-medium"
								>
									Get Started
								</Button>
									<Button 
										onClick={() => {
											window.location.href = `/home`;
										}}
										className="h-12 px-8 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-lg font-medium" 
									>
										Get Started
									</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
					<div className="flex items-center gap-2">
						<CheckCircle className="w-4 h-4 text-stone-500" />
						<span>No subscriptions</span>
					</div>
					<div className="flex items-center gap-2">
						<DollarSign className="w-4 h-4 text-stone-500" />
						<span>20% platform fee</span>
					</div>
					<div className="flex items-center gap-2">
						<Shield className="w-4 h-4 text-stone-500" />
						<span>Escrow-protected</span>
					</div>
					<div className="flex items-center gap-2">
						<Star className="w-4 h-4 text-stone-500" />
						<span>Verified by ratings</span>
					</div>
				</div>
			</div>
		</section>
		</>
	);
}


