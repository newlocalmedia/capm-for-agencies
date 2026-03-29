export const riskQuestions = [
  {
    id: 'client',
    route: 'client',
    title: 'What is this client relationship like?',
    label: 'Client track record',
    why: 'Client risk often turns into approval friction, scope churn, slow feedback, and collection stress.',
    options: [
      { value: 1, title: 'Long-term and reliable', desc: 'We know how they work and they follow through.' },
      { value: 2, title: 'Repeat client, generally solid', desc: 'There is history and not much drama.' },
      { value: 3, title: 'New but well-vetted', desc: 'New relationship, but signals look good.' },
      { value: 4, title: 'New and still uncertain', desc: 'We do not know enough yet.' },
      { value: 5, title: 'Red flags already visible', desc: 'Trust, process, or payment concerns are already showing up.' }
    ]
  },
  {
    id: 'scope',
    route: 'scope',
    title: 'How clear is the scope right now?',
    label: 'Scope clarity',
    why: 'Unclear scope under fixed-fee pricing is one of the fastest ways agencies underprice risk.',
    options: [
      { value: 1, title: 'Very clear', desc: 'Requirements are concrete and bounded.' },
      { value: 2, title: 'Mostly clear', desc: 'Some open questions, but the shape is solid.' },
      { value: 3, title: 'Partly defined', desc: 'Enough to discuss, not enough to trust fully.' },
      { value: 4, title: 'Vague', desc: 'Major assumptions are still carrying the quote.' },
      { value: 5, title: 'Still emerging', desc: 'Discovery is probably the real next step.' }
    ]
  },
  {
    id: 'tech',
    route: 'tech',
    title: 'How technically difficult or uncertain is the work?',
    label: 'Technical complexity',
    why: 'The more uncertainty the team has to discover while delivering, the more margin the work should usually clear.',
    options: [
      { value: 1, title: 'Routine', desc: 'Standard work, familiar stack, little uncertainty.' },
      { value: 2, title: 'Slightly complex', desc: 'Some moving parts, but mostly familiar.' },
      { value: 3, title: 'Moderately complex', desc: 'New pieces or meaningful unknowns.' },
      { value: 4, title: 'High complexity', desc: 'Significant uncertainty, integration risk, or R&D.' },
      { value: 5, title: 'Very high complexity', desc: 'Experimental, fragile, or full of unknowns.' }
    ]
  },
  {
    id: 'capacity',
    route: 'capacity',
    title: 'How much room does your team actually have for this?',
    label: 'Internal capacity',
    why: 'A risky project becomes much riskier when it lands on a team with no recovery room.',
    options: [
      { value: 1, title: 'Plenty of room', desc: 'Strong coverage and good slack.' },
      { value: 2, title: 'Comfortable', desc: 'The team can absorb this well.' },
      { value: 3, title: 'Tight but manageable', desc: 'It fits, but not loosely.' },
      { value: 4, title: 'Stretched', desc: 'This will create pressure.' },
      { value: 5, title: 'Already overloaded', desc: 'The team would be taking on too much.' }
    ]
  },
  {
    id: 'contract',
    route: 'contract',
    title: 'How much delivery risk does the contract push onto you?',
    label: 'Contract type',
    why: 'Commercial structure changes how expensive uncertainty becomes.',
    options: [
      { value: 1, title: 'Time and materials', desc: 'Scope can move without breaking the model.' },
      { value: 2, title: 'Capped time and materials', desc: 'Mostly flexible, but with limits.' },
      { value: 3, title: 'Hybrid', desc: 'Some fixed, some flexible.' },
      { value: 4, title: 'Fixed fee with some cushion', desc: 'There is still risk in the commercial structure.' },
      { value: 5, title: 'Tight fixed fee', desc: 'Most estimation error lands on the agency.' }
    ]
  },
  {
    id: 'political',
    route: 'stakeholders',
    title: 'How complicated is the stakeholder environment?',
    label: 'Stakeholder complexity',
    why: 'Projects often fail commercially because stakeholder friction gets priced too lightly.',
    options: [
      { value: 1, title: 'Simple', desc: 'One clear decision-maker or a tightly aligned small group.' },
      { value: 2, title: 'Mostly manageable', desc: 'A few stakeholders, but roles are clear.' },
      { value: 3, title: 'Moderately complex', desc: 'More voices and some coordination risk.' },
      { value: 4, title: 'Messy', desc: 'Conflicting priorities or unclear authority.' },
      { value: 5, title: 'Highly political', desc: 'Decision-making is fragmented, unstable, or adversarial.' }
    ]
  },
  {
    id: 'timeline',
    route: 'timeline',
    title: 'How much schedule pressure is built into this project?',
    label: 'Timeline pressure',
    why: 'Aggressive timelines make every mistake more expensive.',
    options: [
      { value: 1, title: 'Flexible', desc: 'Timing is realistic and adjustable.' },
      { value: 2, title: 'Reasonable', desc: 'A real deadline, but manageable.' },
      { value: 3, title: 'Firm', desc: 'Some pressure, but not extreme.' },
      { value: 4, title: 'Aggressive', desc: 'Little slack, high coordination pressure.' },
      { value: 5, title: 'Immovable', desc: 'The deadline dominates delivery decisions.' }
    ]
  }
];

export const baselineQuestions = [
  {
    id: 'safeMargin',
    route: 'baseline-safe',
    title: 'What margin do you usually get from your safest work?',
    label: 'Safe-work margin (%)',
    placeholder: '10',
    unit: '%',
    why: 'This gives the tool a starting point: the return your agency expects before project-specific uncertainty enters the picture.',
    help: 'Think retainers, maintenance, recurring support, or other low-drama work.'
  },
  {
    id: 'typicalMargin',
    route: 'baseline-typical',
    title: 'What margin do you usually target on normal projects?',
    label: 'Typical project margin (%)',
    placeholder: '22',
    unit: '%',
    why: 'This helps size the gap between safe work and normal project work.',
    help: 'This is your normal benchmark for project work, not your safest work.'
  }
];

export const commercialFields = [
  {
    id: 'dealPrice',
    label: 'Quoted project price',
    placeholder: '120000',
    unit: '$',
    help: 'What the client would pay under the current proposal.'
  },
  {
    id: 'deliveryCost',
    label: 'Estimated delivery cost',
    placeholder: '90000',
    unit: '$',
    help: 'Your best estimate of internal delivery cost, including labor and meaningful project costs.'
  }
];
