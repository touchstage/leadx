"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, Tag, FileText, X } from "lucide-react";

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

interface RequestIntelModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialQuery?: string;
}

export function RequestIntelModal({ isOpen, onClose, initialQuery = "" }: RequestIntelModalProps) {
	const { user, isLoaded } = useUser();
	
	const [formData, setFormData] = useState<FormData>({
		title: initialQuery,
		description: initialQuery,
		bounty: 50,
		deadline: 7,
		category: "Technology",
		additionalDetails: "",
	});
	
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");

	// Update form when initialQuery changes (only once when modal opens)
	useEffect(() => {
		if (initialQuery && isOpen) {
			setFormData(prev => ({
				...prev,
				title: initialQuery,
				description: initialQuery
			}));
		}
	}, [initialQuery, isOpen]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		
		// Check authentication
		if (!user) {
			// Save form and redirect to sign-in
			localStorage.setItem('pendingDemand', JSON.stringify(formData));
			window.location.href = '/sign-in?redirect_url=' + window.location.pathname;
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
				// Close modal and redirect to demand detail page
				onClose();
				window.location.href = `/demand/${result.id}`;
			} else {
				setMessage("Failed to create demand. Please try again.");
			}
		} catch (error) {
			setMessage("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
				{/* Header */}
				<DialogHeader className="pb-6 border-b border-stone-200">
					<DialogTitle className="flex items-center gap-3 text-3xl font-semibold text-stone-900">
						<FileText className="w-8 h-8" />
						Request Intel
					</DialogTitle>
					<DialogDescription className="text-lg text-stone-600 mt-2">
						Tell us what you're looking for and set a bounty. Sellers will respond with relevant intel.
					</DialogDescription>
				</DialogHeader>

				{/* Form Content */}
				<div className="flex-1 overflow-y-auto py-6">
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Title */}
						<div className="space-y-3">
							<Label htmlFor="title" className="text-lg font-semibold text-stone-900">
								What are you looking for? *
							</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
								placeholder="e.g., Companies looking to integrate a copilot in their products"
								className="w-full h-14 text-lg border-2 border-stone-200 focus:border-stone-400 rounded-xl px-4"
								required
							/>
						</div>

						{/* Description */}
						<div className="space-y-3">
							<Label htmlFor="description" className="text-lg font-semibold text-stone-900">
								Description
							</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Provide more details about what you're looking for..."
								rows={4}
								className="w-full text-lg border-2 border-stone-200 focus:border-stone-400 rounded-xl px-4 py-3 resize-none"
							/>
						</div>

						{/* Bounty and Category Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Bounty */}
							<div className="space-y-3">
								<Label className="text-lg font-semibold text-stone-900 flex items-center gap-2">
									<DollarSign className="w-5 h-5" />
									How much are you willing to pay? *
								</Label>
								<Select 
									value={formData.bounty.toString()} 
									onValueChange={(value) => setFormData(prev => ({ ...prev, bounty: parseInt(value) }))}
								>
									<SelectTrigger className="w-full h-14 text-lg border-2 border-stone-200 focus:border-stone-400 rounded-xl px-4">
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
								<Label className="text-lg font-semibold text-stone-900 flex items-center gap-2">
									<Tag className="w-5 h-5" />
									Category
								</Label>
								<Select 
									value={formData.category} 
									onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
								>
									<SelectTrigger className="w-full h-14 text-lg border-2 border-stone-200 focus:border-stone-400 rounded-xl px-4">
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
						</div>

						{/* Deadline */}
						<div className="space-y-3">
							<Label className="text-lg font-semibold text-stone-900 flex items-center gap-2">
								<Calendar className="w-5 h-5" />
								Deadline
							</Label>
							<Select 
								value={formData.deadline.toString()} 
								onValueChange={(value) => setFormData(prev => ({ ...prev, deadline: parseInt(value) }))}
							>
								<SelectTrigger className="w-full h-14 text-lg border-2 border-stone-200 focus:border-stone-400 rounded-xl px-4">
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
							<Label htmlFor="additionalDetails" className="text-lg font-semibold text-stone-900">
								Additional Requirements
							</Label>
							<Textarea
								id="additionalDetails"
								value={formData.additionalDetails}
								onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
								placeholder="Any specific requirements, preferences, or additional context..."
								rows={4}
								className="w-full text-lg border-2 border-stone-200 focus:border-stone-400 rounded-xl px-4 py-3 resize-none"
							/>
						</div>

						{/* Message */}
						{message && (
							<div className={`text-center text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
								{message}
							</div>
						)}

						{/* Auth Notice */}
						{!session && (
							<div className="text-center text-sm text-stone-500 bg-stone-100 p-4 rounded-xl">
								You'll be asked to sign in before submitting your request.
							</div>
						)}
					</form>
				</div>

				{/* Footer */}
				<div className="pt-6 border-t border-stone-200">
					<div className="flex gap-4">
						<Button 
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1 h-14 text-lg font-medium border-2 border-stone-300 hover:border-stone-400 rounded-xl"
						>
							Cancel
						</Button>
						<Button 
							onClick={handleSubmit}
							className="flex-1 h-14 text-lg font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-xl" 
							disabled={isSubmitting || !formData.title.trim()}
						>
							{isSubmitting ? "Creating Request..." : "Request Intel"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
