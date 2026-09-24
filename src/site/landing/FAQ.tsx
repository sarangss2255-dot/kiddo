import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/Accordion';
import { Reveal } from './Reveal';

const faqs = [
  {
    question: 'Is KidDo for parents or children?',
    answer: 'Both. KidDo has separate Parent and Child experiences designed for each audience.',
  },
  {
    question: 'Can teachers use KidDo?',
    answer: 'Yes. Teachers can access a dedicated Teacher Workspace through the KidDo Adult App.',
  },
  {
    question: 'Is the child app separate?',
    answer: 'Yes. KidDo uses separate Parent/Adult and Child applications.',
  },
  {
    question: 'Can parents control rewards?',
    answer: 'Yes. Parents set up and manage rewards in the Parent App.',
  },
  {
    question: 'Can school assignments appear in the child app?',
    answer: 'Yes. School assignments and home tasks can appear together in the child\'s daily experience.',
  },
  {
    question: 'Does KidDo support multiple children?',
    answer: 'Yes. Parents can manage multiple children from one account.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-kiddo-warm">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight text-kiddo-navy">
              Frequently Asked Questions
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-slate-200/80 bg-white px-6 shadow-sm">
            <Accordion type="single" collapsible defaultValue="item-0">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-[15px] md:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
