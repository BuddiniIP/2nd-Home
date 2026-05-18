import { ContactCard } from "@/components/ui/contact-card";
import { Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ContactSection() {
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
					<form action="" className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" type="text" placeholder="Your Name" />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="your@email.com" />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="message">Message</Label>
							<Textarea id="message" placeholder="How can we help you?" />
						</div>
						<Button className="w-full bg-black text-white hover:bg-accent-orange transition-colors" type="button">
							Submit
						</Button>
					</form>
				</ContactCard>
			</div>
		</section>
	);
}
