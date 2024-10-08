import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class CustomDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage;

    const sheet = new ServerStyleSheet();

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        enhanceComponent: (Component) => Component,
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = sheet.getStyleElement();

    return { ...initialProps, styles };
  }

  render(): JSX.Element {
    return (
      <Html
        className={`govuk-template ${
          process.env['NODE_ENV'] !== 'production' ? 'env-local' : ''
        }`}
        lang="en"
      >
        <Head>{this.props.styles}</Head>
        <body className="govuk-template__body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
