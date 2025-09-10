type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
	const { id } = await params;
	return (
		<div className="p-6">
			<h2 className="text-2xl font-semibold">Profile</h2>
			<p className="text-sm text-muted-foreground">User ID: {id}</p>
		</div>
	);
}


