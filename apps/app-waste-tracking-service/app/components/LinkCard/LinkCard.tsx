import React from 'react';
import styles from './LinkCard.module.scss';
import Link from 'next/link';

interface Props {
  title?: string;
  content?: string;
  href?: string;
  id?: string;
}

export function LinkCard({
  title,
  href = '#',
  content,
  id,
}: Props): JSX.Element {
  return (
    <Link href={href} className={styles['card']} id={id}>
      <>
        <h2 className={`govuk-heading-s ${styles['card-title']}`}>{title}</h2>
        <p>{content}</p>
      </>
    </Link>
  );
}
