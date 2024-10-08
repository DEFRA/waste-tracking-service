interface Props {
  mainId?: string;
  text?: string;
  testId?: string;
}

export const SkipLink = ({
  mainId = 'main-content',
  text = 'Skip to main content',
  testId,
}: Props): JSX.Element => {
  return (
    <a href={`#${mainId}`} className={`govuk-skip-link`} data-testid={testId}>
      {text}
    </a>
  );
};
