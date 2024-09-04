"use client";
import React, { SetStateAction, useState } from "react";
import { LockIcon, InfoIcon, GroupIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Autoplay from "embla-carousel-autoplay";

interface AboutItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const aboutItems: AboutItem[] = [
  {
    icon: LockIcon,
    title: "Secure and Private",
    description:
      "Your data is encrypted and stored on a decentralized blockchain network, ensuring your privacy.",
  },
  {
    icon: InfoIcon,
    title: "Transparent and Fair",
    description:
      "Our platform operates on a decentralized model, ensuring transparency and fair distribution of rewards.",
  },
  {
    icon: GroupIcon,
    title: "Join the Community",
    description:
      "Connect with other researchers and contributors to collaborate and share insights.",
  },
];

interface AboutAccordionProps {
  item: AboutItem;
  state: [string | null, React.Dispatch<SetStateAction<string | null>>];
}

const AboutAccordion: React.FC<AboutAccordionProps> = ({
  item,
  state: [expandedItem, setExpandedItem],
}) => (
  <Accordion type="single" collapsible>
    <AccordionItem
      value={item.title.toLowerCase()}
      className={`rounded-lg border bg-background p-6 transition-all hover:shadow-lg ${
        expandedItem === item.title.toLowerCase()
          ? "border-primary"
          : "border-input"
      }`}
    >
      <AccordionTrigger
        onClick={() =>
          setExpandedItem(
            expandedItem === item.title.toLowerCase()
              ? null
              : item.title.toLowerCase()
          )
        }
      >
        <div className="flex items-center gap-4">
          <div className="bg-primary rounded-md p-3 flex items-center justify-center">
            <item.icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold">{item.title}</h3>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="mt-4 text-muted-foreground">
          <p>{item.description}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default function About() {
  const expandedState = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="about">
      <div className="container px-4 md:px-6 space-y-12">
        <div className="flex flex-col  items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Revolutionizing AI Research
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our decentralized platform is transforming the way AI research is
              conducted, empowering individuals to contribute and earn.
            </p>
          </div>
        </div>
        {/* <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-3 lg:gap-12"> */}
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              jump: false,
              delay: 3000,
              playOnInit: true,
            }),
          ]}
          setApi={setApi}
        >
          <CarouselContent className="-ml-1">
            {aboutItems.map((item, index) => (
              <CarouselItem
                className="pl-1 md:basis-1/2 lg:basis-1/3"
                key={index}
              >
                <AboutAccordion item={item} state={expandedState} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* </div> */}
        <div className="text-center mt-8">
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
