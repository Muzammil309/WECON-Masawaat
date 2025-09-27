import { EventForm } from '@/components/events/event-form'

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-muted-foreground mt-2">
          Start planning your next amazing event
        </p>
      </div>
      
      <EventForm />
    </div>
  )
}
