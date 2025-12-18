import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  link: string;
  imageUrl: string;
  imageAlt: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Housing',
    description: (
      <>
        Strategies for affordable and diverse housing options to support
        Nederland&apos;s growing community and ensure residents can thrive.
      </>
    ),
    link: '/housing/overview',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
    imageAlt: 'Housing and residential buildings',
  },
  {
    title: 'Transportation',
    description: (
      <>
        Infrastructure and connectivity planning to improve mobility and
        access throughout the Peak-to-Peak region.
      </>
    ),
    link: '/transportation/overview',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
    imageAlt: 'Small town street',
  },
  {
    title: 'Natural Resources & Hazards',
    description: (
      <>
        Environmental protection and hazard mitigation strategies to preserve
        Nederland&apos;s unique mountain ecosystem and protect the community.
      </>
    ),
    link: '/natural-resources-hazards/overview',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    imageAlt: 'Mountain landscape',
  },
  {
    title: 'Economic Development',
    description: (
      <>
        Supporting a robust local economy and vibrant arts and culture scene
        that creates opportunities for residents and businesses.
      </>
    ),
    link: '/economic-development/overview',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    imageAlt: 'Business and economic development',
  },
  {
    title: 'Recreation',
    description: (
      <>
        Parks, trails, and recreational opportunities that enhance quality of
        life and celebrate Nederland&apos;s outdoor mountain culture.
      </>
    ),
    link: '/recreation/overview',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    imageAlt: 'Outdoor recreation',
  },
  {
    title: 'Health & Human Services',
    description: (
      <>
        Community health and social services that support the wellbeing of all
        residents and strengthen social cohesion.
      </>
    ),
    link: '/health-human-services/overview',
    imageUrl: 'https://images.unsplash.com/photo-1478476868527-002ae3f3e159?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Health and community services',
  },
];

function Feature({title, description, link, imageUrl, imageAlt}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.featureLink}>
        <div className="text--center">
          <img
            src={imageUrl}
            alt={imageAlt}
            className={styles.featureImage}
          />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
