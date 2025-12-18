import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  comprehensivePlanSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'introduction/overview',
        'introduction/about-nederland',
        'introduction/about-plan',
        'introduction/resilience-framework',
      ],
    },
    {
      type: 'category',
      label: 'Land Use',
      items: [
        'land-use/overview',
        'land-use/existing-conditions',
        'land-use/objectives-strategies',
      ],
    },
    {
      type: 'category',
      label: 'Housing',
      items: [
        'housing/overview',
        'housing/existing-conditions',
        'housing/objectives-strategies',
      ],
    },
    {
      type: 'category',
      label: 'Recreation',
      items: [
        'recreation/overview',
        'recreation/existing-conditions',
        'recreation/objectives-strategies',
      ],
    },
    {
      type: 'category',
      label: 'Transportation',
      items: [
        'transportation/overview',
        'transportation/existing-conditions',
        'transportation/objectives-strategies',
      ],
    },
    {
      type: 'category',
      label: 'Health & Human Services',
      items: [
        'health-human-services/overview',
        'health-human-services/existing-conditions',
        'health-human-services/objectives-strategies',
      ],
    },
    {
      type: 'category',
      label: 'Utilities & Water Resources',
      items: [
        'utilities-water/overview',
        'utilities-water/existing-conditions',
        'utilities-water/objectives-strategies',
      ],
    },
    {
      type: 'category',
      label: 'Natural Resources & Hazards',
      items: [
        'natural-resources-hazards/overview',
        'natural-resources-hazards/existing-conditions',
        'natural-resources-hazards/objectives-strategies',
      ],
    },
    {
      type: 'category',
      label: 'Economic Development & Arts + Culture',
      items: [
        'economic-development/overview',
        'economic-development/existing-conditions',
        'economic-development/objectives-strategies',
      ],
    },
    {
      type: 'category',
      label: 'Implementation',
      items: [
        'implementation/overview',
      ],
    },
  ],
};

export default sidebars;
