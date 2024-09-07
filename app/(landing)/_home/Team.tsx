import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

const teamMembers = [
  {
    name: "John Doe",
    role: "Co-Founder, CEO",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Jane Appleseed",
    role: "Co-Founder, CTO",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Kara Sato",
    role: "Lead Researcher",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Michael Ramos",
    role: "Blockchain Engineer",
    avatar: "/placeholder-user.jpg",
  },
];

export default function Team() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="team">
      <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Meet the Team
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our team of experts is dedicated to revolutionizing the way AI
            research is conducted.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-xl bg-background p-6"
            >
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
