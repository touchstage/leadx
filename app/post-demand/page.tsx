"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, DollarSign, Calendar, Tag, FileText } from "lucide-react";

const BOUNTY_AMOUNTS = [
	{ value: 25, label: "$25 - Quick intel" },
	{ value: 50, label: "$50 - Standard intel" },
	{ value: 100, label: "$100 - Premium intel" },
	{ value: 200, label: "$200 - Custom amount" },
];

const DEADLINE_OPTIONS = [
	{ value: 1, label: "1 day" },
	{ value: 3, label: "3 days" },
	{ value: 7, label: "7 days" },
	{ value: 14, label: "14 days" },
	{ value: 30, label: "30 days" },
];

const CATEGORIES = [
	"Technology",
	"Finance",
	"Healthcare",
	"E-commerce",
	"Manufacturing",
	"Real Estate",
	"Education",
	"Other"
];

interface FormData {
	title: string;
	description: string;
	bounty: number;
	deadline: number;
	category: string;
	additionalDetails: string;
}

export default function PostDemandPage() {
	const { user, isLoaded } = useUser();
	const searchParams = useSearchParams();
	const router = useRouter();
	
	const [formData, setFormData] = useState<FormData>({
		title: "",
		description: "",
		bounty: 50,
		deadline: 7,
		category: "Technology",
		additionalDetails: "",
	});
	
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");

	// Pre-fill form from URL query or saved state
	useEffect(() => {
		const query = searchParams.get('q');
		const savedForm = localStorage.getItem('pendingDemand');
		
		if (query) {
			setFormData(prev => ({
				...prev,
				title: decodeURIComponent(query),
				description: decodeURIComponent(query)
			}));
		} else if (savedForm) {
			const parsed = JSON.parse(savedForm);
			setFormData(prev => ({ ...prev, ...parsed }));
		}
	}, [searchParams]);

	// Save form state to localStorage
	useEffect(() => {
		localStorage.setItem('pendingDemand', JSON.stringify(formData));
	}, [formData]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		
		// Check authentication
		if (!user) {
			// Save form and redirect to sign-in
			localStorage.setItem('pendingDemand', JSON.stringify(formData));
			window.location.href = '/sign-in?redirect_url=/post-demand';
			return;
		}

		setIsSubmitting(true);
		setMessage("");

		try {
			const res = await fetch("/api/demands/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: formData.title,
					description: formData.description,
					bountyCredits: formData.bounty,
					deadline: formData.deadline,
					category: formData.category,
					additionalDetails: formData.additionalDetails,
				}),
			});

			if (res.ok) {
				const result = await res.json();
				// Clear saved form
				localStorage.removeItem('pendingDemand');
				// Redirect to demand detail page
				router.push(`/demand/${result.id}`);
			} else {
				setMessage("Failed to create demand. Please try again.");
			}
		} catch (error) {
			setMessage("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto"></div>
					<p className="mt-2 text-stone-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="border-b border-stone-200">
				<div className="max-w-4xl mx-auto px-6 py-4">
					<Button 
						variant="ghost" 
						onClick={() => router.back()}
						className="mb-4 -ml-2"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-2xl mx-auto px-6 py-12">
				{/* Page Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-stone-900 mb-4">Request Intel</h1>
					<p className="text-xl text-stone-600">
						Tell us what you're looking for and set a bounty. Sellers will respond with relevant intel.
					</p>
				</div>

				{/* Form */}
				<div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Title */}
						<div className="space-y-3">
							<Label htmlFor="title" className="text-base font-medium text-stone-900">
								What are you looking for? *
							</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
								placeholder="e.g., Companies looking to integrate a copilot in their products"
								className="w-full h-16 text-base border-2 border-stone-200 focus:border-stone-400 rounded-lg px-4 placeholder:text-base"
								required
							/>
						</div>

						{/* Description */}
						<div className="space-y-3">
							<Label htmlFor="description" className="text-base font-medium text-stone-900">
								Description
							</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Provide more details about what you're looking for..."
								rows={4}
								className="w-full text-base border-2 border-stone-200 focus:border-stone-400 rounded-lg px-4 py-3 resize-none placeholder:text-base"
							/>
						</div>

						{/* Bounty */}
						<div className="space-y-3">
							<Label className="text-base font-medium text-stone-900 flex items-center gap-2">
								<DollarSign className="w-4 h-4" />
								How much are you willing to pay? *
							</Label>
							<Select 
								value={formData.bounty.toString()} 
								onValueChange={(value) => setFormData(prev => ({ ...prev, bounty: parseInt(value) }))}
							>
								<SelectTrigger className="w-full h-16 text-base border-2 border-stone-200 focus:border-stone-400 rounded-lg px-4">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{BOUNTY_AMOUNTS.map((option) => (
										<SelectItem key={option.value} value={option.value.toString()}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Category */}
						<div className="space-y-3">
							<Label className="text-base font-medium text-stone-900 flex items-center gap-2">
								<Tag className="w-4 h-4" />
								Category
							</Label>
							<Select 
								value={formData.category} 
								onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
							>
								<SelectTrigger className="w-full h-16 text-base border-2 border-stone-200 focus:border-stone-400 rounded-lg px-4">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CATEGORIES.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Deadline */}
						<div className="space-y-3">
							<Label className="text-base font-medium text-stone-900 flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								Deadline
							</Label>
							<Select 
								value={formData.deadline.toString()} 
								onValueChange={(value) => setFormData(prev => ({ ...prev, deadline: parseInt(value) }))}
							>
								<SelectTrigger className="w-full h-16 text-base border-2 border-stone-200 focus:border-stone-400 rounded-lg px-4">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{DEADLINE_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value.toString()}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Additional Details */}
						<div className="space-y-3">
							<Label htmlFor="additionalDetails" className="text-base font-medium text-stone-900">
								Additional Requirements
							</Label>
							<Textarea
								id="additionalDetails"
								value={formData.additionalDetails}
								onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
								placeholder="Any specific requirements, preferences, or additional context..."
								rows={4}
								className="w-full text-base border-2 border-stone-200 focus:border-stone-400 rounded-lg px-4 py-3 resize-none placeholder:text-base"
							/>
						</div>

						{/* Message */}
						{message && (
							<div className={`text-center text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
								{message}
							</div>
						)}

						{/* Auth Notice */}
						{!user && (
							<div className="text-center text-sm text-stone-500 bg-stone-100 p-4 rounded-xl">
								You'll be asked to sign in before submitting your request.
							</div>
						)}

						{/* Submit Button */}
						<div className="pt-6">
							<Button 
								type="submit" 
								className="w-full h-16 text-base font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg"
								disabled={isSubmitting || !formData.title.trim()}
							>
								{isSubmitting ? "Creating Request..." : "Request Intel"}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}


