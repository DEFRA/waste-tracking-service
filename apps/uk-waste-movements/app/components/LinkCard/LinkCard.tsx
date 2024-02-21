import React from 'react';
import styles from './LinkCard.module.scss';
import Link from 'next/link';

interface Props {
  title?: string;
  content?: string;
  href?: string;
}

export function LinkCard({ title, href = '#', content }: Props) {
  return (
    <Link href={href} className={styles['card']}>
      <>
        <h2 className={`govuk-heading-m ${styles['card-title']}`}>{title}</h2>
        <p>{content}</p>
      </>
    </Link>
  );
}
