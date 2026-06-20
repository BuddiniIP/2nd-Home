import { useState } from 'react';
import { ContactCard } from "@/components/ui/contact-card";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export function ContactSection() {
	const [form, setForm] = useState({ name: '', email: '', message: '' });
	const [submitting, setSubmitting] = useState(false);
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setStatus('idle');
		try {
			const res = await fetch(`${apiBase}/api/contact`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			if (!res.ok) throw new Error('Failed to send message');
			setStatus('success');
			setForm({ name: '', email: '', message: '' });
		} catch {
			setStatus('error');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="py-32 px-6 bg-white">
			<div className="max-w-7xl mx-auto">
				<ContactCard
					title="Get in touch"
					description="If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day."
					contactInfo={[
						{
							icon: Mail,
							label: 'Email',
							value: 'contact@2ndhome.lk',
						},
						{
							icon: Phone,
							label: 'Phone',
							value: '+94 11 234 5678',
						},
						{
							icon: MapPin,
							label: 'Address',
							value: 'University Road, Colombo, Sri Lanka',
							className: 'col-span-1 md:col-span-2 lg:col-span-1',
						}
					]}
				>
					<form className="w-full space-y-4" onSubmit={handleSubmit}>
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="message">Message</Label>
							<Textarea id="message" placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
						</div>
						{status === 'success' && <p className="text-green-600 text-sm flex items-center gap-2"><CheckCircle size={16} /> Message sent successfully!</p>}
						{status === 'error' && <p className="text-red-500 text-sm flex items-center gap-2"><AlertCircle size={16} /> Failed to send. Please try again.</p>}
						<Button disabled={submitting} className="w-full bg-black text-white hover:bg-accent-orange transition-colors disabled:opacity-50" type="submit">
							{submitting ? 'Sending...' : 'Submit'}
						</Button>
					</form>
				</ContactCard>
			</div>
		</section>
	);
}
